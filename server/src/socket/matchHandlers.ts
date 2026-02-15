import { Server, Socket } from 'socket.io';
import { roomManager } from './roomManager';
import { timerManager } from './timerManager';
import * as matchService from '../services/matchService';
import * as roundService from '../services/roundService';
import { matchToResponse } from '../routes/matches';
import { isValidItem, SYNC_PHASE_DURATION, TRANSMISSION_PHASE_DURATION } from '../shared/constants';

export function registerMatchHandlers(io: Server, socket: Socket) {
  // --- match:join ---
  socket.on('match:join', async (payload: { matchId: string; role: 'transmitter' | 'receiver' }) => {
    const { matchId, role } = payload;

    const match = await matchService.getMatch(matchId);
    if (!match) {
      socket.emit('match:error', { message: 'Match not found' });
      return;
    }

    const joined = roomManager.join(matchId, socket.id, role);
    if (!joined) {
      socket.emit('match:error', { message: `Role "${role}" is already taken` });
      return;
    }

    socket.join(`match:${matchId}`);
    console.log(`[Socket] ${socket.id} joined match:${matchId} as ${role}`);

    // Notify others in room
    socket.to(`match:${matchId}`).emit('match:playerJoined', { role });

    // Send current match state to the joining player
    socket.emit('match:updated', matchToResponse(match));
  });

  // --- match:leave ---
  socket.on('match:leave', (payload: { matchId: string }) => {
    handleLeave(io, socket, payload.matchId);
  });

  // --- match:setReady ---
  socket.on('match:setReady', async (payload: { matchId: string; role: 'transmitter' | 'receiver'; ready: boolean }) => {
    const { matchId, role, ready } = payload;

    try {
      const updated = await matchService.setReady(matchId, role, ready);

      // Broadcast updated state
      io.to(`match:${matchId}`).emit('match:updated', matchToResponse(updated));

      // Check if both players are ready → transition to sync
      if (updated.transmitterReady && updated.receiverReady && updated.state === 'lobby') {
        await startSyncPhase(io, matchId);
      }
    } catch (err) {
      console.error('[match:setReady]', err);
      socket.emit('match:error', { message: 'Failed to update ready state' });
    }
  });

  // --- match:submitTransmitterChoice ---
  socket.on('match:submitTransmitterChoice', async (payload: { matchId: string; item: string }) => {
    const { matchId, item } = payload;

    try {
      const match = await matchService.getMatch(matchId);
      if (!match) {
        socket.emit('match:error', { message: 'Match not found' });
        return;
      }

      if (!isValidItem(match.gameMode, item)) {
        socket.emit('match:error', { message: `Invalid item "${item}" for mode "${match.gameMode}"` });
        return;
      }

      const updated = await matchService.submitTransmitterChoice(matchId, item);
      io.to(`match:${matchId}`).emit('match:updated', matchToResponse(updated));
    } catch (err) {
      console.error('[match:submitTransmitterChoice]', err);
      socket.emit('match:error', { message: 'Failed to submit choice' });
    }
  });

  // --- match:submitReceiverChoice ---
  socket.on('match:submitReceiverChoice', async (payload: { matchId: string; item: string }) => {
    const { matchId, item } = payload;

    try {
      const match = await matchService.getMatch(matchId);
      if (!match) {
        socket.emit('match:error', { message: 'Match not found' });
        return;
      }

      if (match.state !== 'transmission') {
        socket.emit('match:error', { message: 'Not in transmission phase' });
        return;
      }

      if (!isValidItem(match.gameMode, item)) {
        socket.emit('match:error', { message: `Invalid item "${item}"` });
        return;
      }

      // Calculate response time
      const responseTimeMs = match.phaseStartedAt
        ? Date.now() - new Date(match.phaseStartedAt).getTime()
        : null;

      // Update match with receiver's choice
      await matchService.submitReceiverChoice(matchId, item);

      // Determine correctness
      const isCorrect = item === match.selectedItem;

      // Create round record
      await roundService.createRound({
        matchId,
        gameMode: match.gameMode,
        selectedItem: match.selectedItem!,
        receiverChoice: item,
        isCorrect,
        responseTimeMs: responseTimeMs || undefined,
      });

      // Stop transmission timer and transition to result
      timerManager.clearTimer(matchId);
      const resultMatch = await matchService.transitionState(matchId, 'result');

      io.to(`match:${matchId}`).emit('match:result', {
        isCorrect,
        selectedItem: match.selectedItem,
        receiverChoice: item,
      });
      io.to(`match:${matchId}`).emit('match:updated', matchToResponse(resultMatch));
    } catch (err) {
      console.error('[match:submitReceiverChoice]', err);
      socket.emit('match:error', { message: 'Failed to submit choice' });
    }
  });

  // --- match:playAgain ---
  socket.on('match:playAgain', async (payload: { matchId: string }) => {
    const { matchId } = payload;

    try {
      const updated = await matchService.transitionState(matchId, 'lobby');
      io.to(`match:${matchId}`).emit('match:updated', matchToResponse(updated));
    } catch (err) {
      console.error('[match:playAgain]', err);
      socket.emit('match:error', { message: 'Failed to restart match' });
    }
  });

  // --- disconnect ---
  socket.on('disconnect', () => {
    const info = roomManager.leave(socket.id);
    if (info) {
      console.log(`[Socket] ${socket.id} disconnected from match:${info.matchId} (${info.role})`);
      io.to(`match:${info.matchId}`).emit('match:playerLeft', { role: info.role });
    }
  });
}

function handleLeave(io: Server, socket: Socket, matchId: string) {
  const info = roomManager.leave(socket.id);
  socket.leave(`match:${matchId}`);
  if (info) {
    console.log(`[Socket] ${socket.id} left match:${info.matchId} (${info.role})`);
    io.to(`match:${matchId}`).emit('match:playerLeft', { role: info.role });
  }
}

async function startSyncPhase(io: Server, matchId: string) {
  const updated = await matchService.transitionState(matchId, 'sync', SYNC_PHASE_DURATION);
  io.to(`match:${matchId}`).emit('match:updated', matchToResponse(updated));

  timerManager.startPhaseTimer(matchId, SYNC_PHASE_DURATION, async () => {
    await startTransmissionPhase(io, matchId);
  });
}

async function startTransmissionPhase(io: Server, matchId: string) {
  const updated = await matchService.transitionState(matchId, 'transmission', TRANSMISSION_PHASE_DURATION);
  io.to(`match:${matchId}`).emit('match:updated', matchToResponse(updated));

  timerManager.startPhaseTimer(matchId, TRANSMISSION_PHASE_DURATION, async () => {
    await handleTransmissionTimeout(io, matchId);
  });
}

async function handleTransmissionTimeout(io: Server, matchId: string) {
  // Receiver didn't choose in time → record as timeout
  const match = await matchService.getMatch(matchId);
  if (!match || match.state !== 'transmission') return;

  // Create a round with no receiver choice (timeout)
  if (match.selectedItem) {
    await roundService.createRound({
      matchId,
      gameMode: match.gameMode,
      selectedItem: match.selectedItem,
      receiverChoice: 'timeout',
      isCorrect: false,
    });
  }

  const resultMatch = await matchService.transitionState(matchId, 'result');

  io.to(`match:${matchId}`).emit('match:result', {
    isCorrect: false,
    selectedItem: match.selectedItem,
    receiverChoice: null,
  });
  io.to(`match:${matchId}`).emit('match:updated', matchToResponse(resultMatch));
}

import { getSocket, disconnectSocket } from './socket';
import { Socket } from 'socket.io-client';

export type MatchState = 'lobby' | 'sync' | 'transmission' | 'result' | 'completed';
export type GameMode = 'shapes' | 'colors';

export interface Match {
  id: string;
  game_mode: GameMode;
  state: MatchState;
  transmitter_ready: boolean;
  receiver_ready: boolean;
  selected_item: string | null;
  receiver_choice: string | null;
  phase_started_at: string | null;
  phase_duration: number | null;
  updated_at: string;
}

export interface MatchSubscriptionCallbacks {
  onMatchUpdate: (match: Match) => void;
  onTimerTick?: (remainingSeconds: number) => void;
  onResult?: (result: { isCorrect: boolean; selectedItem: string; receiverChoice: string | null }) => void;
  onPlayerJoined?: (role: string) => void;
  onPlayerLeft?: (role: string) => void;
  onError?: (error: Error) => void;
}

export class MatchRealtimeManager {
  private socket: Socket | null = null;
  private matchId: string;
  private lastTickRemaining: number = 0;

  constructor(matchId: string) {
    this.matchId = matchId;
  }

  subscribe(role: 'transmitter' | 'receiver', callbacks: MatchSubscriptionCallbacks) {
    this.socket = getSocket();

    this.socket.on('match:updated', (match: Match) => {
      callbacks.onMatchUpdate(match);
    });

    this.socket.on('match:timerTick', (data: { remainingSeconds: number }) => {
      this.lastTickRemaining = data.remainingSeconds;
      callbacks.onTimerTick?.(data.remainingSeconds);
    });

    this.socket.on('match:result', (result: { isCorrect: boolean; selectedItem: string; receiverChoice: string | null }) => {
      callbacks.onResult?.(result);
    });

    this.socket.on('match:playerJoined', (data: { role: string }) => {
      callbacks.onPlayerJoined?.(data.role);
    });

    this.socket.on('match:playerLeft', (data: { role: string }) => {
      callbacks.onPlayerLeft?.(data.role);
    });

    this.socket.on('match:error', (data: { message: string }) => {
      callbacks.onError?.(new Error(data.message));
    });

    this.socket.connect();
    this.socket.emit('match:join', { matchId: this.matchId, role });
  }

  async unsubscribe() {
    if (this.socket) {
      this.socket.emit('match:leave', { matchId: this.matchId });
      this.socket.removeAllListeners();
      disconnectSocket();
      this.socket = null;
    }
  }

  setReady(role: 'transmitter' | 'receiver', ready: boolean) {
    this.socket?.emit('match:setReady', {
      matchId: this.matchId,
      role,
      ready,
    });
  }

  submitTransmitterChoice(item: string) {
    this.socket?.emit('match:submitTransmitterChoice', {
      matchId: this.matchId,
      item,
    });
  }

  submitReceiverChoice(item: string) {
    this.socket?.emit('match:submitReceiverChoice', {
      matchId: this.matchId,
      item,
    });
  }

  playAgain() {
    this.socket?.emit('match:playAgain', {
      matchId: this.matchId,
    });
  }

  getRemainingTime(): number {
    return this.lastTickRemaining;
  }
}

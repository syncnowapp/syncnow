import prisma from '../lib/prisma';
import type { GameMode, MatchState } from '../shared/constants';

export async function createMatch(data: {
  id: string;
  gameMode: GameMode;
  selectedItem: string | null;
}) {
  return prisma.match.create({
    data: {
      id: data.id,
      gameMode: data.gameMode,
      state: 'lobby',
      selectedItem: data.selectedItem,
    },
  });
}

export async function getMatch(id: string) {
  return prisma.match.findUnique({ where: { id } });
}

export async function updateMatch(id: string, updates: Record<string, any>) {
  return prisma.match.update({
    where: { id },
    data: {
      ...updates,
      lastActivityAt: new Date(),
    },
  });
}

export async function setReady(id: string, role: 'transmitter' | 'receiver', ready: boolean) {
  const field = role === 'transmitter' ? 'transmitterReady' : 'receiverReady';
  return prisma.match.update({
    where: { id },
    data: {
      [field]: ready,
      lastActivityAt: new Date(),
    },
  });
}

export async function transitionState(id: string, newState: MatchState, phaseDuration?: number) {
  const updates: Record<string, any> = {
    state: newState,
    phaseStartedAt: new Date(),
    phaseDuration: phaseDuration || null,
    lastActivityAt: new Date(),
  };

  if (newState === 'lobby') {
    updates.transmitterReady = false;
    updates.receiverReady = false;
    updates.receiverChoice = null;
  }

  if (newState === 'result' || newState === 'completed') {
    updates.phaseDuration = null;
  }

  return prisma.match.update({
    where: { id },
    data: updates,
  });
}

export async function submitTransmitterChoice(id: string, item: string) {
  return prisma.match.update({
    where: { id },
    data: {
      selectedItem: item,
      lastActivityAt: new Date(),
    },
  });
}

export async function submitReceiverChoice(id: string, item: string) {
  return prisma.match.update({
    where: { id },
    data: {
      receiverChoice: item,
      lastActivityAt: new Date(),
    },
  });
}

const VALID_TRANSITIONS: Record<string, string[]> = {
  lobby: ['sync'],
  sync: ['transmission'],
  transmission: ['result'],
  result: ['lobby', 'completed'],
  completed: [],
};

export function isValidTransition(from: MatchState, to: MatchState): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

import prisma from '../lib/prisma';
import type { GameMode } from '../shared/constants';

export async function createRound(data: {
  matchId: string;
  gameMode: GameMode;
  selectedItem: string;
  receiverChoice: string;
  isCorrect: boolean;
  responseTimeMs?: number;
}) {
  return prisma.round.create({
    data: {
      matchId: data.matchId,
      gameMode: data.gameMode,
      selectedItem: data.selectedItem,
      receiverChoice: data.receiverChoice,
      isCorrect: data.isCorrect,
      responseTimeMs: data.responseTimeMs || null,
    },
  });
}

export async function getStats() {
  const [totalRounds, correctRounds, shapeRounds, shapeCorrect, colorRounds, colorCorrect, recentRounds] = await Promise.all([
    prisma.round.count(),
    prisma.round.count({ where: { isCorrect: true } }),
    prisma.round.count({ where: { gameMode: 'shapes' } }),
    prisma.round.count({ where: { gameMode: 'shapes', isCorrect: true } }),
    prisma.round.count({ where: { gameMode: 'colors' } }),
    prisma.round.count({ where: { gameMode: 'colors', isCorrect: true } }),
    prisma.round.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: { isCorrect: true, createdAt: true },
    }),
  ]);

  const accuracyPercent = totalRounds > 0 ? Math.round((correctRounds / totalRounds) * 1000) / 10 : 0;

  // Calculate recent accuracy per day (last 7 days)
  const recentAccuracy: number[] = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const dayStart = new Date(now);
    dayStart.setDate(dayStart.getDate() - i);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const dayRounds = recentRounds.filter(
      (r: { isCorrect: boolean; createdAt: Date }) => r.createdAt >= dayStart && r.createdAt < dayEnd
    );
    if (dayRounds.length > 0) {
      const dayCorrect = dayRounds.filter((r: { isCorrect: boolean; createdAt: Date }) => r.isCorrect).length;
      recentAccuracy.push(Math.round((dayCorrect / dayRounds.length) * 100));
    } else {
      recentAccuracy.push(0);
    }
  }

  return {
    totalRounds,
    correctRounds,
    accuracyPercent,
    roundsByMode: {
      shapes: { total: shapeRounds, correct: shapeCorrect },
      colors: { total: colorRounds, correct: colorCorrect },
    },
    recentAccuracy,
  };
}

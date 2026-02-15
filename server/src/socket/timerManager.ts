import { Server } from 'socket.io';

interface ActiveTimer {
  timeout: NodeJS.Timeout;
  interval: NodeJS.Timeout;
  remaining: number;
}

class TimerManager {
  private timers: Map<string, ActiveTimer> = new Map();
  private io: Server | null = null;

  setIO(io: Server) {
    this.io = io;
  }

  startPhaseTimer(matchId: string, durationSeconds: number, onExpire: () => void): void {
    this.clearTimer(matchId);

    let remaining = durationSeconds;

    // Broadcast initial tick
    this.emitTick(matchId, remaining);

    // Tick every second
    const interval = setInterval(() => {
      remaining--;
      this.emitTick(matchId, remaining);

      if (remaining <= 0) {
        this.clearTimer(matchId);
        onExpire();
      }
    }, 1000);

    // Safety timeout (in case interval drifts)
    const timeout = setTimeout(() => {
      this.clearTimer(matchId);
      onExpire();
    }, (durationSeconds + 1) * 1000);

    this.timers.set(matchId, { timeout, interval, remaining });
  }

  clearTimer(matchId: string): void {
    const timer = this.timers.get(matchId);
    if (timer) {
      clearTimeout(timer.timeout);
      clearInterval(timer.interval);
      this.timers.delete(matchId);
    }
  }

  getRemainingTime(matchId: string): number {
    const timer = this.timers.get(matchId);
    return timer?.remaining ?? 0;
  }

  private emitTick(matchId: string, remaining: number): void {
    if (this.io) {
      this.io.to(`match:${matchId}`).emit('match:timerTick', { remainingSeconds: remaining });
    }
  }
}

export const timerManager = new TimerManager();

// Re-export types from realtime.ts (canonical source)
export type { MatchState, GameMode, Match } from './realtime';

// Match ID generation
const MATCH_ID_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export function generateMatchId(): string {
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += MATCH_ID_CHARS.charAt(Math.floor(Math.random() * MATCH_ID_CHARS.length));
  }
  return result;
}

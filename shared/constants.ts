export const SYNC_PHASE_DURATION = 10;
export const TRANSMISSION_PHASE_DURATION = 30;

export const VALID_SHAPES = ['circle', 'square', 'triangle'] as const;
export const VALID_COLORS = ['yellow', 'blue', 'red'] as const;

export const MATCH_ID_LENGTH = 6;
export const MATCH_ID_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export function isValidItem(gameMode: 'shapes' | 'colors', item: string): boolean {
  if (gameMode === 'shapes') return (VALID_SHAPES as readonly string[]).includes(item);
  if (gameMode === 'colors') return (VALID_COLORS as readonly string[]).includes(item);
  return false;
}

export function isValidMatchId(id: string): boolean {
  if (id.length !== MATCH_ID_LENGTH) return false;
  return /^[A-Z0-9]{6}$/.test(id);
}

export function generateMatchId(): string {
  let result = '';
  for (let i = 0; i < MATCH_ID_LENGTH; i++) {
    result += MATCH_ID_CHARS.charAt(Math.floor(Math.random() * MATCH_ID_CHARS.length));
  }
  return result;
}

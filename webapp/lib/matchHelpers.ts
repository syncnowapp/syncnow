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

export function generateMatchId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

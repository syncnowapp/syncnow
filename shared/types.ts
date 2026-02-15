export type MatchState = 'lobby' | 'sync' | 'transmission' | 'result' | 'completed';
export type GameMode = 'shapes' | 'colors';
export type PlayerRole = 'transmitter' | 'receiver';

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
  last_activity_at: string;
  created_at: string;
}

export interface Round {
  id: string;
  match_id: string;
  game_mode: GameMode;
  selected_item: string;
  receiver_choice: string | null;
  is_correct: boolean | null;
  response_time_ms: number | null;
  created_at: string;
}

export interface StatsResponse {
  totalRounds: number;
  correctRounds: number;
  accuracyPercent: number;
  roundsByMode: Record<GameMode, { total: number; correct: number }>;
  recentAccuracy: number[];
}

// Socket.io event payloads
export interface JoinPayload {
  matchId: string;
  role: PlayerRole;
}

export interface SetReadyPayload {
  matchId: string;
  role: PlayerRole;
  ready: boolean;
}

export interface SubmitChoicePayload {
  matchId: string;
  item: string;
}

export interface TimerTickPayload {
  remainingSeconds: number;
}

export interface ResultPayload {
  isCorrect: boolean;
  selectedItem: string;
  receiverChoice: string;
}

export interface MatchSubscriptionCallbacks {
  onMatchUpdate: (match: Match) => void;
  onTimerTick?: (remaining: number) => void;
  onResult?: (result: ResultPayload) => void;
  onPlayerJoined?: (role: PlayerRole) => void;
  onPlayerLeft?: (role: PlayerRole) => void;
  onError?: (error: Error) => void;
}

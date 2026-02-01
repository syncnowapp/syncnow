import { supabase } from './supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

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
  onError?: (error: any) => void;
}

export class MatchRealtimeManager {
  private channel: RealtimeChannel | null = null;
  private matchId: string;

  constructor(matchId: string) {
    this.matchId = matchId;
  }

  subscribe(callbacks: MatchSubscriptionCallbacks) {
    this.channel = supabase
      .channel(`match:${this.matchId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'matches',
          filter: `id=eq.${this.matchId}`
        },
        (payload) => {
          callbacks.onMatchUpdate(payload.new as Match);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Realtime connected');
        } else if (status === 'CHANNEL_ERROR') {
          callbacks.onError?.(new Error('Subscription failed'));
        }
      });

    return this.channel;
  }

  async unsubscribe() {
    if (this.channel) {
      await supabase.removeChannel(this.channel);
      this.channel = null;
    }
  }

  async updateMatch(updates: Partial<Match>) {
    const { data, error } = await supabase
      .from('matches')
      .update({
        ...updates,
        last_activity_at: new Date().toISOString()
      })
      .eq('id', this.matchId)
      .select()
      .single();

    if (error) throw error;
    return data as Match;
  }

  async setReady(role: 'transmitter' | 'receiver', ready: boolean) {
    const field = role === 'transmitter' ? 'transmitter_ready' : 'receiver_ready';
    return this.updateMatch({ [field]: ready });
  }

  async transitionState(newState: MatchState, phaseDuration?: number) {
    const updates: Partial<Match> = {
      state: newState,
      phase_started_at: new Date().toISOString(),
      phase_duration: phaseDuration || null
    };

    if (newState === 'lobby') {
      updates.transmitter_ready = false;
      updates.receiver_ready = false;
    }

    return this.updateMatch(updates);
  }

  async submitTransmitterChoice(item: string) {
    return this.updateMatch({ selected_item: item });
  }

  async submitReceiverChoice(item: string) {
    return this.updateMatch({ receiver_choice: item });
  }

  getRemainingTime(match: Match): number {
    if (!match.phase_started_at || !match.phase_duration) return 0;

    const startTime = new Date(match.phase_started_at).getTime();
    const now = Date.now();
    const elapsed = Math.floor((now - startTime) / 1000);
    const remaining = Math.max(0, match.phase_duration - elapsed);

    return remaining;
  }
}

import { apiRequest } from './apiClient';

// Backend client for subscription + session-progress features.

// ── Subscription ──────────────────────────────────────────────────────────────

export type SubscriptionInfo = {
  plan: string;      // FREE | MONTHLY | YEARLY | LIFETIME
  status: string;    // ACTIVE | EXPIRED | CANCELLED
  premium: boolean;
  expiresAt?: string;
};

export async function getSubscription(token: string | null): Promise<SubscriptionInfo> {
  return apiRequest<SubscriptionInfo>('/subscription', { token });
}

/** Start or change a plan (call after your billing/IAP flow succeeds). */
export async function subscribe(
  token: string | null,
  plan: string,
  paymentReference?: string,
): Promise<SubscriptionInfo> {
  return apiRequest<SubscriptionInfo>('/subscription', {
    method: 'POST',
    token,
    body: { plan: plan.toUpperCase(), paymentReference },
  });
}

// ── Sessions & progress ───────────────────────────────────────────────────────

export type SessionRecord = {
  type: 'breathing' | 'meditation' | 'sleep' | 'music' | 'reflection';
  title?: string;
  technique?: string; // meditation: focused-attention | body-scan | loving-kindness | mindfulness
  durationSec?: number;
  mood?: string;
};

export type DayActivity = {
  date: string;
  label: string;
  sessions: number;
  minutes: number;
};

export type SessionStats = {
  currentStreak: number;
  longestStreak: number;
  totalSessions: number;
  totalMinutes: number;
  last7Days: DayActivity[];
};

/** Record a completed session. Best-effort — never blocks the UI. */
export async function recordSession(
  token: string | null,
  session: SessionRecord,
): Promise<void> {
  try {
    await apiRequest('/sessions', { method: 'POST', token, body: session });
  } catch {
    // swallow — progress tracking should never break the practice flow
  }
}

export async function getSessionStats(token: string | null): Promise<SessionStats | null> {
  try {
    return await apiRequest<SessionStats>('/sessions/stats', { token });
  } catch {
    return null;
  }
}

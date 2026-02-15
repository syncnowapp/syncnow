const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function createMatch(data: { id: string; gameMode: string; selectedItem: string | null }) {
  const res = await fetch(`${API_BASE}/api/matches`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || `Create match failed: ${res.status}`);
  }
  return res.json();
}

export async function getMatch(id: string) {
  const res = await fetch(`${API_BASE}/api/matches/${id}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || `Get match failed: ${res.status}`);
  }
  return res.json();
}

export async function getStats() {
  const res = await fetch(`${API_BASE}/api/stats`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || `Get stats failed: ${res.status}`);
  }
  return res.json();
}

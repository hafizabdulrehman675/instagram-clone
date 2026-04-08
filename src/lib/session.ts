const SESSION_KEY = "ig_clone_session_v1";

export type SessionData = {
  userId: string;
};

export function saveSession(userId: string): void {
  const data: SessionData = { userId };
  localStorage.setItem(SESSION_KEY, JSON.stringify(data));
}

export function loadSession(): SessionData | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SessionData;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

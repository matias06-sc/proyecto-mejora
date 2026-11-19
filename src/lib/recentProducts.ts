const RECENT_KEY = 'dlu-recent-products';
const MAX_RECENT = 8;

export function readRecentlyViewed(): string[] {
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === 'string').slice(0, MAX_RECENT)
      : [];
  } catch {
    return [];
  }
}

export function saveRecentlyViewed(ids: string[]): void {
  try {
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(ids));
  } catch {
    /* storage unavailable */
  }
}

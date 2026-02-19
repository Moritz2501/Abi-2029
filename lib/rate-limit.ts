type RateEntry = {
  count: number;
  resetAt: number;
};

const store = new Map<string, RateEntry>();

export function isRateLimited(
  key: string,
  maxAttempts = 5,
  windowMs = 15 * 60 * 1000,
) {
  const now = Date.now();
  const current = store.get(key);

  if (!current || current.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  if (current.count >= maxAttempts) {
    return true;
  }

  current.count += 1;
  store.set(key, current);
  return false;
}

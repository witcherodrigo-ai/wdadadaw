type RateEntry = {
  count: number;
  timestamp: number;
};

const store = new Map<string, RateEntry>();

export function rateLimit(key: string, limit = 5, windowMs = 60_000) {
  const now = Date.now();
  const existing = store.get(key);

  if (!existing || now - existing.timestamp > windowMs) {
    store.set(key, { count: 1, timestamp: now });
    return { allowed: true, remaining: limit - 1 };
  }

  if (existing.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  existing.count += 1;
  store.set(key, existing);
  return { allowed: true, remaining: limit - existing.count };
}

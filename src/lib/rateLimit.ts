const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function purgeExpired(now: number) {
  for (const [key, entry] of rateLimitMap) {
    if (now > entry.resetAt) rateLimitMap.delete(key);
  }
}

export function checkRateLimit(ip: string, limit = 20, windowMs = 60_000): boolean {
  const now = Date.now();

  // Purge stale entries periodically to prevent unbounded memory growth
  if (rateLimitMap.size > 500) purgeExpired(now);

  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= limit) return false;

  entry.count++;
  return true;
}

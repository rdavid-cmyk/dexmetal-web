import { createClient } from 'redis';

const redis = createClient({ url: 'redis://127.0.0.1:6380' });
redis.connect().catch(() => console.warn('[RateLimit] Redis unavailable, falling back to in-memory'));

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export async function checkRateLimit(ip: string, limit = 20, windowMs = 60_000): Promise<boolean> {
  const key = `rl:${ip}`;
  const now = Date.now();

  try {
    if (redis.isReady) {
      const current = await redis.get(key);
      if (!current) {
        await redis.set(key, '1', { PX: windowMs });
        return true;
      }
      const count = parseInt(current, 10);
      if (count >= limit) return false;
      await redis.incr(key);
      return true;
    }
  } catch {
    // fall through to in-memory
  }

  // In-memory fallback
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

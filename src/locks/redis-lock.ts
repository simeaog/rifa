import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export async function acquireLock(
  key: string,
  ttlMs = 8000,
  retries = 30,
  retryDelayMs = 100,
): Promise<string> {
  const token = uuidv4();
  for (let attempt = 0; attempt < retries; attempt++) {
    const ok = await redis.set(key, token, 'PX', ttlMs, 'NX');
    if (ok) return token;
    await new Promise((res) => setTimeout(res, retryDelayMs));
  }
  throw new Error('LOCK_NOT_ACQUIRED');
}

export async function releaseLock(key: string, token: string): Promise<boolean> {
  const lua = `
    if redis.call("get", KEYS[1]) == ARGV[1] then
      return redis.call("del", KEYS[1])
    else
      return 0
    end
  `;
  const res = await redis.eval(lua, 1, key, token);
  return res === 1;
}

// Simple in-memory rate limiter for anti-spam

type RateLimitStore = {
  [ip: string]: {
    count: number;
    resetAt: number;
  };
};

const store: RateLimitStore = {};

export function rateLimit(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  
  if (!store[ip]) {
    store[ip] = {
      count: 1,
      resetAt: now + windowMs,
    };
    return true; // Allowed
  }
  
  const record = store[ip];
  
  // If window has passed, reset
  if (now > record.resetAt) {
    record.count = 1;
    record.resetAt = now + windowMs;
    return true; // Allowed
  }
  
  // If under limit, increment
  if (record.count < limit) {
    record.count++;
    return true; // Allowed
  }
  
  // Limit exceeded
  return false;
}

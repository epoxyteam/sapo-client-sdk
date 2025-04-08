import { RateLimit } from '../types/client';
import { RateLimitError } from '../errors';

interface TokenBucket {
  tokens: number;
  lastRefill: number;
}

export class RateLimiter {
  private static readonly MINUTE_LIMIT = 40;
  private static readonly DAILY_LIMIT = 80000;
  private static readonly MINUTE = 60 * 1000; // 60 seconds in milliseconds
  private static readonly DAY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  private minuteBucket: TokenBucket;
  private dayBucket: TokenBucket;

  constructor() {
    this.minuteBucket = {
      tokens: RateLimiter.MINUTE_LIMIT,
      lastRefill: Date.now(),
    };

    this.dayBucket = {
      tokens: RateLimiter.DAILY_LIMIT,
      lastRefill: Date.now(),
    };
  }

  /**
   * Check if a request can be made based on rate limits
   */
  public async checkRateLimit(): Promise<void> {
    this.refillTokens();

    if (this.minuteBucket.tokens <= 0) {
      const resetTime = this.minuteBucket.lastRefill + RateLimiter.MINUTE;
      const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);
      throw new RateLimitError('Minute rate limit exceeded', retryAfter);
    }

    if (this.dayBucket.tokens <= 0) {
      const resetTime = this.dayBucket.lastRefill + RateLimiter.DAY;
      const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);
      throw new RateLimitError('Daily rate limit exceeded', retryAfter);
    }
  }

  /**
   * Update rate limits based on API response
   */
  public updateRateLimits(rateLimit: RateLimit): void {
    if (rateLimit.remaining !== undefined) {
      // Update minute bucket tokens based on API response
      this.minuteBucket.tokens = rateLimit.remaining;
    }
  }

  /**
   * Consume a token from both buckets
   */
  public consumeToken(): void {
    this.minuteBucket.tokens--;
    this.dayBucket.tokens--;
  }

  /**
   * Get current rate limit information
   */
  public getRateLimits(): RateLimit {
    this.refillTokens();

    return {
      remaining: this.minuteBucket.tokens,
      limit: RateLimiter.MINUTE_LIMIT,
      reset: this.minuteBucket.lastRefill + RateLimiter.MINUTE,
    };
  }

  /**
   * Refill tokens based on elapsed time
   */
  private refillTokens(): void {
    const now = Date.now();

    // Refill minute bucket
    const minutesDiff = Math.floor((now - this.minuteBucket.lastRefill) / RateLimiter.MINUTE);
    if (minutesDiff > 0) {
      this.minuteBucket.tokens = RateLimiter.MINUTE_LIMIT;
      this.minuteBucket.lastRefill = now;
    }

    // Refill daily bucket
    const daysDiff = Math.floor((now - this.dayBucket.lastRefill) / RateLimiter.DAY);
    if (daysDiff > 0) {
      this.dayBucket.tokens = RateLimiter.DAILY_LIMIT;
      this.dayBucket.lastRefill = now;
    }
  }

  /**
   * Reset rate limiters (mainly for testing)
   */
  public reset(): void {
    this.minuteBucket = {
      tokens: RateLimiter.MINUTE_LIMIT,
      lastRefill: Date.now(),
    };

    this.dayBucket = {
      tokens: RateLimiter.DAILY_LIMIT,
      lastRefill: Date.now(),
    };
  }
}

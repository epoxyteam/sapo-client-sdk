export { SapoClient } from './client';
export { SapoAuth } from './auth/oauth';
export { HttpClient } from './core/client';
export { RateLimiter } from './core/rate-limiter';

// Resource exports
export { Products } from './resources/products';

// Error exports
export {
  SapoError,
  AuthenticationError,
  RateLimitError,
  ValidationError,
  NotFoundError,
  NetworkError,
} from './errors';

// Type exports
export type { AuthConfig, AuthorizeOptions, Token, Scope, VerifyHmacOptions } from './types/auth';

export type {
  ClientConfig,
  RequestOptions,
  ApiResponse,
  RateLimit,
  ApiError,
  PaginationParams,
  PaginatedResponse,
} from './types/client';

// Product types
export type {
  Product,
  ProductVariant,
  ProductOption,
  CreateProductData,
  UpdateProductData,
  ProductListParams,
} from './resources/products';

// Constants
export const VERSION = '0.1.0';

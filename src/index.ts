// Core exports
export { SapoClient } from './client';
export { SapoAuth } from './auth/oauth';
export { HttpClient } from './core/client';
export { RateLimiter } from './core/rate-limiter';

// Resource handlers
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

// Auth types
export type { AuthConfig, AuthorizeOptions, Token, Scope, VerifyHmacOptions } from './types/auth';

// Client types
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
  ProductListParams,
} from './types/products';

// Version
export const VERSION = '0.1.0';

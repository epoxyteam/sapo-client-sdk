// Core exports
export { SapoClient } from './client';
export { SapoAuth } from './auth/oauth';
export { HttpClient } from './core/client';
export { RateLimiter } from './core/rate-limiter';

// Resource handlers
export { Products } from './resources/products';
export { Orders } from './resources/orders';
export { Customers } from './resources/customers';

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

// Order types
export type {
  Order,
  OrderLineItem,
  OrderCustomer,
  Address,
  CreateOrderData,
  OrderListParams,
  OrderStatus,
  OrderFinancialStatus,
  OrderFulfillmentStatus,
} from './types/orders';

// Customer types
export type {
  Customer,
  CreateCustomerData,
  CustomerListParams,
  CustomerSearchParams,
} from './types/customers';

// Version
export const VERSION = '0.1.0';

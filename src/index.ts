// Core exports
export { SapoClient } from './client';
export { SapoAuth } from './auth/oauth';
export { HttpClient } from './core/client';
export { RateLimiter } from './core/rate-limiter';

// Resource handlers
export { Products } from './resources/products';
export { Orders } from './resources/orders';
export { Customers } from './resources/customers';
export { Collections } from './resources/collections';
export { Inventory } from './resources/inventory';
export { PriceRules } from './resources/price-rules';
export { Fulfillments } from './resources/fulfillments';
export { Metafields } from './resources/metafields';
export { Pages } from './resources/pages';
export { Blogs } from './resources/blogs';

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

// Collection types
export type {
  Collection,
  CollectionType,
  CollectionImage,
  CollectionSortOrder,
  CreateCollectionData,
  CreateSmartCollectionData,
  SmartCollectionRule,
  SmartCollectionRuleOperator,
  CollectionListParams,
} from './types/collections';

// Inventory types
export type {
  InventoryItem,
  LocationInventory,
  InventoryAdjustmentAction,
  InventoryAdjustment,
  UpdateInventoryLevelData,
  InventoryTransferData,
  InventoryTransfer,
  Location,
  InventoryListParams,
} from './types/inventory';

// Price Rule types
export type {
  PriceRule,
  PriceRuleType,
  PriceRuleTarget,
  PriceRuleAllocation,
  PriceRuleCustomerSelection,
  CreatePriceRuleData,
  PriceRuleListParams,
  DiscountCode,
  CreateDiscountCodeData,
  DiscountCodeListParams,
} from './types/price-rules';

// Fulfillment types
export type {
  Fulfillment,
  FulfillmentStatus,
  FulfillmentLineItem,
  ShippingCarrier,
  CreateFulfillmentData,
  UpdateTrackingData,
  FulfillmentEvent,
  FulfillmentEventType,
  CreateFulfillmentEventData,
  FulfillmentListParams,
} from './types/fulfillments';

// Metafield types
export type {
  Metafield,
  MetafieldValueType,
  MetafieldOwnerType,
  CreateMetafieldData,
  MetafieldListParams,
  MetafieldOwnerParams,
  MetafieldBulkParams,
  MetafieldBulkResponse,
  ValidateMetafieldOptions,
  MetafieldValidationError,
} from './types/metafields';

// Page types
export type {
  Page,
  PageTemplate,
  CreatePageData,
  PageListParams,
  PageSearchParams,
  PageAuthor,
  PageAnalytics,
} from './types/pages';

// Blog types
export type {
  Blog,
  Article,
  Comment,
  CreateBlogData,
  CreateArticleData,
  CreateCommentData,
  BlogListParams,
  ArticleListParams,
  CommentListParams,
} from './types/blogs';

// Version
export const VERSION = '0.1.0';

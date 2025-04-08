/**
 * HTTP client configuration options.
 * @category Core
 */
export interface ClientConfig {
  /**
   * Base URL for API requests (e.g., 'https://your-store.mysapo.net').
   */
  baseURL: string;

  /**
   * API version (optional).
   * Defaults to the latest stable version.
   */
  apiVersion?: string;

  /**
   * Request timeout in milliseconds.
   * Defaults to 30000 (30 seconds).
   */
  timeout?: number;

  /**
   * Access token for authentication.
   * Set automatically after successful OAuth flow.
   */
  accessToken?: string;

  /**
   * Additional headers to include in requests.
   */
  headers?: Record<string, string>;
}

/**
 * HTTP request options.
 * @category Core
 */
export interface RequestOptions {
  /**
   * Query parameters to append to the URL.
   */
  params?: Record<string, any>;

  /**
   * Request headers to merge with default headers.
   */
  headers?: Record<string, string>;

  /**
   * Request timeout in milliseconds.
   * Overrides the client's default timeout.
   */
  timeout?: number;

  /**
   * Whether to retry failed requests.
   * Defaults to true for GET requests.
   */
  retry?: boolean;

  /**
   * Maximum number of retry attempts.
   * Defaults to 3 attempts.
   */
  maxRetries?: number;
}

/**
 * Common API response structure.
 * @template T Type of the response data
 * @category Core
 */
export interface ApiResponse<T> {
  /**
   * Response data of type T.
   */
  data: T;

  /**
   * HTTP status code.
   */
  status: number;

  /**
   * Response headers.
   */
  headers: Record<string, string>;
}

/**
 * Rate limit information from API response.
 * @category Core
 */
export interface RateLimit {
  /**
   * Number of remaining requests in current window.
   */
  remaining: number;

  /**
   * Total request limit.
   */
  limit: number;

  /**
   * Unix timestamp when the limit resets.
   */
  reset: number;
}

/**
 * Error response from API.
 * @category Errors
 */
export interface ApiError {
  /**
   * Error code identifier.
   */
  code: string;

  /**
   * Human-readable error message.
   */
  message: string;

  /**
   * Request ID for debugging and support.
   */
  request_id?: string;

  /**
   * Additional error details by field.
   */
  errors?: Record<string, any>;
}

/**
 * Parameters for paginated list endpoints.
 * @category Core
 */
export interface PaginationParams {
  /**
   * Page number (1-based).
   */
  page?: number;

  /**
   * Number of items per page.
   * Maximum value varies by endpoint.
   */
  limit?: number;

  /**
   * Fields to include in the response.
   * Use comma-separated values: 'id,name,created_on'
   */
  fields?: string[];

  /**
   * Filter by created date (start).
   * ISO 8601 format: '2025-01-01T00:00:00Z'
   */
  created_on_min?: string;

  /**
   * Filter by created date (end).
   * ISO 8601 format: '2025-01-01T00:00:00Z'
   */
  created_on_max?: string;

  /**
   * Filter by updated date (start).
   * ISO 8601 format: '2025-01-01T00:00:00Z'
   */
  updated_on_min?: string;

  /**
   * Filter by updated date (end).
   * ISO 8601 format: '2025-01-01T00:00:00Z'
   */
  updated_on_max?: string;
}

/**
 * Paginated response structure.
 * @template T Type of items in the response
 * @category Core
 */
export interface PaginatedResponse<T> {
  /**
   * Array of items of type T.
   */
  data: T[];

  /**
   * Total number of items across all pages.
   */
  total: number;

  /**
   * Current page number.
   */
  page: number;

  /**
   * Number of items per page.
   */
  limit: number;
}

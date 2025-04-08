/**
 * Base error class for Sapo API SDK
 */
export class SapoError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly status?: number,
    public readonly requestId?: string,
    public readonly errors?: Record<string, any>
  ) {
    super(message);
    this.name = 'SapoError';
    Object.setPrototypeOf(this, SapoError.prototype);
  }
}

/**
 * Authentication related errors
 */
export class AuthenticationError extends SapoError {
  constructor(message: string, code?: string, requestId?: string) {
    super(message, code, 401, requestId);
    this.name = 'AuthenticationError';
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

/**
 * Rate limit exceeded errors
 */
export class RateLimitError extends SapoError {
  constructor(
    message: string,
    public readonly retryAfter?: number,
    requestId?: string
  ) {
    super(message, 'RATE_LIMIT_EXCEEDED', 429, requestId);
    this.name = 'RateLimitError';
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}

/**
 * Validation errors
 */
export class ValidationError extends SapoError {
  constructor(message: string, errors?: Record<string, any>, requestId?: string) {
    super(message, 'VALIDATION_ERROR', 422, requestId, errors);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Resource not found errors
 */
export class NotFoundError extends SapoError {
  constructor(message: string, requestId?: string) {
    super(message, 'NOT_FOUND', 404, requestId);
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * Network/request timeout errors
 */
export class NetworkError extends SapoError {
  constructor(message: string, code?: string) {
    super(message, code ?? 'NETWORK_ERROR', 0);
    this.name = 'NetworkError';
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

/**
 * Create appropriate error instance from API error response
 * @param response - API error response
 * @param defaultMessage - Default error message if none provided
 * @returns Appropriate error instance based on response status
 */
export function createErrorFromResponse(
  response: any,
  defaultMessage = 'An unknown error occurred'
): SapoError {
  const status = response?.status;
  const data = response?.data;
  const requestId = response?.headers?.['x-request-id'];

  const message = data?.message ?? defaultMessage;
  const code = data?.code;
  const errors = data?.errors;

  switch (status) {
    case 401:
      return new AuthenticationError(message, code, requestId);
    case 404:
      return new NotFoundError(message, requestId);
    case 422:
      return new ValidationError(message, errors, requestId);
    case 429: {
      const retryAfter = Number(response?.headers?.['retry-after']) || undefined;
      return new RateLimitError(message, retryAfter, requestId);
    }
    default:
      return new SapoError(message, code, status, requestId, errors);
  }
}

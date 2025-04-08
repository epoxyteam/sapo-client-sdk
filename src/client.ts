import { HttpClient } from './core/client';
import { RateLimiter } from './core/rate-limiter';
import { SapoAuth } from './auth/oauth';
import { AuthConfig, AuthorizeOptions, Token } from './types/auth';
import { ClientConfig } from './types/client';

/**
 * Main client class for interacting with the Sapo API.
 *
 * @example
 * ```typescript
 * const client = new SapoClient({
 *   apiKey: 'your-api-key',
 *   secretKey: 'your-secret-key',
 *   redirectUri: 'https://your-app.com/oauth/callback'
 * });
 * ```
 */
export class SapoClient {
  private readonly auth: SapoAuth;
  private readonly httpClient: HttpClient;
  private readonly rateLimiter: RateLimiter;

  /**
   * Creates a new instance of the Sapo API client.
   *
   * @param config - Configuration options for the client
   * @throws {ValidationError} If required configuration options are missing
   */
  constructor(config: AuthConfig) {
    this.auth = new SapoAuth(config);
    this.rateLimiter = new RateLimiter();

    const clientConfig: ClientConfig = {
      baseURL: config.store ? `https://${config.store}` : '',
      timeout: 30000,
      headers: {},
    };

    this.httpClient = new HttpClient(clientConfig);
  }

  /**
   * Generate OAuth authorization URL for user authentication.
   *
   * @param options - Authorization options including store and scopes
   * @returns The authorization URL to redirect users to
   *
   * @example
   * ```typescript
   * const url = client.getAuthorizationUrl({
   *   store: 'your-store.mysapo.net',
   *   scopes: ['read_products', 'write_products']
   * });
   * ```
   */
  public getAuthorizationUrl(options: AuthorizeOptions): string {
    return this.auth.getAuthorizationUrl(options);
  }

  /**
   * Complete OAuth flow and obtain access token.
   *
   * @param store - Store name (e.g., 'your-store.mysapo.net')
   * @param callbackUrl - Full callback URL with authorization code
   * @returns OAuth token response
   * @throws {AuthenticationError} If authentication fails
   *
   * @example
   * ```typescript
   * const token = await client.completeOAuth(
   *   'your-store.mysapo.net',
   *   'callback-url-with-code'
   * );
   * ```
   */
  public async completeOAuth(store: string, callbackUrl: string): Promise<Token> {
    const token = await this.auth.completeOAuth(store, callbackUrl);
    this.setAccessToken(token.access_token);
    return token;
  }

  /**
   * Set access token for authenticated requests.
   *
   * @param token - Access token from OAuth flow or stored token
   */
  public setAccessToken(token: string): void {
    this.httpClient.setAccessToken(token);
  }

  /**
   * Update store URL for API requests.
   *
   * @param store - Store name (e.g., 'your-store.mysapo.net')
   */
  public setStore(store: string): void {
    this.httpClient.updateConfig({
      baseURL: `https://${store}`,
    });
  }

  /**
   * Make an authenticated GET request.
   *
   * @param path - API endpoint path
   * @param params - Query parameters
   * @returns Promise resolving to response data
   * @throws {RateLimitError} If rate limit is exceeded
   * @throws {ApiError} If API request fails
   *
   * @example
   * ```typescript
   * const products = await client.get('/admin/products.json', {
   *   limit: 10,
   *   page: 1
   * });
   * ```
   */
  public async get<T>(path: string, params?: Record<string, any>): Promise<T> {
    await this.rateLimiter.checkRateLimit();
    const response = await this.httpClient.get<T>(path, { params });
    this.rateLimiter.consumeToken();
    return response.data;
  }

  /**
   * Make an authenticated POST request.
   *
   * @param path - API endpoint path
   * @param data - Request body data
   * @returns Promise resolving to response data
   * @throws {RateLimitError} If rate limit is exceeded
   * @throws {ApiError} If API request fails
   */
  public async post<T>(path: string, data?: any): Promise<T> {
    await this.rateLimiter.checkRateLimit();
    const response = await this.httpClient.post<T>(path, data);
    this.rateLimiter.consumeToken();
    return response.data;
  }

  /**
   * Make an authenticated PUT request.
   *
   * @param path - API endpoint path
   * @param data - Request body data
   * @returns Promise resolving to response data
   * @throws {RateLimitError} If rate limit is exceeded
   * @throws {ApiError} If API request fails
   */
  public async put<T>(path: string, data?: any): Promise<T> {
    await this.rateLimiter.checkRateLimit();
    const response = await this.httpClient.put<T>(path, data);
    this.rateLimiter.consumeToken();
    return response.data;
  }

  /**
   * Make an authenticated DELETE request.
   *
   * @param path - API endpoint path
   * @returns Promise resolving to response data
   * @throws {RateLimitError} If rate limit is exceeded
   * @throws {ApiError} If API request fails
   */
  public async delete<T>(path: string): Promise<T> {
    await this.rateLimiter.checkRateLimit();
    const response = await this.httpClient.delete<T>(path);
    this.rateLimiter.consumeToken();
    return response.data;
  }

  /**
   * Get current rate limit information.
   *
   * @returns Current rate limit status
   */
  public getRateLimits() {
    return this.rateLimiter.getRateLimits();
  }

  /**
   * Verify HMAC signature from Sapo.
   *
   * @param query - Query parameters to verify
   * @param hmac - HMAC signature to verify against
   * @returns Whether the HMAC signature is valid
   */
  public verifyHmac(query: Record<string, string>, hmac: string): boolean {
    return this.auth.verifyHmac({ query, hmac });
  }
}

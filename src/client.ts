import { AuthConfig } from './types/auth';
import { ClientConfig } from './types/client';
import { HttpClient } from './core/client';
import { RateLimiter } from './core/rate-limiter';
import { SapoAuth } from './auth/oauth';
import { Products } from './resources/products';
import { Orders } from './resources/orders';
import { Customers } from './resources/customers';
import { Collections } from './resources/collections';
import { Inventory } from './resources/inventory';
import { PriceRules } from './resources/price-rules';
import { Scope } from './types/auth';

/**
 * Main Sapo API client
 * @category Core
 */
export class SapoClient {
  private readonly config: Required<AuthConfig>;
  private readonly auth: SapoAuth;
  private readonly httpClient: HttpClient;
  private readonly rateLimiter: RateLimiter;

  // Resource handlers
  public readonly products: Products;
  public readonly orders: Orders;
  public readonly customers: Customers;
  public readonly collections: Collections;
  public readonly inventory: Inventory;
  public readonly priceRules: PriceRules;

  constructor(config: AuthConfig) {
    this.validateConfig(config);
    this.config = this.initializeConfig(config);
    this.auth = new SapoAuth(this.config);
    this.rateLimiter = new RateLimiter();
    this.httpClient = this.createHttpClient();

    // Initialize resource handlers
    this.products = new Products(this);
    this.orders = new Orders(this);
    this.customers = new Customers(this);
    this.collections = new Collections(this);
    this.inventory = new Inventory(this);
    this.priceRules = new PriceRules(this);
  }

  private validateConfig(config: AuthConfig): void {
    if (!config.apiKey || !config.secretKey || !config.redirectUri) {
      throw new Error('apiKey, secretKey, and redirectUri are required');
    }
  }

  private initializeConfig(config: AuthConfig): Required<AuthConfig> {
    return {
      apiKey: config.apiKey,
      secretKey: config.secretKey,
      redirectUri: config.redirectUri,
      store: config.store || '',
    };
  }

  private createHttpClient(): HttpClient {
    const clientConfig: ClientConfig = {
      baseURL: this.config.store ? `https://${this.config.store}` : '',
      timeout: 30000,
      headers: {},
    };

    return new HttpClient(clientConfig);
  }

  /**
   * Set access token for authenticated requests
   */
  public setAccessToken(token: string): void {
    this.httpClient.setAccessToken(token);
  }

  /**
   * Set store URL for API requests
   */
  public setStore(store: string): void {
    this.httpClient.updateConfig({
      baseURL: `https://${store}`,
    });
  }

  /**
   * Make a GET request
   */
  public async get<T>(path: string, params?: Record<string, any>): Promise<T> {
    await this.rateLimiter.checkRateLimit();
    const response = await this.httpClient.get<T>(path, { params });
    this.rateLimiter.consumeToken();
    return response.data;
  }

  /**
   * Make a POST request
   */
  public async post<T>(path: string, data?: any): Promise<T> {
    await this.rateLimiter.checkRateLimit();
    const response = await this.httpClient.post<T>(path, data);
    this.rateLimiter.consumeToken();
    return response.data;
  }

  /**
   * Make a PUT request
   */
  public async put<T>(path: string, data?: any): Promise<T> {
    await this.rateLimiter.checkRateLimit();
    const response = await this.httpClient.put<T>(path, data);
    this.rateLimiter.consumeToken();
    return response.data;
  }

  /**
   * Make a DELETE request
   */
  public async delete<T>(path: string): Promise<T> {
    await this.rateLimiter.checkRateLimit();
    const response = await this.httpClient.delete<T>(path);
    this.rateLimiter.consumeToken();
    return response.data;
  }

  /**
   * Get OAuth authorization URL
   */
  public getAuthorizationUrl(store: string, scopes: Scope[]): string {
    return this.auth.getAuthorizationUrl({ store, scopes });
  }

  /**
   * Complete OAuth flow and get access token
   */
  public async completeOAuth(store: string, callbackUrl: string): Promise<string> {
    const token = await this.auth.completeOAuth(store, callbackUrl);
    this.httpClient.setAccessToken(token.access_token);
    return token.access_token;
  }

  /**
   * Get current rate limit information
   */
  public getRateLimits() {
    return this.rateLimiter.getRateLimits();
  }

  /**
   * Verify webhook HMAC signature
   */
  public verifyWebhookHmac(query: Record<string, string>, hmac: string): boolean {
    return this.auth.verifyHmac({ query, hmac });
  }
}

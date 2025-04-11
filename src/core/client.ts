import { ClientConfig, RequestOptions, ApiResponse, ApiError } from '../types/client';
import { createErrorFromResponse, NetworkError } from '../errors';

/**
 * HTTP client for making API requests with built-in error handling, authentication, and timeout support.
 */
export class HttpClient {
  /**
   * Client configuration including auth, timeout and headers
   */
  private readonly config: Required<Pick<ClientConfig, 'baseURL' | 'timeout'>> &
    Omit<ClientConfig, 'baseURL' | 'timeout'>;

  /**
   * Default headers sent with every request
   */
  private readonly defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  /**
   * Creates a new HTTP client instance
   */
  constructor(config: ClientConfig) {
    this.config = {
      baseURL: config.baseURL,
      timeout: config.timeout ?? 30000,
      apiKey: config.apiKey,
      apiSecret: config.apiSecret,
      accessToken: config.accessToken,
      headers: {
        ...this.defaultHeaders,
        ...config.headers,
      },
    };
  }

  /**
   * Updates client configuration
   */
  public updateConfig(config: Partial<ClientConfig>): void {
    Object.assign(this.config, config);

    // Rebuild headers if custom headers provided
    if (config.headers) {
      this.config.headers = {
        ...this.defaultHeaders,
        ...config.headers,
      };
    }
  }

  /**
   * Sets the OAuth access token for authentication
   */
  public setAccessToken(token: string): void {
    this.config.accessToken = token;
  }

  /**
   * Makes an HTTP request with error handling and timeout support
   * @throws {SapoError} On API errors
   * @throws {NetworkError} On network/timeout errors
   */
  private async request<T>(
    method: string,
    path: string,
    data?: unknown,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(path);
    const requestHeaders = this.buildHeaders(options.headers);
    const timeout = options.timeout ?? this.config.timeout;

    try {
      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: data ? JSON.stringify(data) : undefined,
        signal: AbortSignal.timeout(timeout),
      });

      const responseHeaders = this.convertHeadersToRecord(response.headers);

      if (!response.ok) {
        const error = await this.parseErrorResponse(response);
        throw createErrorFromResponse({
          status: response.status,
          data: error,
          headers: responseHeaders,
        });
      }

      const responseData = (await response.json()) as T;

      return {
        data: responseData,
        status: response.status,
        headers: responseHeaders,
      };
    } catch (error: unknown) {
      if (error instanceof Error && !(error instanceof NetworkError)) {
        throw new NetworkError(error.message);
      }
      throw error;
    }
  }

  /**
   * Converts Headers object to Record<string, string>
   */
  private convertHeadersToRecord(headers: Headers): Record<string, string> {
    const record: Record<string, string> = {};
    headers.forEach((value, key) => {
      record[key] = value;
    });
    return record;
  }

  /**
   * Parses error response body
   */
  private async parseErrorResponse(response: Response): Promise<ApiError> {
    const text = await response.text();

    try {
      return JSON.parse(text) as ApiError;
    } catch {
      return {
        code: 'UNKNOWN_ERROR',
        message: text || 'Unknown error occurred',
      };
    }
  }

  /**
   * Builds full request URL
   */
  private buildUrl(path: string): string {
    // Remove protocol prefix and trailing slash from base URL
    const baseUrl = this.config.baseURL.replace(/^https?:\/\//, '').replace(/\/$/, '');

    // Remove leading slash from path
    const cleanPath = path.replace(/^\//, '');

    return `https://${baseUrl}/${cleanPath}`;
  }

  /**
   * Builds request headers with authentication
   */
  private buildHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const headers: Record<string, string> = {
      ...this.defaultHeaders,
      ...this.config.headers,
    };

    // Add authentication headers
    if (this.config.apiKey && this.config.apiSecret && !this.config.accessToken) {
      // Basic auth for private apps
      const credentials = `${this.config.apiKey}:${this.config.apiSecret}`;
      headers.Authorization = `Basic ${btoa(credentials)}`;
    } else if (this.config.accessToken) {
      // OAuth token
      headers['X-Sapo-Access-Token'] = this.config.accessToken;
    }

    return {
      ...headers,
      ...customHeaders,
    };
  }

  /**
   * Makes a GET request
   * @throws {SapoError} On API errors
   * @throws {NetworkError} On network/timeout errors
   */
  public async get<T>(path: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    return this.request<T>('GET', path, undefined, options);
  }

  /**
   * Makes a POST request
   * @throws {SapoError} On API errors
   * @throws {NetworkError} On network/timeout errors
   */
  public async post<T>(
    path: string,
    data?: unknown,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>('POST', path, data, options);
  }

  /**
   * Makes a PUT request
   * @throws {SapoError} On API errors
   * @throws {NetworkError} On network/timeout errors
   */
  public async put<T>(
    path: string,
    data?: unknown,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', path, data, options);
  }

  /**
   * Makes a DELETE request
   * @throws {SapoError} On API errors
   * @throws {NetworkError} On network/timeout errors
   */
  public async delete<T>(path: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', path, undefined, options);
  }
}

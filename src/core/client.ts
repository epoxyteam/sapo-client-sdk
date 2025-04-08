import { ClientConfig, RequestOptions, ApiResponse } from '../types/client';
import { createErrorFromResponse } from '../errors';

export class HttpClient {
  private config: ClientConfig;

  constructor(config: ClientConfig) {
    this.config = {
      baseURL: config.baseURL,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...config.headers,
      },
    };
  }

  /**
   * Update client configuration
   */
  public updateConfig(config: Partial<ClientConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Set access token for authentication
   */
  public setAccessToken(token: string): void {
    this.config.accessToken = token;
  }

  /**
   * Make HTTP request
   */
  private async request<T>(
    method: string,
    path: string,
    data?: any,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(path);
    const headers = this.buildHeaders(options.headers);
    const timeout = options.timeout || this.config.timeout;

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
        signal: timeout ? AbortSignal.timeout(timeout) : undefined,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const headerObj: Record<string, string> = {};
        response.headers.forEach((value, key) => {
          headerObj[key] = value;
        });

        throw createErrorFromResponse({
          status: response.status,
          data: errorData,
          headers: headerObj,
        });
      }

      const responseData = await response.json();
      const headerObj: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headerObj[key] = value;
      });

      return {
        data: responseData,
        status: response.status,
        headers: headerObj,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw createErrorFromResponse({
          status: 0,
          data: { message: error.message },
          headers: {},
        });
      }
      throw error;
    }
  }

  /**
   * Build complete URL
   */
  private buildUrl(path: string): string {
    const baseURL = this.config.baseURL.endsWith('/')
      ? this.config.baseURL.slice(0, -1)
      : this.config.baseURL;
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${baseURL}/${cleanPath}`;
  }

  /**
   * Build request headers
   */
  private buildHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const headers = {
      ...this.config.headers,
    };

    if (this.config.accessToken) {
      headers['X-Sapo-Access-Token'] = this.config.accessToken;
    }

    if (customHeaders) {
      Object.assign(headers, customHeaders);
    }

    return headers;
  }

  /**
   * Make a GET request
   */
  public async get<T>(path: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    return this.request<T>('GET', path, undefined, options);
  }

  /**
   * Make a POST request
   */
  public async post<T>(
    path: string,
    data?: any,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>('POST', path, data, options);
  }

  /**
   * Make a PUT request
   */
  public async put<T>(
    path: string,
    data?: any,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', path, data, options);
  }

  /**
   * Make a DELETE request
   */
  public async delete<T>(path: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', path, undefined, options);
  }
}

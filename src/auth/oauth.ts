import { OAuthConfig, AuthorizeOptions, Token, VerifyHmacOptions } from '../types/auth';
import { AuthenticationError, createErrorFromResponse } from '../errors';
import * as crypto from 'crypto';

/**
 * Handles OAuth authentication flow with Sapo API
 * @category Authentication
 */
export class SapoAuth {
  private readonly config: OAuthConfig;

  constructor(config: OAuthConfig) {
    if (config.type !== 'oauth') {
      throw new AuthenticationError(
        'Invalid config type. Expected OAuth config.',
        'INVALID_CONFIG'
      );
    }
    this.config = config;
  }

  /**
   * Generate OAuth authorization URL for user authentication
   * @param options Authorization options including store and scopes
   * @returns Authorization URL to redirect users to
   */
  public getAuthorizationUrl(options: AuthorizeOptions): string {
    const { store, scopes } = options;
    const query = new URLSearchParams({
      client_id: this.config.apiKey,
      scope: scopes.join(','),
      redirect_uri: this.config.redirectUri,
    });

    return `https://${store}/admin/oauth/authorize?${query.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   * @param store Store name (e.g., 'your-store.mysapo.net')
   * @param code Authorization code from OAuth callback
   * @returns Promise resolving to access token
   * @throws {AuthenticationError} If token exchange fails
   */
  public async getAccessToken(store: string, code: string): Promise<Token> {
    try {
      const response = await fetch(`https://${store}/admin/oauth/access_token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: this.config.apiKey,
          client_secret: this.config.secretKey,
          code,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const headers: Record<string, string> = {};
        response.headers.forEach((value, key) => {
          headers[key] = value;
        });

        throw createErrorFromResponse({
          status: response.status,
          data: errorData,
          headers,
        });
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new AuthenticationError(error.message, 'TOKEN_EXCHANGE_FAILED');
      }
      throw error;
    }
  }

  /**
   * Verify HMAC signature from Sapo
   * @param options HMAC verification options
   * @returns Whether the signature is valid
   */
  public verifyHmac(options: VerifyHmacOptions): boolean {
    const { query, hmac } = options;

    // Remove hmac from query parameters before verification
    const params = { ...query };
    delete params.hmac;

    // Sort parameters alphabetically
    const sortedParams = Object.keys(params)
      .sort()
      .reduce<Record<string, string>>((acc, key) => {
        acc[key] = params[key];
        return acc;
      }, {});

    // Convert parameters to query string
    const queryString = Object.entries(sortedParams)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    // Calculate HMAC
    const calculatedHmac = crypto
      .createHmac('sha256', this.config.type === 'oauth' ? this.config.secretKey : '')
      .update(queryString)
      .digest('base64');

    return crypto.timingSafeEqual(Buffer.from(calculatedHmac), Buffer.from(hmac));
  }

  /**
   * Parse OAuth callback URL and extract authorization code
   * @param url Full callback URL with query parameters
   * @returns Parsed callback parameters
   * @throws {AuthenticationError} If required parameters are missing
   */
  public parseCallbackParams(url: string): {
    code: string;
    hmac: string;
    timestamp: string;
  } {
    const parsedUrl = new URL(url);
    const params = Object.fromEntries(parsedUrl.searchParams);

    if (!params.code || !params.hmac || !params.timestamp) {
      throw new AuthenticationError(
        'Invalid callback URL: missing required parameters',
        'INVALID_CALLBACK_PARAMS'
      );
    }

    return {
      code: params.code,
      hmac: params.hmac,
      timestamp: params.timestamp,
    };
  }

  /**
   * Complete OAuth flow by verifying callback and exchanging code for token
   * @param store Store name (e.g., 'your-store.mysapo.net')
   * @param callbackUrl Full callback URL from OAuth process
   * @returns Promise resolving to access token
   * @throws {AuthenticationError} If verification fails or token exchange fails
   */
  public async completeOAuth(store: string, callbackUrl: string): Promise<Token> {
    const params = this.parseCallbackParams(callbackUrl);

    // Verify HMAC signature
    const isValid = this.verifyHmac({
      query: {
        code: params.code,
        timestamp: params.timestamp,
        hmac: params.hmac,
      },
      hmac: params.hmac,
    });

    if (!isValid) {
      throw new AuthenticationError('Invalid HMAC signature', 'INVALID_HMAC');
    }

    // Exchange code for token
    return this.getAccessToken(store, params.code);
  }
}

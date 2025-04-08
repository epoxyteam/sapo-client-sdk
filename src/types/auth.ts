/**
 * OAuth configuration options for the Sapo API client.
 * @category Authentication
 */
export interface AuthConfig {
  /**
   * API Key obtained from Sapo Partner Dashboard.
   * Used for identifying your application.
   */
  apiKey: string;

  /**
   * Secret Key obtained from Sapo Partner Dashboard.
   * Used for OAuth flow and HMAC verification.
   */
  secretKey: string;

  /**
   * OAuth callback URL where users will be redirected after authorization.
   * Must match the Redirect URL configured in your Sapo app settings.
   */
  redirectUri: string;

  /**
   * Optional store name (e.g., 'your-store.mysapo.net').
   * If provided, the client will be pre-configured for this store.
   */
  store?: string;
}

/**
 * OAuth token response from Sapo API.
 * @category Authentication
 */
export interface Token {
  /**
   * Access token for API requests.
   * This token does not expire and should be stored securely.
   */
  access_token: string;
}

/**
 * Available OAuth scope permissions.
 * @category Authentication
 */
export type Scope =
  /** Read access to content (articles, blogs, pages) */
  | 'read_content'
  /** Write access to content (articles, blogs, pages) */
  | 'write_content'
  /** Read access to themes */
  | 'read_themes'
  /** Write access to themes */
  | 'write_themes'
  /** Read access to products and collections */
  | 'read_products'
  /** Write access to products and collections */
  | 'write_products'
  /** Read access to customer data */
  | 'read_customers'
  /** Write access to customer data */
  | 'write_customers'
  /** Read access to orders and transactions */
  | 'read_orders'
  /** Write access to orders and transactions */
  | 'write_orders'
  /** Read access to script tags */
  | 'read_script_tags'
  /** Write access to script tags */
  | 'write_script_tags'
  /** Read access to price rules and discounts */
  | 'read_price_rules'
  /** Write access to price rules and discounts */
  | 'write_price_rules'
  /** Read access to draft orders */
  | 'read_draft_orders'
  /** Write access to draft orders */
  | 'write_draft_orders';

/**
 * Options for generating OAuth authorization URL.
 * @category Authentication
 */
export interface AuthorizeOptions {
  /**
   * Store name (e.g., 'your-store.mysapo.net').
   * This is the store where the app will be installed.
   */
  store: string;

  /**
   * List of requested scope permissions.
   * Each scope grants specific access to different API resources.
   * @see {@link Scope}
   */
  scopes: Scope[];
}

/**
 * Options for HMAC signature verification.
 * @category Authentication
 */
export interface VerifyHmacOptions {
  /**
   * Query parameters to verify.
   * These are typically from OAuth callbacks or webhook requests.
   */
  query: Record<string, string>;

  /**
   * Expected HMAC signature to verify against.
   * This is provided by Sapo in the query parameters.
   */
  hmac: string;
}

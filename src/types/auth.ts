/**
 * OAuth configuration options
 * @category Authentication
 */
export interface AuthConfig {
  /** API Key from Sapo Partner Dashboard */
  apiKey: string;

  /** Secret Key from Sapo Partner Dashboard */
  secretKey: string;

  /** Redirect URI for OAuth flow */
  redirectUri: string;

  /** Optional store name (e.g., 'your-store.mysapo.net') */
  store?: string;
}

/**
 * OAuth token response
 * @category Authentication
 */
export interface Token {
  /** Access token for API requests */
  access_token: string;
}

/**
 * OAuth scope permissions
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
  | 'write_draft_orders'
  /** Read access to collections */
  | 'read_collections'
  /** Write access to collections */
  | 'write_collections';

/**
 * OAuth authorization options
 * @category Authentication
 */
export interface AuthorizeOptions {
  /** Store name (e.g., 'your-store.mysapo.net') */
  store: string;

  /** List of requested scope permissions */
  scopes: Scope[];
}

/**
 * HMAC verification options
 * @category Authentication
 */
export interface VerifyHmacOptions {
  /** Query parameters to verify */
  query: Record<string, string>;

  /** Expected HMAC signature */
  hmac: string;
}

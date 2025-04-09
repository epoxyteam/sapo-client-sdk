import { PaginationParams } from './client';

/**
 * Page template types
 * @category Resources
 */
export type PageTemplate = 'default' | 'contact' | 'custom';

/**
 * Page information
 * @category Resources
 */
export interface Page {
  /** Unique identifier */
  id: number;

  /** Page title */
  title: string;

  /** URL handle for the page */
  handle: string;

  /** Body content in HTML */
  body_html?: string;

  /** Author of the page */
  author?: string;

  /** Template used for the page */
  template_suffix?: PageTemplate;

  /** Whether the page is published */
  published: boolean;

  /** Publication timestamp */
  published_on?: string;

  /** Shop ID */
  shop_id: number;

  /** Creation timestamp */
  created_on: string;

  /** Last update timestamp */
  updated_on: string;
}

/**
 * Data for creating a page
 * @category Resources
 */
export interface CreatePageData {
  /** Page title */
  title: string;

  /** Body content in HTML */
  body_html?: string;

  /** Author of the page */
  author?: string;

  /** Template to use */
  template_suffix?: PageTemplate;

  /** Whether to publish the page */
  published?: boolean;

  /** Handle for the page URL (auto-generated if not provided) */
  handle?: string;

  /** Metafields to set on the page */
  metafields?: Array<{
    namespace: string;
    key: string;
    value: string;
    value_type: string;
  }>;
}

/**
 * Parameters for listing pages
 * @category Resources
 */
export interface PageListParams extends PaginationParams {
  /** Filter by publication status */
  published?: boolean;

  /** Filter by handle */
  handle?: string;

  /** Filter by title */
  title?: string;

  /** Filter by creation date range start */
  created_on_min?: string;

  /** Filter by creation date range end */
  created_on_max?: string;

  /** Filter by update date range start */
  updated_on_min?: string;

  /** Filter by update date range end */
  updated_on_max?: string;

  /** Filter by publish date range start */
  published_on_min?: string;

  /** Filter by publish date range end */
  published_on_max?: string;

  /** Fields to include in the response */
  fields?: string[];
}

/**
 * Parameters for searching pages
 * @category Resources
 */
export interface PageSearchParams {
  /** Search query */
  query: string;

  /** Fields to search in */
  fields?: Array<'title' | 'handle' | 'body_html'>;

  /** Number of results to return */
  limit?: number;
}

/**
 * Page author information
 * @category Resources
 */
export interface PageAuthor {
  /** Author name */
  name: string;

  /** Author email */
  email: string;

  /** Author bio */
  bio?: string;

  /** Number of pages authored */
  pages_count: number;
}

/**
 * Page analytics data
 * @category Resources
 */
export interface PageAnalytics {
  /** Page views count */
  views: number;

  /** Unique visitors count */
  visitors: number;

  /** Average time on page (seconds) */
  average_time: number;

  /** Bounce rate percentage */
  bounce_rate: number;

  /** Page views by device type */
  device_breakdown: {
    desktop: number;
    mobile: number;
    tablet: number;
  };

  /** Data collection period */
  period: {
    start: string;
    end: string;
  };
}

import { PaginationParams } from './client';

/**
 * Collection types
 * @category Resources
 */
export type CollectionType = 'custom' | 'smart';

/**
 * Collection information
 * @category Resources
 */
export interface Collection {
  /** Unique identifier */
  id: number;

  /** Collection handle (URL-friendly version of title) */
  handle: string;

  /** Collection title */
  title: string;

  /** Collection description in HTML format */
  body_html?: string;

  /** Whether the collection is published */
  published: boolean;

  /** Publication timestamp */
  published_at?: string;

  /** Collection template suffix */
  template_suffix?: string;

  /** Collection sort order */
  sort_order?: CollectionSortOrder;

  /** Collection type (custom/smart) */
  collection_type: CollectionType;

  /** Creation timestamp */
  created_on: string;

  /** Last update timestamp */
  updated_on: string;

  /** Collection image */
  image?: CollectionImage;

  /** Products count in collection */
  products_count: number;
}

/**
 * Collection image information
 * @category Resources
 */
export interface CollectionImage {
  /** Image URL */
  src: string;

  /** Image width in pixels */
  width?: number;

  /** Image height in pixels */
  height?: number;

  /** Alt text for the image */
  alt?: string;

  /** Creation timestamp */
  created_on?: string;
}

/**
 * Collection sorting options
 * @category Resources
 */
export type CollectionSortOrder =
  | 'alpha-asc'
  | 'alpha-desc'
  | 'best-selling'
  | 'created'
  | 'created-desc'
  | 'manual'
  | 'price-asc'
  | 'price-desc';

/**
 * Data for creating a custom collection
 * @category Resources
 */
export interface CreateCollectionData {
  /** Collection title */
  title: string;

  /** Collection description in HTML format */
  body_html?: string;

  /** Whether to publish the collection */
  published?: boolean;

  /** Collection template suffix */
  template_suffix?: string;

  /** Collection sort order */
  sort_order?: CollectionSortOrder;

  /** Collection image */
  image?: {
    src: string;
    alt?: string;
  };
}

/**
 * Smart collection rule operator
 * @category Resources
 */
export type SmartCollectionRuleOperator =
  | 'equals'
  | 'not_equals'
  | 'greater_than'
  | 'less_than'
  | 'starts_with'
  | 'ends_with'
  | 'contains'
  | 'not_contains';

/**
 * Smart collection rule
 * @category Resources
 */
export interface SmartCollectionRule {
  /** Field to match against */
  column: string;

  /** Relation operator */
  relation: SmartCollectionRuleOperator;

  /** Value to match */
  condition: string;
}

/**
 * Data for creating a smart collection
 * @category Resources
 */
export interface CreateSmartCollectionData extends Omit<CreateCollectionData, 'sort_order'> {
  /** Collection rules */
  rules: SmartCollectionRule[];

  /** Whether all rules must match */
  disjunctive?: boolean;
}

/**
 * Parameters for listing collections
 * @category Resources
 */
export interface CollectionListParams extends PaginationParams {
  /** Filter by collection type */
  collection_type?: CollectionType;

  /** Filter by handle */
  handle?: string;

  /** Filter by product ID */
  product_id?: number;

  /** Filter by published status */
  published?: boolean;

  /** Filter by title */
  title?: string;

  /** Filter by updated date range start */
  updated_on_min?: string;

  /** Filter by updated date range end */
  updated_on_max?: string;
}

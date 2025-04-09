import { PaginationParams } from './client';

/**
 * Metafield value types
 * @category Resources
 */
export type MetafieldValueType =
  | 'string'
  | 'integer'
  | 'float'
  | 'boolean'
  | 'json'
  | 'date'
  | 'datetime';

/**
 * Metafield owner types
 * @category Resources
 */
export type MetafieldOwnerType =
  | 'product'
  | 'variant'
  | 'collection'
  | 'customer'
  | 'order'
  | 'blog'
  | 'article'
  | 'page'
  | 'shop';

/**
 * Metafield information
 * @category Resources
 */
export interface Metafield {
  /** Unique identifier */
  id: number;

  /** Namespace for the metafield */
  namespace: string;

  /** Key name for the metafield */
  key: string;

  /** Metafield value */
  value: string;

  /** Type of the value */
  value_type: MetafieldValueType;

  /** Description of the metafield */
  description?: string;

  /** Owner resource type */
  owner_type: MetafieldOwnerType;

  /** Owner resource ID */
  owner_id: number;

  /** Creation timestamp */
  created_on: string;

  /** Last update timestamp */
  updated_on: string;
}

/**
 * Data for creating a metafield
 * @category Resources
 */
export interface CreateMetafieldData {
  /** Namespace for the metafield */
  namespace: string;

  /** Key name for the metafield */
  key: string;

  /** Metafield value */
  value: string;

  /** Type of the value */
  value_type: MetafieldValueType;

  /** Description of the metafield */
  description?: string;
}

/**
 * Parameters for listing metafields
 * @category Resources
 */
export interface MetafieldListParams extends PaginationParams {
  /** Filter by namespace */
  namespace?: string;

  /** Filter by key */
  key?: string;

  /** Filter by value type */
  value_type?: MetafieldValueType;

  /** Filter by creation date range start */
  created_on_min?: string;

  /** Filter by creation date range end */
  created_on_max?: string;

  /** Filter by update date range start */
  updated_on_min?: string;

  /** Filter by update date range end */
  updated_on_max?: string;
}

/**
 * Parameters for bulk operations on metafields
 * @category Resources
 */
export interface MetafieldBulkParams {
  /** Filter by namespace */
  namespace?: string;

  /** Filter by key */
  key?: string;

  /** Filter by value type */
  value_type?: MetafieldValueType;
}

/**
 * Parameters for filtering metafields by owner
 * @category Resources
 */
export interface MetafieldOwnerParams {
  /** Type of the owner resource */
  owner_type: MetafieldOwnerType;

  /** ID of the owner resource */
  owner_id: number;
}

/**
 * Response for bulk operations
 * @category Resources
 */
export interface MetafieldBulkResponse {
  /** Number of affected metafields */
  count: number;

  /** Operation status */
  status: 'success' | 'partial' | 'failed';

  /** Error details if any */
  errors?: string[];
}

/**
 * Validation error details for metafields
 * @category Resources
 */
export interface MetafieldValidationError {
  /** Field with error */
  field: string;

  /** Error message */
  message: string;

  /** Error code */
  code: string;
}

/**
 * Options for validating metafield value
 * @category Resources
 */
export interface ValidateMetafieldOptions {
  /** Value to validate */
  value: string;

  /** Expected type */
  value_type: MetafieldValueType;

  /** Additional validation rules */
  rules?: {
    /** Minimum value for numbers */
    min?: number;

    /** Maximum value for numbers */
    max?: number;

    /** Regular expression pattern for strings */
    pattern?: string;

    /** JSON schema for json type */
    schema?: Record<string, any>;
  };
}

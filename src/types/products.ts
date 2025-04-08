import { PaginationParams } from './client';

/**
 * Product information
 * @category Resources
 */
export interface Product {
  /** Unique identifier */
  id: number;

  /** Product name */
  name: string;

  /** URL-friendly product name */
  alias: string;

  /** HTML product description */
  content?: string;

  /** Short product description */
  summary?: string;

  /** Product manufacturer/brand */
  vendor?: string;

  /** Product category/type */
  product_type?: string;

  /** Comma-separated list of tags */
  tags?: string;

  /** List of product variants */
  variants: ProductVariant[];

  /** Product customization options */
  options: ProductOption[];

  /** Creation timestamp (ISO 8601) */
  created_on: string;

  /** Last modification timestamp (ISO 8601) */
  modified_on: string;

  /** Publication timestamp (ISO 8601) */
  published_on?: string;
}

/**
 * Product variant information
 * @category Resources
 */
export interface ProductVariant {
  /** Unique identifier */
  id: number;

  /** Variant title */
  title: string;

  /** Selling price */
  price: number;

  /** Original/compare-at price */
  compare_at_price?: number;

  /** Barcode (UPC, ISBN, etc.) */
  barcode?: string;

  /** SKU (Stock Keeping Unit) */
  sku?: string;

  /** Display order position */
  position: number;

  /** Current stock quantity */
  inventory_quantity: number;

  /** Inventory tracking method */
  inventory_management?: string;

  /** Out-of-stock ordering policy */
  inventory_policy?: string;

  /** Product weight */
  weight?: number;

  /** Weight unit (g, kg, lb, oz) */
  weight_unit?: string;

  /** Whether shipping is required */
  requires_shipping?: boolean;

  /** First option value */
  option1?: string;

  /** Second option value */
  option2?: string;

  /** Third option value */
  option3?: string;
}

/**
 * Product customization option
 * @category Resources
 */
export interface ProductOption {
  /** Option name (e.g., "Size", "Color") */
  name: string;

  /** Display order position */
  position: number;

  /** Available option values */
  values: string[];
}

/**
 * Data for creating a new product
 * @category Resources
 */
export interface CreateProductData {
  /** Product name */
  name: string;

  /** HTML product description */
  content?: string;

  /** Product manufacturer/brand */
  vendor?: string;

  /** Product category/type */
  product_type?: string;

  /** List of product variants */
  variants?: Partial<ProductVariant>[];

  /** Product customization options */
  options?: Partial<ProductOption>[];
}

/**
 * Parameters for listing products
 * @category Resources
 */
export interface ProductListParams extends PaginationParams {
  /** Filter by manufacturer/brand */
  vendor?: string;

  /** Filter by category/type */
  product_type?: string;

  /** Filter by collection */
  collection_id?: number;

  /** Filter by publication status */
  published?: boolean;
}

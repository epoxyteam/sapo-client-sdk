import { PaginationParams } from './client';

/**
 * Price rule types
 * @category Resources
 */
export type PriceRuleType =
  | 'fixed_amount' // Fixed amount off
  | 'percentage' // Percentage off
  | 'buy_x_get_y' // Buy X get Y free
  | 'bulk' // Bulk discount
  | 'shipping_line'; // Shipping discount

/**
 * Price rule target selection types
 * @category Resources
 */
export type PriceRuleTarget =
  | 'line_item' // Individual items
  | 'shipping_line'; // Shipping rates

/**
 * Price rule allocation method
 * @category Resources
 */
export type PriceRuleAllocation =
  | 'each' // Apply to each matching item
  | 'across'; // Apply across matching items

/**
 * Price rule customer selection
 * @category Resources
 */
export type PriceRuleCustomerSelection =
  | 'all' // All customers
  | 'prerequisite'; // Customers matching prerequisites

/**
 * Price rule information
 * @category Resources
 */
export interface PriceRule {
  /** Unique identifier */
  id: number;

  /** Price rule title */
  title: string;

  /** Target type for the price rule */
  target_type: PriceRuleTarget;

  /** Target selection method */
  target_selection: 'all' | 'entitled';

  /** Allocation method */
  allocation_method: PriceRuleAllocation;

  /** Type of price rule */
  value_type: PriceRuleType;

  /** Value of the discount */
  value: number;

  /** Once per customer setting */
  once_per_customer: boolean;

  /** Usage limit per customer */
  usage_limit_per_customer?: number;

  /** Total usage limit */
  usage_limit?: number;

  /** Customer selection type */
  customer_selection: PriceRuleCustomerSelection;

  /** Start date (ISO 8601) */
  starts_at: string;

  /** End date (ISO 8601) */
  ends_at?: string;

  /** Prerequisites JSON string */
  prerequisite_subtotal_range?: string;

  /** Entitled product IDs */
  entitled_product_ids: number[];

  /** Entitled variant IDs */
  entitled_variant_ids: number[];

  /** Entitled collection IDs */
  entitled_collection_ids: number[];

  /** Prerequisites product IDs */
  prerequisite_product_ids: number[];

  /** Prerequisites variant IDs */
  prerequisite_variant_ids: number[];

  /** Prerequisites collection IDs */
  prerequisite_collection_ids: number[];

  /** Created timestamp */
  created_on: string;

  /** Updated timestamp */
  updated_on: string;
}

/**
 * Discount code information
 * @category Resources
 */
export interface DiscountCode {
  /** Unique identifier */
  id: number;

  /** Price rule ID */
  price_rule_id: number;

  /** Discount code */
  code: string;

  /** Number of times used */
  usage_count: number;

  /** Created timestamp */
  created_on: string;

  /** Updated timestamp */
  updated_on: string;
}

/**
 * Data for creating a price rule
 * @category Resources
 */
export interface CreatePriceRuleData {
  /** Price rule title */
  title: string;

  /** Target type */
  target_type: PriceRuleTarget;

  /** Target selection */
  target_selection: 'all' | 'entitled';

  /** Allocation method */
  allocation_method: PriceRuleAllocation;

  /** Type of price rule */
  value_type: PriceRuleType;

  /** Value of the discount */
  value: number;

  /** Start date (ISO 8601) */
  starts_at: string;

  /** Once per customer setting */
  once_per_customer?: boolean;

  /** Usage limit per customer */
  usage_limit_per_customer?: number;

  /** Total usage limit */
  usage_limit?: number;

  /** Customer selection */
  customer_selection?: PriceRuleCustomerSelection;

  /** End date (ISO 8601) */
  ends_at?: string;

  /** Prerequisites JSON */
  prerequisite_subtotal_range?: string;

  /** Entitled product IDs */
  entitled_product_ids?: number[];

  /** Entitled variant IDs */
  entitled_variant_ids?: number[];

  /** Entitled collection IDs */
  entitled_collection_ids?: number[];

  /** Prerequisites product IDs */
  prerequisite_product_ids?: number[];

  /** Prerequisites variant IDs */
  prerequisite_variant_ids?: number[];

  /** Prerequisites collection IDs */
  prerequisite_collection_ids?: number[];
}

/**
 * Data for creating a discount code
 * @category Resources
 */
export interface CreateDiscountCodeData {
  /** Discount code */
  code: string;
}

/**
 * Parameters for listing price rules
 * @category Resources
 */
export interface PriceRuleListParams extends PaginationParams {
  /** Filter by creation date range start */
  created_on_min?: string;

  /** Filter by creation date range end */
  created_on_max?: string;

  /** Filter by update date range start */
  updated_on_min?: string;

  /** Filter by update date range end */
  updated_on_max?: string;

  /** Filter by start date range start */
  starts_at_min?: string;

  /** Filter by start date range end */
  starts_at_max?: string;

  /** Filter by end date range start */
  ends_at_min?: string;

  /** Filter by end date range end */
  ends_at_max?: string;
}

/**
 * Parameters for listing discount codes
 * @category Resources
 */
export interface DiscountCodeListParams extends PaginationParams {
  /** Filter by price rule ID */
  price_rule_id?: number;

  /** Filter by code prefix */
  code_prefix?: string;
}

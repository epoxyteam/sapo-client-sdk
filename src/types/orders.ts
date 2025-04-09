import { PaginationParams } from './client';

/**
 * Order information
 * @category Resources
 */
export interface Order {
  /** Unique identifier */
  id: number;

  /** Order number */
  order_number: string;

  /** Total price of order */
  total_price: number;

  /** Subtotal before discounts and taxes */
  subtotal_price: number;

  /** Total tax amount */
  total_tax: number;

  /** Currency code (e.g., 'VND') */
  currency: string;

  /** Financial status */
  financial_status: OrderFinancialStatus;

  /** Fulfillment status */
  fulfillment_status: OrderFulfillmentStatus;

  /** Order status */
  status: OrderStatus;

  /** Order items */
  line_items: OrderLineItem[];

  /** Customer information */
  customer: OrderCustomer;

  /** Shipping address */
  shipping_address?: Address;

  /** Billing address */
  billing_address?: Address;

  /** Creation timestamp */
  created_on: string;

  /** Last updated timestamp */
  updated_on: string;
}

/** Order financial status */
export type OrderFinancialStatus =
  | 'pending'
  | 'authorized'
  | 'paid'
  | 'partially_paid'
  | 'refunded'
  | 'partially_refunded'
  | 'voided';

/** Order fulfillment status */
export type OrderFulfillmentStatus =
  | 'unfulfilled'
  | 'partially_fulfilled'
  | 'fulfilled'
  | 'restocked';

/** Order status */
export type OrderStatus = 'open' | 'cancelled' | 'completed';

/** Order line item */
export interface OrderLineItem {
  /** Unique identifier */
  id: number;

  /** Product variant ID */
  variant_id: number;

  /** Product ID */
  product_id: number;

  /** Item title */
  title: string;

  /** Variant title */
  variant_title?: string;

  /** SKU */
  sku?: string;

  /** Quantity ordered */
  quantity: number;

  /** Price per unit */
  price: number;

  /** Total price (price * quantity) */
  total_price: number;
}

/** Customer information in order */
export interface OrderCustomer {
  /** Customer ID */
  id: number;

  /** Email address */
  email: string;

  /** Phone number */
  phone?: string;

  /** First name */
  first_name?: string;

  /** Last name */
  last_name?: string;
}

/** Address information */
export interface Address {
  /** First name */
  first_name?: string;

  /** Last name */
  last_name?: string;

  /** Company name */
  company?: string;

  /** Street address 1 */
  address1?: string;

  /** Street address 2 */
  address2?: string;

  /** City */
  city?: string;

  /** Province/State */
  province?: string;

  /** Country */
  country?: string;

  /** ZIP/Postal code */
  zip?: string;

  /** Phone number */
  phone?: string;
}

/**
 * Data for creating a new order
 * @category Resources
 */
export interface CreateOrderData {
  /** Line items to order */
  line_items: Array<{
    variant_id: number;
    quantity: number;
  }>;

  /** Customer info */
  customer?: Partial<OrderCustomer>;

  /** Shipping address */
  shipping_address?: Partial<Address>;

  /** Billing address */
  billing_address?: Partial<Address>;
}

/**
 * Parameters for listing orders
 * @category Resources
 */
export interface OrderListParams extends PaginationParams {
  /** Filter by status */
  status?: OrderStatus;

  /** Filter by financial status */
  financial_status?: OrderFinancialStatus;

  /** Filter by fulfillment status */
  fulfillment_status?: OrderFulfillmentStatus;

  /** Filter by customer ID */
  customer_id?: number;
}

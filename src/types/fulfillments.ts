import { PaginationParams } from './client';
import { Address } from './orders';

/**
 * Fulfillment status
 * @category Resources
 */
export type FulfillmentStatus = 'pending' | 'open' | 'success' | 'cancelled' | 'error' | 'failure';

/**
 * Fulfillment information
 * @category Resources
 */
export interface Fulfillment {
  /** Unique identifier */
  id: number;

  /** Order ID */
  order_id: number;

  /** Fulfillment status */
  status: FulfillmentStatus;

  /** Created timestamp */
  created_on: string;

  /** Updated timestamp */
  updated_on: string;

  /** Tracking company */
  tracking_company?: string;

  /** Tracking number */
  tracking_number?: string;

  /** Customer notification status */
  notify_customer: boolean;

  /** Line items in fulfillment */
  line_items: FulfillmentLineItem[];

  /** Shipping address */
  shipping_address?: Address;
}

/**
 * Fulfillment line item
 * @category Resources
 */
export interface FulfillmentLineItem {
  /** Unique identifier */
  id: number;

  /** Order line item ID */
  order_line_item_id: number;

  /** Variant ID */
  variant_id: number;

  /** Product ID */
  product_id: number;

  /** Title */
  title: string;

  /** Variant title */
  variant_title?: string;

  /** SKU */
  sku?: string;

  /** Quantity fulfilled */
  quantity: number;

  /** Price */
  price: number;

  /** Total price */
  total_price: number;
}

/**
 * Shipping carrier
 * @category Resources
 */
export interface ShippingCarrier {
  /** Carrier code */
  code: string;

  /** Carrier name */
  name: string;

  /** Whether carrier requires tracking numbers */
  requires_tracking_number: boolean;

  /** Whether carrier supports label printing */
  supports_label_printing: boolean;
}

/**
 * Data for creating a fulfillment
 * @category Resources
 */
export interface CreateFulfillmentData {
  /** Line items to fulfill */
  line_items: Array<{
    id: number;
    quantity: number;
  }>;

  /** Tracking number */
  tracking_number?: string;

  /** Tracking company */
  tracking_company?: string;

  /** Whether to notify customer */
  notify_customer?: boolean;
}

/**
 * Data for updating tracking
 * @category Resources
 */
export interface UpdateTrackingData {
  /** New tracking number */
  tracking_number?: string;

  /** New tracking company */
  tracking_company?: string;

  /** Whether to notify customer */
  notify_customer?: boolean;
}

/**
 * Parameters for listing fulfillments
 * @category Resources
 */
export interface FulfillmentListParams extends PaginationParams {
  /** Filter by fulfillment status */
  status?: FulfillmentStatus;

  /** Filter by creation date range start */
  created_on_min?: string;

  /** Filter by creation date range end */
  created_on_max?: string;

  /** Filter by update date range start */
  updated_on_min?: string;

  /** Filter by update date range end */
  updated_on_max?: string;

  /** Filter by order ID */
  order_id?: number;
}

/**
 * Fulfillment event types
 * @category Resources
 */
export type FulfillmentEventType =
  | 'label_printed'
  | 'label_purchased'
  | 'attempted_delivery'
  | 'ready_for_pickup'
  | 'picked_up'
  | 'confirmed'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'failure';

/**
 * Fulfillment event information
 * @category Resources
 */
export interface FulfillmentEvent {
  /** Unique identifier */
  id: number;

  /** Fulfillment ID */
  fulfillment_id: number;

  /** Event status */
  status: FulfillmentEventType;

  /** Event message */
  message?: string;

  /** Created timestamp */
  created_on: string;

  /** Location ID */
  location_id?: number;
}

/**
 * Data for creating a fulfillment event
 * @category Resources
 */
export interface CreateFulfillmentEventData {
  /** Event status */
  status: FulfillmentEventType;

  /** Event message */
  message?: string;
}

import { PaginationParams } from './client';

/**
 * Webhook topic types
 * @category Resources
 */
export type WebhookTopic =
  | 'articles/create'
  | 'articles/update'
  | 'articles/delete'
  | 'blogs/create'
  | 'blogs/update'
  | 'blogs/delete'
  | 'collections/create'
  | 'collections/update'
  | 'collections/delete'
  | 'customers/create'
  | 'customers/update'
  | 'customers/delete'
  | 'fulfillments/create'
  | 'fulfillments/update'
  | 'fulfillments/delete'
  | 'inventory_items/create'
  | 'inventory_items/update'
  | 'inventory_items/delete'
  | 'inventory_levels/update'
  | 'orders/create'
  | 'orders/paid'
  | 'orders/cancelled'
  | 'orders/fulfilled'
  | 'orders/partially_fulfilled'
  | 'orders/update'
  | 'orders/delete'
  | 'products/create'
  | 'products/update'
  | 'products/delete'
  | 'refunds/create';

/**
 * Webhook information
 * @category Resources
 */
export interface Webhook {
  /** Unique identifier */
  id: number;

  /** Webhook topic */
  topic: WebhookTopic;

  /** Webhook address (URL) */
  address: string;

  /** Format of the data sent (json) */
  format: 'json';

  /** API version to use */
  api_version?: string;

  /** Fields to include in the payload */
  fields?: string[];

  /** Metafields to include in the payload */
  metafield_namespaces?: string[];

  /** Private metafields to include in the payload */
  private_metafield_namespaces?: string[];

  /** Creation timestamp */
  created_on: string;

  /** Last update timestamp */
  updated_on: string;
}

/**
 * Data for creating a webhook
 * @category Resources
 */
export interface CreateWebhookData {
  /** Webhook topic */
  topic: WebhookTopic;

  /** Webhook address (URL) */
  address: string;

  /** Format of the data sent */
  format?: 'json';

  /** API version to use */
  api_version?: string;

  /** Fields to include in the payload */
  fields?: string[];

  /** Metafields to include in the payload */
  metafield_namespaces?: string[];

  /** Private metafields to include in the payload */
  private_metafield_namespaces?: string[];
}

/**
 * Parameters for listing webhooks
 * @category Resources
 */
export interface WebhookListParams extends PaginationParams {
  /** Filter by topic */
  topic?: WebhookTopic;

  /** Filter by address */
  address?: string;

  /** Filter by creation date range start */
  created_on_min?: string;

  /** Filter by creation date range end */
  created_on_max?: string;

  /** Filter by update date range start */
  updated_on_min?: string;

  /** Filter by update date range end */
  updated_on_max?: string;

  /** Fields to include in response */
  fields?: string[];
}

/**
 * Webhook delivery information
 * @category Resources
 */
export interface WebhookDelivery {
  /** Unique identifier */
  id: number;

  /** Webhook ID */
  webhook_id: number;

  /** Response code from delivery attempt */
  response_code?: number;

  /** Response body from delivery attempt */
  response_body?: string;

  /** Error message if delivery failed */
  error_message?: string;

  /** Delivery timestamp */
  delivered_on: string;
}

/**
 * Parameters for listing webhook deliveries
 * @category Resources
 */
export interface WebhookDeliveryListParams extends PaginationParams {
  /** Filter by delivery status */
  status?: 'success' | 'failed';

  /** Filter by delivery date range start */
  delivered_on_min?: string;

  /** Filter by delivery date range end */
  delivered_on_max?: string;
}

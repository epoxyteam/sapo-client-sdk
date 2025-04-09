import { PaginationParams } from './client';

/**
 * Inventory item information
 * @category Resources
 */
export interface InventoryItem {
  /** Unique identifier */
  id: number;

  /** SKU (Stock Keeping Unit) */
  sku?: string;

  /** Created timestamp */
  created_on: string;

  /** Updated timestamp */
  updated_on: string;

  /** Whether inventory is being tracked */
  tracked: boolean;

  /** Product variant ID */
  variant_id: number;

  /** Product ID */
  product_id: number;

  /** Location inventories */
  location_inventories: LocationInventory[];
}

/**
 * Location inventory information
 * @category Resources
 */
export interface LocationInventory {
  /** Unique identifier */
  id: number;

  /** Location ID */
  location_id: number;

  /** Available quantity */
  available: number;

  /** Maximum quantity that can be ordered */
  max_orderable?: number;

  /** Whether inventory is being tracked at this location */
  tracked: boolean;

  /** Created timestamp */
  created_on: string;

  /** Updated timestamp */
  updated_on: string;
}

/**
 * Inventory adjustment action
 * @category Resources
 */
export type InventoryAdjustmentAction = 'set' | 'add' | 'remove';

/**
 * Inventory adjustment data
 * @category Resources
 */
export interface InventoryAdjustment {
  /** Location ID */
  location_id: number;

  /** Adjustment quantity */
  quantity: number;

  /** Adjustment action */
  action: InventoryAdjustmentAction;

  /** Reason for adjustment */
  reason?: string;
}

/**
 * Parameters for listing inventory items
 * @category Resources
 */
export interface InventoryListParams extends PaginationParams {
  /** Filter by product ID */
  product_id?: number;

  /** Filter by variant ID */
  variant_id?: number;

  /** Filter by SKU */
  sku?: string;

  /** Filter by location ID */
  location_id?: number;

  /** Filter by tracking status */
  tracked?: boolean;

  /** Filter by update date range start */
  updated_on_min?: string;

  /** Filter by update date range end */
  updated_on_max?: string;
}

/**
 * Inventory level update data
 * @category Resources
 */
export interface UpdateInventoryLevelData {
  /** Available quantity */
  available: number;

  /** Whether to disconnect inventory if quantity is 0 */
  disconnect_if_zero?: boolean;

  /** Maximum orderable quantity */
  max_orderable?: number;
}

/**
 * Inventory transfer data
 * @category Resources
 */
export interface InventoryTransferData {
  /** Source location ID */
  from_location_id: number;

  /** Destination location ID */
  to_location_id: number;

  /** Quantity to transfer */
  quantity: number;

  /** Reference number */
  reference_number?: string;

  /** Transfer notes */
  notes?: string;
}

/**
 * Inventory transfer response
 * @category Resources
 */
export interface InventoryTransfer {
  /** Unique identifier */
  id: number;

  /** Source location ID */
  from_location_id: number;

  /** Destination location ID */
  to_location_id: number;

  /** Quantity transferred */
  quantity: number;

  /** Reference number */
  reference_number?: string;

  /** Transfer notes */
  notes?: string;

  /** Created timestamp */
  created_on: string;

  /** Transfer status */
  status: 'pending' | 'completed' | 'cancelled';
}

/**
 * Location information
 * @category Resources
 */
export interface Location {
  /** Unique identifier */
  id: number;

  /** Location name */
  name: string;

  /** Address line 1 */
  address1?: string;

  /** Address line 2 */
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

  /** Whether location is active */
  active: boolean;
}

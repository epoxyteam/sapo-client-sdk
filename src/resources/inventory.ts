import { SapoClient } from '../client';
import { PaginatedResponse } from '../types/client';
import {
  InventoryItem,
  InventoryListParams,
  InventoryAdjustment,
  UpdateInventoryLevelData,
  InventoryTransferData,
  InventoryTransfer,
  Location,
} from '../types/inventory';

/**
 * Inventory resource handler
 * @category Resources
 */
export class Inventory {
  constructor(private readonly client: SapoClient) {}

  /**
   * Get a list of inventory items
   * @param params Query parameters for filtering and pagination
   * @returns Paginated list of inventory items
   */
  public async list(params?: InventoryListParams): Promise<PaginatedResponse<InventoryItem>> {
    return this.client.get('/admin/inventory_items.json', params);
  }

  /**
   * Get a single inventory item by ID
   * @param id Inventory item ID
   * @returns Inventory item details
   */
  public async get(id: number): Promise<InventoryItem> {
    const response = await this.client.get<{ inventory_item: InventoryItem }>(
      `/admin/inventory_items/${id}.json`
    );
    return response.inventory_item;
  }

  /**
   * Adjust inventory level
   * @param itemId Inventory item ID
   * @param adjustment Inventory adjustment data
   * @returns Updated inventory item
   */
  public async adjustQuantity(
    itemId: number,
    adjustment: InventoryAdjustment
  ): Promise<InventoryItem> {
    const response = await this.client.post<{ inventory_item: InventoryItem }>(
      `/admin/inventory_items/${itemId}/adjust.json`,
      { adjustment }
    );
    return response.inventory_item;
  }

  /**
   * Set inventory level at location
   * @param itemId Inventory item ID
   * @param locationId Location ID
   * @param data Inventory level data
   * @returns Updated inventory item
   */
  public async setLevel(
    itemId: number,
    locationId: number,
    data: UpdateInventoryLevelData
  ): Promise<InventoryItem> {
    const response = await this.client.put<{ inventory_item: InventoryItem }>(
      `/admin/inventory_items/${itemId}/locations/${locationId}.json`,
      { inventory_level: data }
    );
    return response.inventory_item;
  }

  /**
   * Transfer inventory between locations
   * @param itemId Inventory item ID
   * @param data Transfer data
   * @returns Created inventory transfer
   */
  public async transfer(itemId: number, data: InventoryTransferData): Promise<InventoryTransfer> {
    const response = await this.client.post<{ inventory_transfer: InventoryTransfer }>(
      `/admin/inventory_items/${itemId}/transfers.json`,
      { transfer: data }
    );
    return response.inventory_transfer;
  }

  /**
   * Get inventory transfer by ID
   * @param itemId Inventory item ID
   * @param transferId Transfer ID
   * @returns Inventory transfer details
   */
  public async getTransfer(itemId: number, transferId: number): Promise<InventoryTransfer> {
    const response = await this.client.get<{ inventory_transfer: InventoryTransfer }>(
      `/admin/inventory_items/${itemId}/transfers/${transferId}.json`
    );
    return response.inventory_transfer;
  }

  /**
   * Cancel inventory transfer
   * @param itemId Inventory item ID
   * @param transferId Transfer ID
   * @returns Cancelled inventory transfer
   */
  public async cancelTransfer(itemId: number, transferId: number): Promise<InventoryTransfer> {
    const response = await this.client.post<{ inventory_transfer: InventoryTransfer }>(
      `/admin/inventory_items/${itemId}/transfers/${transferId}/cancel.json`
    );
    return response.inventory_transfer;
  }

  /**
   * Get list of locations
   * @returns List of locations
   */
  public async listLocations(): Promise<Location[]> {
    const response = await this.client.get<{ locations: Location[] }>('/admin/locations.json');
    return response.locations;
  }

  /**
   * Get location by ID
   * @param id Location ID
   * @returns Location details
   */
  public async getLocation(id: number): Promise<Location> {
    const response = await this.client.get<{ location: Location }>(`/admin/locations/${id}.json`);
    return response.location;
  }

  /**
   * Get total inventory item count
   * @param params Filter parameters
   * @returns Total number of inventory items matching filters
   */
  public async count(params?: Partial<InventoryListParams>): Promise<number> {
    const response = await this.client.get<{ count: number }>(
      '/admin/inventory_items/count.json',
      params
    );
    return response.count;
  }
}

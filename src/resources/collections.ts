import { SapoClient } from '../client';
import { PaginatedResponse } from '../types/client';
import {
  Collection,
  CollectionListParams,
  CreateCollectionData,
  CreateSmartCollectionData,
} from '../types/collections';

/**
 * Collections resource handler
 * @category Resources
 */
export class Collections {
  constructor(private readonly client: SapoClient) {}

  /**
   * Get a list of collections
   * @param params Query parameters for filtering and pagination
   * @returns Paginated list of collections
   */
  public async list(params?: CollectionListParams): Promise<PaginatedResponse<Collection>> {
    return this.client.get('/admin/collections.json', params);
  }

  /**
   * Get a single collection by ID
   * @param id Collection ID
   * @returns Collection details
   */
  public async get(id: number): Promise<Collection> {
    const response = await this.client.get<{ collection: Collection }>(
      `/admin/collections/${id}.json`
    );
    return response.collection;
  }

  /**
   * Create a custom collection
   * @param data Collection data
   * @returns Created collection
   */
  public async createCustomCollection(data: CreateCollectionData): Promise<Collection> {
    const response = await this.client.post<{ collection: Collection }>(
      '/admin/custom_collections.json',
      { custom_collection: data }
    );
    return response.collection;
  }

  /**
   * Create a smart collection
   * @param data Smart collection data
   * @returns Created collection
   */
  public async createSmartCollection(data: CreateSmartCollectionData): Promise<Collection> {
    const response = await this.client.post<{ smart_collection: Collection }>(
      '/admin/smart_collections.json',
      { smart_collection: data }
    );
    return response.smart_collection;
  }

  /**
   * Update a custom collection
   * @param id Collection ID
   * @param data Collection update data
   * @returns Updated collection
   */
  public async updateCustomCollection(
    id: number,
    data: Partial<CreateCollectionData>
  ): Promise<Collection> {
    const response = await this.client.put<{ collection: Collection }>(
      `/admin/custom_collections/${id}.json`,
      { custom_collection: data }
    );
    return response.collection;
  }

  /**
   * Update a smart collection
   * @param id Collection ID
   * @param data Smart collection update data
   * @returns Updated collection
   */
  public async updateSmartCollection(
    id: number,
    data: Partial<CreateSmartCollectionData>
  ): Promise<Collection> {
    const response = await this.client.put<{ smart_collection: Collection }>(
      `/admin/smart_collections/${id}.json`,
      { smart_collection: data }
    );
    return response.smart_collection;
  }

  /**
   * Delete a custom collection
   * @param id Collection ID
   */
  public async deleteCustomCollection(id: number): Promise<void> {
    await this.client.delete(`/admin/custom_collections/${id}.json`);
  }

  /**
   * Delete a smart collection
   * @param id Collection ID
   */
  public async deleteSmartCollection(id: number): Promise<void> {
    await this.client.delete(`/admin/smart_collections/${id}.json`);
  }

  /**
   * Get total collection count
   * @param params Filter parameters
   * @returns Total number of collections matching filters
   */
  public async count(params?: Partial<CollectionListParams>): Promise<number> {
    const response = await this.client.get<{ count: number }>(
      '/admin/collections/count.json',
      params
    );
    return response.count;
  }

  /**
   * Update products order in a custom collection
   * @param collectionId Collection ID
   * @param productIds Ordered list of product IDs
   * @returns Updated collection
   */
  public async setProductOrder(collectionId: number, productIds: number[]): Promise<Collection> {
    const response = await this.client.put<{ collection: Collection }>(
      `/admin/collections/${collectionId}/products/reorder.json`,
      { products: productIds }
    );
    return response.collection;
  }

  /**
   * Add a product to a custom collection
   * @param collectionId Collection ID
   * @param productId Product ID
   */
  public async addProduct(collectionId: number, productId: number): Promise<void> {
    await this.client.post(`/admin/collections/${collectionId}/products/${productId}.json`);
  }

  /**
   * Remove a product from a custom collection
   * @param collectionId Collection ID
   * @param productId Product ID
   */
  public async removeProduct(collectionId: number, productId: number): Promise<void> {
    await this.client.delete(`/admin/collections/${collectionId}/products/${productId}.json`);
  }
}

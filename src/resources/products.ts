import { SapoClient } from '../client';
import { PaginatedResponse } from '../types/client';
import { Product, CreateProductData, ProductListParams } from '../types/products';

/**
 * Products resource handler
 * @category Resources
 */
export class Products {
  constructor(private readonly client: SapoClient) {}

  /**
   * Get a list of products
   */
  public async list(params?: ProductListParams): Promise<PaginatedResponse<Product>> {
    return this.client.get('/admin/products.json', params);
  }

  /**
   * Get a single product by ID
   */
  public async get(id: number): Promise<Product> {
    const response = await this.client.get<{ product: Product }>(`/admin/products/${id}.json`);
    return response.product;
  }

  /**
   * Create a new product
   */
  public async create(data: CreateProductData): Promise<Product> {
    const response = await this.client.post<{ product: Product }>('/admin/products.json', {
      product: data,
    });
    return response.product;
  }

  /**
   * Update an existing product
   */
  public async update(id: number, data: Partial<CreateProductData>): Promise<Product> {
    const response = await this.client.put<{ product: Product }>(`/admin/products/${id}.json`, {
      product: data,
    });
    return response.product;
  }

  /**
   * Delete a product
   */
  public async delete(id: number): Promise<void> {
    await this.client.delete(`/admin/products/${id}.json`);
  }

  /**
   * Get total product count
   */
  public async count(params?: Partial<ProductListParams>): Promise<number> {
    const response = await this.client.get<{ count: number }>('/admin/products/count.json', params);
    return response.count;
  }
}

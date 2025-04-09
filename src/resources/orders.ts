import { SapoClient } from '../client';
import { PaginatedResponse } from '../types/client';
import { Order, CreateOrderData, OrderListParams } from '../types/orders';

/**
 * Orders resource handler
 * @category Resources
 */
export class Orders {
  constructor(private readonly client: SapoClient) {}

  /**
   * Get a list of orders
   * @param params Query parameters for filtering and pagination
   * @returns Paginated list of orders
   */
  public async list(params?: OrderListParams): Promise<PaginatedResponse<Order>> {
    return this.client.get('/admin/orders.json', params);
  }

  /**
   * Get a single order by ID
   * @param id Order ID
   * @returns Order details
   */
  public async get(id: number): Promise<Order> {
    const response = await this.client.get<{ order: Order }>(`/admin/orders/${id}.json`);
    return response.order;
  }

  /**
   * Create a new order
   * @param data Order creation data
   * @returns Created order
   */
  public async create(data: CreateOrderData): Promise<Order> {
    const response = await this.client.post<{ order: Order }>('/admin/orders.json', {
      order: data,
    });
    return response.order;
  }

  /**
   * Update an existing order
   * @param id Order ID
   * @param data Order update data
   * @returns Updated order
   */
  public async update(id: number, data: Partial<CreateOrderData>): Promise<Order> {
    const response = await this.client.put<{ order: Order }>(`/admin/orders/${id}.json`, {
      order: data,
    });
    return response.order;
  }

  /**
   * Delete an order
   * @param id Order ID
   */
  public async delete(id: number): Promise<void> {
    await this.client.delete(`/admin/orders/${id}.json`);
  }

  /**
   * Get total order count
   * @param params Filter parameters
   * @returns Total number of orders matching filters
   */
  public async count(params?: Partial<OrderListParams>): Promise<number> {
    const response = await this.client.get<{ count: number }>('/admin/orders/count.json', params);
    return response.count;
  }

  /**
   * Cancel an order
   * @param id Order ID
   * @returns Cancelled order
   */
  public async cancel(id: number): Promise<Order> {
    const response = await this.client.post<{ order: Order }>(`/admin/orders/${id}/cancel.json`);
    return response.order;
  }

  /**
   * Mark an order as paid
   * @param id Order ID
   * @returns Updated order
   */
  public async markAsPaid(id: number): Promise<Order> {
    const response = await this.client.post<{ order: Order }>(`/admin/orders/${id}/paid.json`);
    return response.order;
  }

  /**
   * Mark an order as fulfilled
   * @param id Order ID
   * @returns Updated order
   */
  public async markAsFulfilled(id: number): Promise<Order> {
    const response = await this.client.post<{ order: Order }>(`/admin/orders/${id}/fulfilled.json`);
    return response.order;
  }
}

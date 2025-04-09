import { SapoClient } from '../client';
import { PaginatedResponse } from '../types/client';
import {
  Fulfillment,
  FulfillmentListParams,
  CreateFulfillmentData,
  UpdateTrackingData,
  FulfillmentEvent,
  CreateFulfillmentEventData,
  ShippingCarrier,
} from '../types/fulfillments';

/**
 * Fulfillments resource handler
 * @category Resources
 */
export class Fulfillments {
  constructor(private readonly client: SapoClient) {}

  /**
   * Get a list of fulfillments for an order
   * @param orderId Order ID
   * @param params Query parameters for filtering and pagination
   */
  public async list(
    orderId: number,
    params?: FulfillmentListParams
  ): Promise<PaginatedResponse<Fulfillment>> {
    return this.client.get(`/admin/orders/${orderId}/fulfillments.json`, params);
  }

  /**
   * Get a single fulfillment
   * @param orderId Order ID
   * @param id Fulfillment ID
   */
  public async get(orderId: number, id: number): Promise<Fulfillment> {
    const response = await this.client.get<{ fulfillment: Fulfillment }>(
      `/admin/orders/${orderId}/fulfillments/${id}.json`
    );
    return response.fulfillment;
  }

  /**
   * Create a fulfillment for an order
   * @param orderId Order ID
   * @param data Fulfillment data
   */
  public async create(orderId: number, data: CreateFulfillmentData): Promise<Fulfillment> {
    const response = await this.client.post<{ fulfillment: Fulfillment }>(
      `/admin/orders/${orderId}/fulfillments.json`,
      { fulfillment: data }
    );
    return response.fulfillment;
  }

  /**
   * Update tracking information
   * @param orderId Order ID
   * @param id Fulfillment ID
   * @param data Tracking update data
   */
  public async updateTracking(
    orderId: number,
    id: number,
    data: UpdateTrackingData
  ): Promise<Fulfillment> {
    const response = await this.client.put<{ fulfillment: Fulfillment }>(
      `/admin/orders/${orderId}/fulfillments/${id}/tracking.json`,
      { tracking_info: data }
    );
    return response.fulfillment;
  }

  /**
   * Cancel a fulfillment
   * @param orderId Order ID
   * @param id Fulfillment ID
   */
  public async cancel(orderId: number, id: number): Promise<Fulfillment> {
    const response = await this.client.post<{ fulfillment: Fulfillment }>(
      `/admin/orders/${orderId}/fulfillments/${id}/cancel.json`
    );
    return response.fulfillment;
  }

  /**
   * Get available shipping carriers
   */
  public async getCarriers(): Promise<ShippingCarrier[]> {
    const response = await this.client.get<{ carriers: ShippingCarrier[] }>('/admin/carriers.json');
    return response.carriers;
  }

  /**
   * Create a fulfillment event
   * @param orderId Order ID
   * @param fulfillmentId Fulfillment ID
   * @param data Event data
   */
  public async createEvent(
    orderId: number,
    fulfillmentId: number,
    data: CreateFulfillmentEventData
  ): Promise<FulfillmentEvent> {
    const response = await this.client.post<{ event: FulfillmentEvent }>(
      `/admin/orders/${orderId}/fulfillments/${fulfillmentId}/events.json`,
      { event: data }
    );
    return response.event;
  }

  /**
   * Get fulfillment events
   * @param orderId Order ID
   * @param fulfillmentId Fulfillment ID
   */
  public async listEvents(orderId: number, fulfillmentId: number): Promise<FulfillmentEvent[]> {
    const response = await this.client.get<{ events: FulfillmentEvent[] }>(
      `/admin/orders/${orderId}/fulfillments/${fulfillmentId}/events.json`
    );
    return response.events;
  }

  /**
   * Delete a fulfillment event
   * @param orderId Order ID
   * @param fulfillmentId Fulfillment ID
   * @param eventId Event ID
   */
  public async deleteEvent(orderId: number, fulfillmentId: number, eventId: number): Promise<void> {
    await this.client.delete(
      `/admin/orders/${orderId}/fulfillments/${fulfillmentId}/events/${eventId}.json`
    );
  }

  /**
   * Get total fulfillment count for an order
   * @param orderId Order ID
   * @param params Filter parameters
   */
  public async count(orderId: number, params?: Partial<FulfillmentListParams>): Promise<number> {
    const response = await this.client.get<{ count: number }>(
      `/admin/orders/${orderId}/fulfillments/count.json`,
      params
    );
    return response.count;
  }
}

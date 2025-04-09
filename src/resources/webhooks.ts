import { SapoClient } from '../client';
import { PaginatedResponse } from '../types/client';
import {
  Webhook,
  CreateWebhookData,
  WebhookListParams,
  WebhookDelivery,
  WebhookDeliveryListParams,
} from '../types/webhooks';

/**
 * Webhooks resource handler
 * @category Resources
 */
export class Webhooks {
  constructor(private readonly client: SapoClient) {}

  /**
   * List webhooks
   * @param params Query parameters
   */
  public async list(params?: WebhookListParams): Promise<PaginatedResponse<Webhook>> {
    return this.client.get('/admin/webhooks.json', params);
  }

  /**
   * Get a single webhook
   * @param id Webhook ID
   */
  public async get(id: number): Promise<Webhook> {
    const response = await this.client.get<{ webhook: Webhook }>(`/admin/webhooks/${id}.json`);
    return response.webhook;
  }

  /**
   * Create a new webhook
   * @param data Webhook creation data
   */
  public async create(data: CreateWebhookData): Promise<Webhook> {
    const response = await this.client.post<{ webhook: Webhook }>('/admin/webhooks.json', {
      webhook: data,
    });
    return response.webhook;
  }

  /**
   * Update a webhook
   * @param id Webhook ID
   * @param data Webhook update data
   */
  public async update(id: number, data: Partial<CreateWebhookData>): Promise<Webhook> {
    const response = await this.client.put<{ webhook: Webhook }>(`/admin/webhooks/${id}.json`, {
      webhook: data,
    });
    return response.webhook;
  }

  /**
   * Delete a webhook
   * @param id Webhook ID
   */
  public async delete(id: number): Promise<void> {
    await this.client.delete(`/admin/webhooks/${id}.json`);
  }

  /**
   * Get webhook count
   * @param params Filter parameters
   */
  public async count(params?: Partial<WebhookListParams>): Promise<number> {
    const response = await this.client.get<{ count: number }>('/admin/webhooks/count.json', params);
    return response.count;
  }

  /**
   * List webhook deliveries
   * @param webhookId Webhook ID
   * @param params Query parameters
   */
  public async listDeliveries(
    webhookId: number,
    params?: WebhookDeliveryListParams
  ): Promise<PaginatedResponse<WebhookDelivery>> {
    return this.client.get(`/admin/webhooks/${webhookId}/deliveries.json`, params);
  }

  /**
   * Get a single webhook delivery
   * @param webhookId Webhook ID
   * @param deliveryId Delivery ID
   */
  public async getDelivery(webhookId: number, deliveryId: number): Promise<WebhookDelivery> {
    const response = await this.client.get<{ delivery: WebhookDelivery }>(
      `/admin/webhooks/${webhookId}/deliveries/${deliveryId}.json`
    );
    return response.delivery;
  }

  /**
   * Re-send a webhook delivery
   * @param webhookId Webhook ID
   * @param deliveryId Delivery ID
   */
  public async resendDelivery(webhookId: number, deliveryId: number): Promise<WebhookDelivery> {
    const response = await this.client.post<{ delivery: WebhookDelivery }>(
      `/admin/webhooks/${webhookId}/deliveries/${deliveryId}/resend.json`
    );
    return response.delivery;
  }

  /**
   * Test a webhook by sending a dummy data payload
   * @param id Webhook ID
   */
  public async test(id: number): Promise<void> {
    await this.client.post(`/admin/webhooks/${id}/test.json`);
  }

  /**
   * Verify webhook signature
   * @param signature HMAC signature from webhook
   * @param body Raw webhook request body
   */
  public verifySignature(signature: string, body: string): boolean {
    return this.client.verifyWebhookHmac({ body }, signature);
  }
}

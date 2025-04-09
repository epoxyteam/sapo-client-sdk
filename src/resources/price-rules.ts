import { SapoClient } from '../client';
import { NotFoundError } from '../errors';
import { PaginatedResponse } from '../types/client';
import {
  PriceRule,
  DiscountCode,
  CreatePriceRuleData,
  CreateDiscountCodeData,
  PriceRuleListParams,
  DiscountCodeListParams,
} from '../types/price-rules';

/**
 * Price Rules resource handler
 * @category Resources
 */
export class PriceRules {
  constructor(private readonly client: SapoClient) {}

  /**
   * Get a list of price rules
   */
  public async list(params?: PriceRuleListParams): Promise<PaginatedResponse<PriceRule>> {
    return this.client.get('/admin/price_rules.json', params);
  }

  /**
   * Get a single price rule by ID
   */
  public async get(id: number): Promise<PriceRule> {
    const response = await this.client.get<{ price_rule: PriceRule }>(
      `/admin/price_rules/${id}.json`
    );
    return response.price_rule;
  }

  /**
   * Create a new price rule
   */
  public async create(data: CreatePriceRuleData): Promise<PriceRule> {
    const response = await this.client.post<{ price_rule: PriceRule }>('/admin/price_rules.json', {
      price_rule: data,
    });
    return response.price_rule;
  }

  /**
   * Update an existing price rule
   */
  public async update(id: number, data: Partial<CreatePriceRuleData>): Promise<PriceRule> {
    const response = await this.client.put<{ price_rule: PriceRule }>(
      `/admin/price_rules/${id}.json`,
      { price_rule: data }
    );
    return response.price_rule;
  }

  /**
   * Delete a price rule
   */
  public async delete(id: number): Promise<void> {
    await this.client.delete(`/admin/price_rules/${id}.json`);
  }

  /**
   * Get total price rule count
   */
  public async count(params?: Partial<PriceRuleListParams>): Promise<number> {
    const response = await this.client.get<{ count: number }>(
      '/admin/price_rules/count.json',
      params
    );
    return response.count;
  }

  /**
   * Get discount codes for a price rule
   */
  public async listDiscountCodes(
    priceRuleId: number,
    params?: DiscountCodeListParams
  ): Promise<PaginatedResponse<DiscountCode>> {
    return this.client.get(`/admin/price_rules/${priceRuleId}/discount_codes.json`, params);
  }

  /**
   * Get a single discount code
   */
  public async getDiscountCode(priceRuleId: number, id: number): Promise<DiscountCode> {
    const response = await this.client.get<{ discount_code: DiscountCode }>(
      `/admin/price_rules/${priceRuleId}/discount_codes/${id}.json`
    );
    return response.discount_code;
  }

  /**
   * Create a discount code for a price rule
   */
  public async createDiscountCode(
    priceRuleId: number,
    data: CreateDiscountCodeData
  ): Promise<DiscountCode> {
    const response = await this.client.post<{ discount_code: DiscountCode }>(
      `/admin/price_rules/${priceRuleId}/discount_codes.json`,
      { discount_code: data }
    );
    return response.discount_code;
  }

  /**
   * Update a discount code
   */
  public async updateDiscountCode(
    priceRuleId: number,
    id: number,
    data: Partial<CreateDiscountCodeData>
  ): Promise<DiscountCode> {
    const response = await this.client.put<{ discount_code: DiscountCode }>(
      `/admin/price_rules/${priceRuleId}/discount_codes/${id}.json`,
      { discount_code: data }
    );
    return response.discount_code;
  }

  /**
   * Delete a discount code
   */
  public async deleteDiscountCode(priceRuleId: number, id: number): Promise<void> {
    await this.client.delete(`/admin/price_rules/${priceRuleId}/discount_codes/${id}.json`);
  }

  /**
   * Lookup discount code by code
   */
  public async lookupDiscountCode(code: string): Promise<DiscountCode | null> {
    try {
      const response = await this.client.get<{ discount_code: DiscountCode }>(
        '/admin/discount_codes/lookup.json',
        { code }
      );
      return response.discount_code;
    } catch (error) {
      if (error instanceof NotFoundError) {
        return null;
      }
      throw error;
    }
  }
}

import { SapoClient } from '../client';
import { PaginatedResponse } from '../types/client';
import { ValidationError } from '../errors';
import {
  Metafield,
  CreateMetafieldData,
  MetafieldListParams,
  MetafieldOwnerParams,
  MetafieldBulkParams,
  MetafieldBulkResponse,
  ValidateMetafieldOptions,
} from '../types/metafields';

/**
 * Metafields resource handler
 * @category Resources
 */
export class Metafields {
  constructor(private readonly client: SapoClient) {}

  /**
   * List metafields for a specific owner
   * @param owner Owner resource information
   * @param params Query parameters for filtering and pagination
   */
  public async list(
    owner: MetafieldOwnerParams,
    params?: MetafieldListParams
  ): Promise<PaginatedResponse<Metafield>> {
    return this.client.get(`/admin/${owner.owner_type}s/${owner.owner_id}/metafields.json`, params);
  }

  /**
   * Get a single metafield
   * @param owner Owner resource information
   * @param id Metafield ID
   */
  public async get(owner: MetafieldOwnerParams, id: number): Promise<Metafield> {
    const response = await this.client.get<{ metafield: Metafield }>(
      `/admin/${owner.owner_type}s/${owner.owner_id}/metafields/${id}.json`
    );
    return response.metafield;
  }

  /**
   * Create a new metafield
   * @param owner Owner resource information
   * @param data Metafield data
   */
  public async create(owner: MetafieldOwnerParams, data: CreateMetafieldData): Promise<Metafield> {
    const response = await this.client.post<{ metafield: Metafield }>(
      `/admin/${owner.owner_type}s/${owner.owner_id}/metafields.json`,
      { metafield: data }
    );
    return response.metafield;
  }

  /**
   * Update a metafield
   * @param owner Owner resource information
   * @param id Metafield ID
   * @param data Metafield update data
   */
  public async update(
    owner: MetafieldOwnerParams,
    id: number,
    data: Partial<CreateMetafieldData>
  ): Promise<Metafield> {
    const response = await this.client.put<{ metafield: Metafield }>(
      `/admin/${owner.owner_type}s/${owner.owner_id}/metafields/${id}.json`,
      { metafield: data }
    );
    return response.metafield;
  }

  /**
   * Delete a metafield
   * @param owner Owner resource information
   * @param id Metafield ID
   */
  public async delete(owner: MetafieldOwnerParams, id: number): Promise<void> {
    await this.client.delete(`/admin/${owner.owner_type}s/${owner.owner_id}/metafields/${id}.json`);
  }

  /**
   * Count metafields for a specific owner
   * @param owner Owner resource information
   * @param params Filter parameters
   */
  public async count(
    owner: MetafieldOwnerParams,
    params?: Partial<MetafieldListParams>
  ): Promise<number> {
    const response = await this.client.get<{ count: number }>(
      `/admin/${owner.owner_type}s/${owner.owner_id}/metafields/count.json`,
      params
    );
    return response.count;
  }

  /**
   * Delete multiple metafields by filter
   * @param owner Owner resource information
   * @param params Filter parameters
   */
  public async bulkDelete(
    owner: MetafieldOwnerParams,
    params: MetafieldBulkParams
  ): Promise<MetafieldBulkResponse> {
    const response = await this.client.delete<{ bulk_operation: MetafieldBulkResponse }>(
      `/admin/${owner.owner_type}s/${owner.owner_id}/metafields/bulk.json`,
      params
    );
    return response.bulk_operation;
  }

  /**
   * Validate metafield value
   * @param options Validation options
   * @throws {ValidationError} If validation fails
   */
  public validateValue(options: ValidateMetafieldOptions): void {
    const { value, value_type, rules } = options;

    switch (value_type) {
      case 'integer':
      case 'float': {
        const num = Number(value);
        if (isNaN(num)) {
          throw new ValidationError('Invalid number format', 'INVALID_FORMAT');
        }
        if (rules?.min !== undefined && num < rules.min) {
          throw new ValidationError(`Value must be >= ${rules.min}`, 'MIN_VALUE');
        }
        if (rules?.max !== undefined && num > rules.max) {
          throw new ValidationError(`Value must be <= ${rules.max}`, 'MAX_VALUE');
        }
        break;
      }

      case 'boolean': {
        if (!/^(true|false)$/.test(value.toLowerCase())) {
          throw new ValidationError('Value must be true or false', 'INVALID_BOOLEAN');
        }
        break;
      }

      case 'json': {
        try {
          const parsed = JSON.parse(value);
          if (rules?.schema) {
            // Basic schema validation could be expanded
            if (typeof parsed !== typeof rules.schema) {
              throw new ValidationError('JSON does not match schema', 'SCHEMA_MISMATCH');
            }
          }
        } catch (error) {
          throw new ValidationError('Invalid JSON format', 'INVALID_JSON');
        }
        break;
      }

      case 'date': {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
          throw new ValidationError('Invalid date format (YYYY-MM-DD)', 'INVALID_DATE');
        }
        break;
      }

      case 'datetime': {
        if (!Date.parse(value)) {
          throw new ValidationError('Invalid datetime format', 'INVALID_DATETIME');
        }
        break;
      }

      case 'string': {
        if (rules?.pattern && !new RegExp(rules.pattern).test(value)) {
          throw new ValidationError('String does not match pattern', 'PATTERN_MISMATCH');
        }
        break;
      }
    }
  }
}

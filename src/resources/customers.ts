import { SapoClient } from '../client';
import { PaginatedResponse } from '../types/client';
import {
  Customer,
  CreateCustomerData,
  CustomerListParams,
  CustomerSearchParams,
} from '../types/customers';

/**
 * Customers resource handler
 * @category Resources
 */
export class Customers {
  constructor(private readonly client: SapoClient) {}

  /**
   * Get a list of customers
   * @param params Query parameters for filtering and pagination
   * @returns Paginated list of customers
   */
  public async list(params?: CustomerListParams): Promise<PaginatedResponse<Customer>> {
    return this.client.get('/admin/customers.json', params);
  }

  /**
   * Get a single customer by ID
   * @param id Customer ID
   * @returns Customer details
   */
  public async get(id: number): Promise<Customer> {
    const response = await this.client.get<{ customer: Customer }>(`/admin/customers/${id}.json`);
    return response.customer;
  }

  /**
   * Create a new customer
   * @param data Customer creation data
   * @returns Created customer
   */
  public async create(data: CreateCustomerData): Promise<Customer> {
    const response = await this.client.post<{ customer: Customer }>('/admin/customers.json', {
      customer: data,
    });
    return response.customer;
  }

  /**
   * Update an existing customer
   * @param id Customer ID
   * @param data Customer update data
   * @returns Updated customer
   */
  public async update(id: number, data: Partial<CreateCustomerData>): Promise<Customer> {
    const response = await this.client.put<{ customer: Customer }>(`/admin/customers/${id}.json`, {
      customer: data,
    });
    return response.customer;
  }

  /**
   * Delete a customer
   * @param id Customer ID
   */
  public async delete(id: number): Promise<void> {
    await this.client.delete(`/admin/customers/${id}.json`);
  }

  /**
   * Get total customer count
   * @param params Filter parameters
   * @returns Total number of customers matching filters
   */
  public async count(params?: Partial<CustomerListParams>): Promise<number> {
    const response = await this.client.get<{ count: number }>(
      '/admin/customers/count.json',
      params
    );
    return response.count;
  }

  /**
   * Search for customers
   * @param params Search parameters
   * @returns List of matching customers
   */
  public async search(params: CustomerSearchParams): Promise<Customer[]> {
    const response = await this.client.get<{ customers: Customer[] }>(
      '/admin/customers/search.json',
      params
    );
    return response.customers;
  }

  /**
   * Get a customer by email
   * @param email Customer email address
   * @returns Customer details or null if not found
   */
  public async getByEmail(email: string): Promise<Customer | null> {
    const customers = await this.list({
      email,
      limit: 1,
    });

    return customers.data[0] || null;
  }

  /**
   * Set default address for customer
   * @param customerId Customer ID
   * @param addressId Address ID
   * @returns Updated customer
   */
  public async setDefaultAddress(customerId: number, addressId: number): Promise<Customer> {
    const response = await this.client.put<{ customer: Customer }>(
      `/admin/customers/${customerId}/addresses/${addressId}/default.json`
    );
    return response.customer;
  }
}

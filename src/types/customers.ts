import { PaginationParams } from './client';
import { Address } from './orders';

/**
 * Customer information
 * @category Resources
 */
export interface Customer {
  /** Unique identifier */
  id: number;

  /** Email address */
  email: string;

  /** First name */
  first_name?: string;

  /** Last name */
  last_name?: string;

  /** Phone number */
  phone?: string;

  /** Customer's note */
  note?: string;

  /** Whether customer verified their email */
  verified_email: boolean;

  /** Customer tax exemption status */
  tax_exempt: boolean;

  /** List of addresses */
  addresses: Address[];

  /** Customer's default address */
  default_address?: Address;

  /** Creation timestamp */
  created_on: string;

  /** Last update timestamp */
  updated_on: string;

  /** Customer tags */
  tags?: string;

  /** Customer code */
  code?: string;

  /** Total number of orders */
  orders_count: number;

  /** Total spent by customer */
  total_spent: number;

  /** Customer's company */
  company?: string;

  /** Customer's birthday */
  birthday?: string;

  /** Gender (male/female/other) */
  gender?: 'male' | 'female' | 'other';
}

/**
 * Data for creating a new customer
 * @category Resources
 */
export interface CreateCustomerData {
  /** Email address */
  email: string;

  /** First name */
  first_name?: string;

  /** Last name */
  last_name?: string;

  /** Phone number */
  phone?: string;

  /** Customer's note */
  note?: string;

  /** Customer code */
  code?: string;

  /** Tags (comma-separated) */
  tags?: string;

  /** Company name */
  company?: string;

  /** Birthday (YYYY-MM-DD) */
  birthday?: string;

  /** Gender */
  gender?: 'male' | 'female' | 'other';

  /** Tax exemption status */
  tax_exempt?: boolean;

  /** Customer addresses */
  addresses?: Partial<Address>[];
}

/**
 * Parameters for listing customers
 * @category Resources
 */
export interface CustomerListParams extends PaginationParams {
  /** Search query */
  query?: string;

  /** Filter by email */
  email?: string;

  /** Filter by phone */
  phone?: string;

  /** Filter by customer code */
  code?: string;

  /** Filter by company */
  company?: string;

  /** Filter by creation date range start */
  created_on_min?: string;

  /** Filter by creation date range end */
  created_on_max?: string;

  /** Filter by update date range start */
  updated_on_min?: string;

  /** Filter by update date range end */
  updated_on_max?: string;

  /** Order results by field */
  order_by?: 'created_on' | 'updated_on' | 'orders_count' | 'total_spent';

  /** Sort order (asc/desc) */
  sort?: 'asc' | 'desc';
}

/**
 * Search customer parameters
 * @category Resources
 */
export interface CustomerSearchParams {
  /** Search query (email, phone, name, etc.) */
  query: string;

  /** Fields to search in */
  fields?: Array<'email' | 'phone' | 'name' | 'code' | 'company'>;

  /** Number of results to return */
  limit?: number;
}

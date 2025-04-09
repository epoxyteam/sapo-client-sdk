import { SapoClient } from '../client';
import { PaginatedResponse } from '../types/client';
import { NotFoundError } from '../errors';
import {
  Page,
  CreatePageData,
  PageListParams,
  PageSearchParams,
  PageAnalytics,
  PageAuthor,
} from '../types/pages';

/**
 * Pages resource handler
 * @category Resources
 */
export class Pages {
  constructor(private readonly client: SapoClient) {}

  /**
   * Get a list of pages
   * @param params Query parameters for filtering and pagination
   */
  public async list(params?: PageListParams): Promise<PaginatedResponse<Page>> {
    return this.client.get('/admin/pages.json', params);
  }

  /**
   * Get a single page by ID
   * @param id Page ID
   */
  public async get(id: number): Promise<Page> {
    const response = await this.client.get<{ page: Page }>(`/admin/pages/${id}.json`);
    return response.page;
  }

  /**
   * Create a new page
   * @param data Page creation data
   */
  public async create(data: CreatePageData): Promise<Page> {
    const response = await this.client.post<{ page: Page }>('/admin/pages.json', {
      page: data,
    });
    return response.page;
  }

  /**
   * Update an existing page
   * @param id Page ID
   * @param data Page update data
   */
  public async update(id: number, data: Partial<CreatePageData>): Promise<Page> {
    const response = await this.client.put<{ page: Page }>(`/admin/pages/${id}.json`, {
      page: data,
    });
    return response.page;
  }

  /**
   * Delete a page
   * @param id Page ID
   */
  public async delete(id: number): Promise<void> {
    await this.client.delete(`/admin/pages/${id}.json`);
  }

  /**
   * Get total page count
   * @param params Filter parameters
   */
  public async count(params?: Partial<PageListParams>): Promise<number> {
    const response = await this.client.get<{ count: number }>('/admin/pages/count.json', params);
    return response.count;
  }

  /**
   * Search pages
   * @param params Search parameters
   */
  public async search(params: PageSearchParams): Promise<Page[]> {
    const response = await this.client.get<{ pages: Page[] }>('/admin/pages/search.json', params);
    return response.pages;
  }

  /**
   * Get page by handle
   * @param handle Page handle
   */
  public async getByHandle(handle: string): Promise<Page | null> {
    try {
      const pages = await this.list({
        handle,
        limit: 1,
      });
      return pages.data[0] || null;
    } catch (error) {
      if (error instanceof NotFoundError) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Get page analytics
   * @param id Page ID
   * @param startDate Start date (YYYY-MM-DD)
   * @param endDate End date (YYYY-MM-DD)
   */
  public async getAnalytics(
    id: number,
    startDate: string,
    endDate: string
  ): Promise<PageAnalytics> {
    const response = await this.client.get<{ analytics: PageAnalytics }>(
      `/admin/pages/${id}/analytics.json`,
      { start_date: startDate, end_date: endDate }
    );
    return response.analytics;
  }

  /**
   * Get page author details
   * @param id Page ID
   */
  public async getAuthor(id: number): Promise<PageAuthor | null> {
    try {
      const response = await this.client.get<{ author: PageAuthor }>(
        `/admin/pages/${id}/author.json`
      );
      return response.author;
    } catch (error) {
      if (error instanceof NotFoundError) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Publish a page
   * @param id Page ID
   */
  public async publish(id: number): Promise<Page> {
    const response = await this.client.post<{ page: Page }>(`/admin/pages/${id}/publish.json`);
    return response.page;
  }

  /**
   * Unpublish a page
   * @param id Page ID
   */
  public async unpublish(id: number): Promise<Page> {
    const response = await this.client.post<{ page: Page }>(`/admin/pages/${id}/unpublish.json`);
    return response.page;
  }
}

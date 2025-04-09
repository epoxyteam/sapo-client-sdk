import { SapoClient } from '../client';
import { PaginatedResponse } from '../types/client';
import {
  Blog,
  Article,
  Comment,
  CreateBlogData,
  CreateArticleData,
  CreateCommentData,
  BlogListParams,
  ArticleListParams,
  CommentListParams,
} from '../types/blogs';

/**
 * Blogs resource handler
 * @category Resources
 */
export class Blogs {
  constructor(private readonly client: SapoClient) {}

  /**
   * List blogs
   * @param params Query parameters
   */
  public async list(params?: BlogListParams): Promise<PaginatedResponse<Blog>> {
    return this.client.get('/admin/blogs.json', params);
  }

  /**
   * Get a single blog
   * @param id Blog ID
   */
  public async get(id: number): Promise<Blog> {
    const response = await this.client.get<{ blog: Blog }>(`/admin/blogs/${id}.json`);
    return response.blog;
  }

  /**
   * Create a new blog
   * @param data Blog creation data
   */
  public async create(data: CreateBlogData): Promise<Blog> {
    const response = await this.client.post<{ blog: Blog }>('/admin/blogs.json', {
      blog: data,
    });
    return response.blog;
  }

  /**
   * Update a blog
   * @param id Blog ID
   * @param data Blog update data
   */
  public async update(id: number, data: Partial<CreateBlogData>): Promise<Blog> {
    const response = await this.client.put<{ blog: Blog }>(`/admin/blogs/${id}.json`, {
      blog: data,
    });
    return response.blog;
  }

  /**
   * Delete a blog
   * @param id Blog ID
   */
  public async delete(id: number): Promise<void> {
    await this.client.delete(`/admin/blogs/${id}.json`);
  }

  /**
   * List articles for a blog
   * @param blogId Blog ID
   * @param params Query parameters
   */
  public async listArticles(
    blogId: number,
    params?: ArticleListParams
  ): Promise<PaginatedResponse<Article>> {
    return this.client.get(`/admin/blogs/${blogId}/articles.json`, params);
  }

  /**
   * Get a single article
   * @param blogId Blog ID
   * @param id Article ID
   */
  public async getArticle(blogId: number, id: number): Promise<Article> {
    const response = await this.client.get<{ article: Article }>(
      `/admin/blogs/${blogId}/articles/${id}.json`
    );
    return response.article;
  }

  /**
   * Create an article
   * @param blogId Blog ID
   * @param data Article creation data
   */
  public async createArticle(blogId: number, data: CreateArticleData): Promise<Article> {
    const response = await this.client.post<{ article: Article }>(
      `/admin/blogs/${blogId}/articles.json`,
      { article: data }
    );
    return response.article;
  }

  /**
   * Update an article
   * @param blogId Blog ID
   * @param id Article ID
   * @param data Article update data
   */
  public async updateArticle(
    blogId: number,
    id: number,
    data: Partial<CreateArticleData>
  ): Promise<Article> {
    const response = await this.client.put<{ article: Article }>(
      `/admin/blogs/${blogId}/articles/${id}.json`,
      { article: data }
    );
    return response.article;
  }

  /**
   * Delete an article
   * @param blogId Blog ID
   * @param id Article ID
   */
  public async deleteArticle(blogId: number, id: number): Promise<void> {
    await this.client.delete(`/admin/blogs/${blogId}/articles/${id}.json`);
  }

  /**
   * List comments for an article
   * @param blogId Blog ID
   * @param articleId Article ID
   * @param params Query parameters
   */
  public async listComments(
    blogId: number,
    articleId: number,
    params?: CommentListParams
  ): Promise<PaginatedResponse<Comment>> {
    return this.client.get(`/admin/blogs/${blogId}/articles/${articleId}/comments.json`, params);
  }

  /**
   * Get a single comment
   * @param blogId Blog ID
   * @param articleId Article ID
   * @param id Comment ID
   */
  public async getComment(blogId: number, articleId: number, id: number): Promise<Comment> {
    const response = await this.client.get<{ comment: Comment }>(
      `/admin/blogs/${blogId}/articles/${articleId}/comments/${id}.json`
    );
    return response.comment;
  }

  /**
   * Create a comment
   * @param blogId Blog ID
   * @param articleId Article ID
   * @param data Comment creation data
   */
  public async createComment(
    blogId: number,
    articleId: number,
    data: CreateCommentData
  ): Promise<Comment> {
    const response = await this.client.post<{ comment: Comment }>(
      `/admin/blogs/${blogId}/articles/${articleId}/comments.json`,
      { comment: data }
    );
    return response.comment;
  }

  /**
   * Update a comment
   * @param blogId Blog ID
   * @param articleId Article ID
   * @param id Comment ID
   * @param data Comment update data
   */
  public async updateComment(
    blogId: number,
    articleId: number,
    id: number,
    data: Partial<CreateCommentData>
  ): Promise<Comment> {
    const response = await this.client.put<{ comment: Comment }>(
      `/admin/blogs/${blogId}/articles/${articleId}/comments/${id}.json`,
      { comment: data }
    );
    return response.comment;
  }

  /**
   * Delete a comment
   * @param blogId Blog ID
   * @param articleId Article ID
   * @param id Comment ID
   */
  public async deleteComment(blogId: number, articleId: number, id: number): Promise<void> {
    await this.client.delete(`/admin/blogs/${blogId}/articles/${articleId}/comments/${id}.json`);
  }

  /**
   * Get comment count for an article
   * @param blogId Blog ID
   * @param articleId Article ID
   * @param params Filter parameters
   */
  public async getCommentCount(
    blogId: number,
    articleId: number,
    params?: Partial<CommentListParams>
  ): Promise<number> {
    const response = await this.client.get<{ count: number }>(
      `/admin/blogs/${blogId}/articles/${articleId}/comments/count.json`,
      params
    );
    return response.count;
  }

  /**
   * Spam check a comment
   * @param blogId Blog ID
   * @param articleId Article ID
   * @param id Comment ID
   */
  public async spamCheck(
    blogId: number,
    articleId: number,
    id: number
  ): Promise<{ spam: boolean; score: number }> {
    const response = await this.client.get<{ spam_check: { spam: boolean; score: number } }>(
      `/admin/blogs/${blogId}/articles/${articleId}/comments/${id}/spam_check.json`
    );
    return response.spam_check;
  }
}

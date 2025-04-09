import { PaginationParams } from './client';

/**
 * Blog information
 * @category Resources
 */
export interface Blog {
  /** Unique identifier */
  id: number;

  /** Blog title */
  title: string;

  /** URL handle for the blog */
  handle: string;

  /** Comments setting */
  comments_enabled: boolean;

  /** Default article template */
  template_suffix?: string;

  /** Feed URL */
  feedburner_url?: string;

  /** Whether blog allows guests to comment */
  moderated: boolean;

  /** Tags list */
  tags?: string[];

  /** Creation timestamp */
  created_on: string;

  /** Last update timestamp */
  updated_on: string;
}

/**
 * Article information
 * @category Resources
 */
export interface Article {
  /** Unique identifier */
  id: number;

  /** Article title */
  title: string;

  /** Blog ID */
  blog_id: number;

  /** Article author */
  author: string;

  /** Article content in HTML */
  body_html: string;

  /** Article summary in HTML */
  summary_html?: string;

  /** URL handle */
  handle: string;

  /** Comma-separated tags */
  tags: string;

  /** Whether comments are enabled */
  comments_enabled: boolean;

  /** Template suffix */
  template_suffix?: string;

  /** Whether article is published */
  published: boolean;

  /** Publication timestamp */
  published_on?: string;

  /** Creation timestamp */
  created_on: string;

  /** Last update timestamp */
  updated_on: string;

  /** Comment count */
  comments_count: number;
}

/**
 * Comment information
 * @category Resources
 */
export interface Comment {
  /** Unique identifier */
  id: number;

  /** Article ID */
  article_id: number;

  /** Blog ID */
  blog_id: number;

  /** Comment author */
  author: string;

  /** Author email */
  email: string;

  /** Comment content */
  body: string;

  /** Whether comment is published */
  published: boolean;

  /** Creation timestamp */
  created_on: string;

  /** Last update timestamp */
  updated_on: string;

  /** IP address of commenter */
  ip?: string;

  /** Author's URL */
  website?: string;

  /** User agent string */
  user_agent?: string;
}

/**
 * Data for creating a blog
 * @category Resources
 */
export interface CreateBlogData {
  /** Blog title */
  title: string;

  /** Comments setting */
  comments_enabled?: boolean;

  /** Template suffix */
  template_suffix?: string;

  /** Feedburner URL */
  feedburner_url?: string;

  /** Moderation setting */
  moderated?: boolean;

  /** Tags list */
  tags?: string[];
}

/**
 * Data for creating an article
 * @category Resources
 */
export interface CreateArticleData {
  /** Article title */
  title: string;

  /** Article author */
  author: string;

  /** Article content in HTML */
  body_html: string;

  /** Article summary in HTML */
  summary_html?: string;

  /** Template suffix */
  template_suffix?: string;

  /** Whether comments are enabled */
  comments_enabled?: boolean;

  /** Tags (comma-separated) */
  tags?: string;

  /** Whether to publish immediately */
  published?: boolean;

  /** Publication timestamp */
  published_on?: string;
}

/**
 * Data for creating a comment
 * @category Resources
 */
export interface CreateCommentData {
  /** Comment author */
  author: string;

  /** Author email */
  email: string;

  /** Comment content */
  body: string;

  /** Author's URL */
  website?: string;

  /** Whether to publish immediately */
  published?: boolean;
}

/**
 * Parameters for listing blogs
 * @category Resources
 */
export interface BlogListParams extends PaginationParams {
  /** Filter by handle */
  handle?: string;

  /** Filter by creation date range start */
  created_on_min?: string;

  /** Filter by creation date range end */
  created_on_max?: string;

  /** Filter by update date range start */
  updated_on_min?: string;

  /** Filter by update date range end */
  updated_on_max?: string;

  /** Fields to include in response */
  fields?: string[];
}

/**
 * Parameters for listing articles
 * @category Resources
 */
export interface ArticleListParams extends PaginationParams {
  /** Filter by handle */
  handle?: string;

  /** Filter by author */
  author?: string;

  /** Filter by tags */
  tag?: string;

  /** Filter by publication status */
  published?: boolean;

  /** Filter by creation date range start */
  created_on_min?: string;

  /** Filter by creation date range end */
  created_on_max?: string;

  /** Filter by update date range start */
  updated_on_min?: string;

  /** Filter by update date range end */
  updated_on_max?: string;

  /** Filter by publish date range start */
  published_on_min?: string;

  /** Filter by publish date range end */
  published_on_max?: string;

  /** Fields to include in response */
  fields?: string[];
}

/**
 * Parameters for listing comments
 * @category Resources
 */
export interface CommentListParams extends PaginationParams {
  /** Filter by publication status */
  published?: boolean;

  /** Filter by creation date range start */
  created_on_min?: string;

  /** Filter by creation date range end */
  created_on_max?: string;

  /** Filter by update date range start */
  updated_on_min?: string;

  /** Filter by update date range end */
  updated_on_max?: string;

  /** Fields to include in response */
  fields?: string[];
}

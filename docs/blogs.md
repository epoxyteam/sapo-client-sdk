# Blogs & Articles

The `blogs` resource provides methods for managing blogs, articles, and comments through the Sapo API.

## Access

```typescript
const blogs = client.blogs;
```

---

## Blogs

### `list(params?)`

List all blogs.

```typescript
const blogs = await client.blogs.list({ limit: 10 });
```

### `get(id)`

Get a single blog by ID.

```typescript
const blog = await client.blogs.get(123);
```

### `create(data)`

Create a new blog.

```typescript
const blog = await client.blogs.create({
  title: 'Company News',
  comments_enabled: true,
  moderated: true,
  tags: ['news', 'updates'],
});
```

### `update(id, data)`

Update an existing blog.

```typescript
const blog = await client.blogs.update(123, { title: 'Updated Title' });
```

### `delete(id)`

Delete a blog.

```typescript
await client.blogs.delete(123);
```

---

## Articles

### `listArticles(blogId, params?)`

List articles for a blog.

```typescript
const articles = await client.blogs.listArticles(123, {
  published: true,
  limit: 10,
});
```

### `getArticle(blogId, id)`

Get a single article.

```typescript
const article = await client.blogs.getArticle(123, 456);
```

### `countArticles(blogId, params?)`

Get the total number of articles in a blog. Accepts optional filter parameters.

```typescript
// Count all articles
const total = await client.blogs.countArticles(123);

// Count only published articles
const published = await client.blogs.countArticles(123, { published: true });
```

### `createArticle(blogId, data)`

Create a new article.

```typescript
const article = await client.blogs.createArticle(123, {
  title: 'Hello World',
  author: 'Jane Doe',
  body_html: '<p>My first post.</p>',
  published: true,
  tags: 'news, announcement',
});
```

### `updateArticle(blogId, id, data)`

Update an existing article.

```typescript
const article = await client.blogs.updateArticle(123, 456, {
  title: 'Updated Title',
});
```

### `deleteArticle(blogId, id)`

Delete an article.

```typescript
await client.blogs.deleteArticle(123, 456);
```

### `getAuthors()`

Get a list of all article authors across all blogs.

```typescript
const authors = await client.blogs.getAuthors();
// ['Jane Doe', 'John Smith', ...]
```

### `getArticleTags(blogId, params?)`

Get all tags used in articles for a given blog.

```typescript
// Get all tags
const tags = await client.blogs.getArticleTags(123);

// Get the top 5 most popular tags
const popularTags = await client.blogs.getArticleTags(123, { popular: 1, limit: 5 });
```

---

## Comments

### `listComments(blogId, articleId, params?)`

List comments for an article.

```typescript
const comments = await client.blogs.listComments(123, 456, { published: true });
```

### `getComment(blogId, articleId, id)`

Get a single comment.

```typescript
const comment = await client.blogs.getComment(123, 456, 789);
```

### `getCommentCount(blogId, articleId, params?)`

Get the total number of comments for an article.

```typescript
const count = await client.blogs.getCommentCount(123, 456);
```

### `createComment(blogId, articleId, data)`

Create a new comment.

```typescript
const comment = await client.blogs.createComment(123, 456, {
  author: 'Reader',
  email: 'reader@example.com',
  body: 'Great post!',
});
```

### `updateComment(blogId, articleId, id, data)`

Update an existing comment.

```typescript
const comment = await client.blogs.updateComment(123, 456, 789, {
  body: 'Updated comment text',
});
```

### `deleteComment(blogId, articleId, id)`

Delete a comment.

```typescript
await client.blogs.deleteComment(123, 456, 789);
```

### `spamCheck(blogId, articleId, id)`

Check whether a comment is spam.

```typescript
const result = await client.blogs.spamCheck(123, 456, 789);
console.log(result.spam, result.score);
```

import { SapoClient } from '../src';
import { OAuthConfig, Scope } from '../src/types/auth';
import { CreateBlogData, CreateArticleData, CreateCommentData } from '../src/types/blogs';

async function main() {
  // Initialize with OAuth configuration
  const config: OAuthConfig = {
    type: 'oauth',
    store: 'your-store.mysapo.net',
    apiKey: 'your-api-key',
    secretKey: 'your-secret-key',
    redirectUri: 'https://your-app.com/oauth/callback',
  };

  const client = new SapoClient(config);

  // Define required scopes
  const scopes: Scope[] = ['read_content', 'write_content'];

  try {
    // Complete OAuth flow
    const authUrl = client.getAuthorizationUrl('your-store.mysapo.net', scopes);
    console.log('1. Direct user to:', authUrl);
    const accessToken = await client.completeOAuth('your-store.mysapo.net', 'callback-code-here');
    console.log('2. Got access token:', accessToken);
    client.setAccessToken(accessToken);

    console.log('\n=== Creating Blog ===');
    const blogData: CreateBlogData = {
      title: 'Company News',
      comments_enabled: true,
      moderated: true,
      template_suffix: 'blog-template',
      tags: ['news', 'company', 'updates'],
    };
    const newBlog = await client.blogs.create(blogData);
    console.log('Created blog:', newBlog);

    console.log('\n=== Creating Article ===');
    const articleData: CreateArticleData = {
      title: 'Welcome to Our Blog',
      author: 'John Doe',
      body_html: `
        <h1>Welcome to Our Company Blog</h1>
        <p>We're excited to launch our new blog where we'll share:</p>
        <ul>
          <li>Weekly updates</li>
          <li>Product announcements</li>
          <li>Industry news</li>
          <li>Tips and tutorials</li>
        </ul>
      `,
      published: true,
      tags: 'welcome, announcement',
    };

    const article = await client.blogs.createArticle(newBlog.id, articleData);
    console.log('Created article:', article);

    console.log('\n=== Adding Comment ===');
    const commentData: CreateCommentData = {
      author: 'Jane Smith',
      email: 'jane@example.com',
      body: 'Great first post! Looking forward to more content.',
      website: 'https://example.com',
      published: true,
    };
    const comment = await client.blogs.createComment(newBlog.id, article.id, commentData);
    console.log('Added comment:', comment);

    // Check comment for spam
    console.log('\n=== Spam Check ===');
    const spamCheck = await client.blogs.spamCheck(newBlog.id, article.id, comment.id);
    console.log('Spam check result:', spamCheck);

    // List comments
    console.log('\n=== Article Comments ===');
    const comments = await client.blogs.listComments(newBlog.id, article.id, {
      published: true,
      limit: 10,
    });
    console.log('Comments:', comments);

    // Get comment count
    const commentCount = await client.blogs.getCommentCount(newBlog.id, article.id);
    console.log('Total comments:', commentCount);

    // Update article
    console.log('\n=== Updating Article ===');
    const updatedArticle = await client.blogs.updateArticle(newBlog.id, article.id, {
      body_html:
        article.body_html +
        `
        <h2>Stay Connected</h2>
        <p>Follow us on social media to stay up to date with our latest posts.</p>
      `,
      tags: article.tags + ', update',
    });
    console.log('Updated article:', updatedArticle);

    // List all articles
    console.log('\n=== Listing Articles ===');
    const articles = await client.blogs.listArticles(newBlog.id, {
      published: true,
      limit: 10,
    });
    console.log('Articles:', articles);

    // Clean up
    console.log('\n=== Cleanup ===');

    // Delete comment
    await client.blogs.deleteComment(newBlog.id, article.id, comment.id);
    console.log('Deleted comment');

    // Delete article
    await client.blogs.deleteArticle(newBlog.id, article.id);
    console.log('Deleted article');

    // Delete blog
    await client.blogs.delete(newBlog.id);
    console.log('Deleted blog');

    // Check rate limits
    const { remaining, limit, reset } = client.getRateLimits();
    console.log('\nRate Limits:', {
      remaining,
      limit,
      resetAt: new Date(reset * 1000).toLocaleString(),
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the example
main().catch(console.error);

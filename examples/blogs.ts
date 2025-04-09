import { SapoClient } from '../src';

async function main() {
  // Initialize the SDK
  const client = new SapoClient({
    apiKey: 'your-api-key',
    secretKey: 'your-secret-key',
    redirectUri: 'https://your-app.com/oauth/callback',
  });

  try {
    // Set access token (after OAuth flow)
    client.setAccessToken('your-access-token');
    client.setStore('your-store.mysapo.net');

    // Create a new blog
    console.log('\n=== Creating Blog ===');
    const newBlog = await client.blogs.create({
      title: 'Company News',
      comments_enabled: true,
      moderated: true,
      tags: ['news', 'company', 'updates'],
    });
    console.log('Created blog:', newBlog);

    // Create an article
    console.log('\n=== Creating Article ===');
    const article = await client.blogs.createArticle(newBlog.id, {
      title: 'Welcome to Our Blog',
      author: 'John Doe',
      body_html: `
        <h1>Welcome to Our Company Blog</h1>
        <p>We're excited to launch our new blog where we'll share company updates,
        industry insights, and helpful tips for our customers.</p>
        <h2>What to Expect</h2>
        <ul>
          <li>Weekly updates</li>
          <li>Product announcements</li>
          <li>Industry news</li>
          <li>Tips and tutorials</li>
        </ul>
      `,
      published: true,
      tags: 'welcome, announcement',
    });
    console.log('Created article:', article);

    // Add a comment
    console.log('\n=== Adding Comment ===');
    const comment = await client.blogs.createComment(newBlog.id, article.id, {
      author: 'Jane Smith',
      email: 'jane@example.com',
      body: 'Great first post! Looking forward to more content.',
      website: 'https://example.com',
    });
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
    const limits = client.getRateLimits();
    console.log('\nRate limits:', limits);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the example
main().catch(console.error);

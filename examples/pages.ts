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

    // Create a new page
    console.log('\n=== Creating Page ===');
    const newPage = await client.pages.create({
      title: 'About Us',
      body_html: `
        <h1>Welcome to Our Store</h1>
        <p>We are committed to providing the best service and products.</p>
        <ul>
          <li>Quality Products</li>
          <li>Excellent Service</li>
          <li>Fast Shipping</li>
        </ul>
      `,
      author: 'John Doe',
      template_suffix: 'custom',
      published: true,
    });
    console.log('Created page:', newPage);

    // Get page by handle
    console.log('\n=== Getting Page by Handle ===');
    const pageByHandle = await client.pages.getByHandle('about-us');
    console.log('Found page:', pageByHandle);

    // Update page content
    console.log('\n=== Updating Page ===');
    const updatedPage = await client.pages.update(newPage.id, {
      body_html: `
        <h1>Welcome to Our Store</h1>
        <p>We are committed to providing the best service and products.</p>
        <ul>
          <li>Premium Quality Products</li>
          <li>Outstanding Customer Service</li>
          <li>Express Shipping Options</li>
          <li>24/7 Support</li>
        </ul>
        <p>Contact us today to learn more!</p>
      `,
    });
    console.log('Updated page:', updatedPage);

    // Get page analytics
    console.log('\n=== Page Analytics ===');
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const analytics = await client.pages.getAnalytics(
      newPage.id,
      lastMonth.toISOString().split('T')[0],
      today.toISOString().split('T')[0]
    );
    console.log('Page analytics:', analytics);

    // Get page author
    console.log('\n=== Page Author ===');
    const author = await client.pages.getAuthor(newPage.id);
    console.log('Page author:', author);

    // Unpublish the page
    console.log('\n=== Unpublishing Page ===');
    const unpublishedPage = await client.pages.unpublish(newPage.id);
    console.log('Unpublished page:', unpublishedPage);

    // Search pages
    console.log('\n=== Searching Pages ===');
    const searchResults = await client.pages.search({
      query: 'About Us',
      fields: ['title', 'body_html'],
    });
    console.log('Search results:', searchResults);

    // List all pages with filters
    console.log('\n=== Listing Pages ===');
    const pages = await client.pages.list({
      limit: 10,
      published: false,
      updated_on_min: lastMonth.toISOString(),
    });
    console.log('Pages:', pages);

    // Get page count
    const count = await client.pages.count();
    console.log('\nTotal pages:', count);

    // Delete the test page
    console.log('\n=== Cleaning Up ===');
    await client.pages.delete(newPage.id);
    console.log('Deleted page');

    // Check rate limits
    const limits = client.getRateLimits();
    console.log('\nRate limits:', limits);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the example
main().catch(console.error);

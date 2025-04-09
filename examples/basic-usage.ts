import { SapoClient } from '../src';

async function main() {
  // Initialize the SDK
  const client = new SapoClient({
    apiKey: 'your-api-key',
    secretKey: 'your-secret-key',
    redirectUri: 'https://your-app.com/oauth/callback',
  });

  try {
    // Get OAuth authorization URL
    const authUrl = client.getAuthorizationUrl('your-store.mysapo.net', [
      'read_products',
      'write_products',
      'read_orders',
      'write_orders',
      'read_customers',
      'write_customers',
      'read_collections',
      'write_collections',
    ]);
    console.log('Auth URL:', authUrl);

    // After OAuth callback
    const accessToken = await client.completeOAuth(
      'your-store.mysapo.net',
      'callback-url-with-code'
    );
    client.setAccessToken(accessToken);

    // Working with Customers
    console.log('\n=== Customers ===');

    // Create a customer
    const newCustomer = await client.customers.create({
      email: 'john.doe@example.com',
      first_name: 'John',
      last_name: 'Doe',
      phone: '1234567890',
    });
    console.log('Created customer:', newCustomer);

    // Working with Products
    console.log('\n=== Products ===');

    // Create a product
    const newProduct = await client.products.create({
      name: 'Test Product',
      content: 'Product description',
      vendor: 'Test Vendor',
      variants: [
        {
          price: 99.99,
          inventory_quantity: 10,
          sku: 'TEST001',
        },
      ],
    });
    console.log('Created product:', newProduct);

    // Working with Collections
    console.log('\n=== Collections ===');

    // Create a custom collection
    const newCollection = await client.collections.createCustomCollection({
      title: 'New Arrivals',
      body_html: '<p>Our latest products</p>',
      published: true,
      sort_order: 'created-desc',
    });
    console.log('Created collection:', newCollection);

    // Add product to collection
    await client.collections.addProduct(newCollection.id, newProduct.id);
    console.log('Added product to collection');

    // Create a smart collection
    const smartCollection = await client.collections.createSmartCollection({
      title: 'Premium Products',
      body_html: '<p>Products over $50</p>',
      published: true,
      rules: [
        {
          column: 'variant_price',
          relation: 'greater_than',
          condition: '50.00',
        },
      ],
    });
    console.log('Created smart collection:', smartCollection);

    // Working with Orders
    console.log('\n=== Orders ===');

    // Create an order
    const newOrder = await client.orders.create({
      line_items: [
        {
          variant_id: newProduct.variants[0].id,
          quantity: 1,
        },
      ],
      customer: {
        id: newCustomer.id,
        email: newCustomer.email,
      },
    });
    console.log('Created order:', newOrder);

    // Get resource counts
    const counts = await Promise.all([
      client.customers.count(),
      client.products.count(),
      client.collections.count(),
      client.orders.count(),
    ]);

    console.log('\n=== Statistics ===');
    console.log('Total customers:', counts[0]);
    console.log('Total products:', counts[1]);
    console.log('Total collections:', counts[2]);
    console.log('Total orders:', counts[3]);

    // Check rate limits
    const limits = client.getRateLimits();
    console.log('\nRate limits:', limits);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the example
main().catch(console.error);

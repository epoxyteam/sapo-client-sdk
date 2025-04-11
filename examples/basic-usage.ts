import { SapoClient } from '../src';
import { AuthorizeOptions, PrivateAppConfig, Scope } from '../src/types/auth';
import { CreateCustomerData } from '../src/types/customers';
import { CreateProductData } from '../src/types/products';
import { CreateOrderData } from '../src/types/orders';
import { CollectionSortOrder, SmartCollectionRule } from '../src/types/collections';

/**
 * Example showing basic usage of the Sapo Client SDK
 * Demonstrates OAuth flow and basic CRUD operations
 */
async function main() {
  // Initialize with OAuth configuration
  const config: PrivateAppConfig = {
    type: 'private',
    store: 'your-store.mysapo.net',
    apiKey: 'your-api-key',
    apiSecret: 'your-secret-key',
  };

  const client = new SapoClient(config);

  // Define scopes needed for the app
  const scopes: Scope[] = [
    'read_products',
    'write_products',
    'read_customers',
    'write_customers',
    'read_orders',
    'write_orders',
    'read_collections',
    'write_collections',
  ];

  try {
    // Step 1: Get the OAuth authorization URL
    const authOptions: AuthorizeOptions = {
      store: 'your-store.mysapo.net',
      scopes,
    };
    const authUrl = client.getAuthorizationUrl(authOptions.store, authOptions.scopes);
    console.log('1. Direct user to auth URL:', authUrl);

    // Step 2: Exchange OAuth code for access token
    // In a real app, this would be in your OAuth callback route
    const accessToken = await client.completeOAuth('your-store.mysapo.net', 'callback-code-here');
    console.log('2. Got access token:', accessToken);

    // Step 3: Set the access token for future requests
    client.setAccessToken(accessToken);

    // Create a customer
    console.log('\n=== Customers ===');
    const customerData: CreateCustomerData = {
      email: 'john.doe@example.com',
      first_name: 'John',
      last_name: 'Doe',
      phone: '+84 123 456 789',
      addresses: [
        {
          first_name: 'John',
          last_name: 'Doe',
          address1: '123 Main St',
          city: 'Ho Chi Minh City',
          country: 'Vietnam',
          province: 'Ho Chi Minh',
          zip: '70000',
          phone: '+84 123 456 789',
        },
      ],
    };
    const newCustomer = await client.customers.create(customerData);
    console.log('Created customer:', newCustomer);

    // Working with Products
    console.log('\n=== Products ===');

    // Create a product

    const productData: CreateProductData = {
      name: 'Vietnamese Coffee',
      content: 'Premium Vietnamese robusta coffee beans',
      vendor: 'Vietnam Coffee Co.',
      product_type: 'Coffee',
      variants: [
        {
          sku: 'VN-COFFEE-001',
          barcode: '893248329',
          inventory_quantity: 100,
          inventory_management: 'sapo',
          weight: 250,
          weight_unit: 'g',
          requires_shipping: true,
          price: 150000,
        },
      ],
      options: [
        {
          name: 'Size',
          values: ['250g', '500g', '1kg'],
        },
      ],
    };
    const newProduct = await client.products.create(productData);
    console.log('Created product:', newProduct);

    // Create a collection
    console.log('\n=== Collections ===');
    const newCollection = await client.collections.createCustomCollection({
      title: 'Premium Coffee',
      body_html: '<p>Our selection of premium Vietnamese coffee</p>',
      published: true,
      sort_order: 'price-desc' as CollectionSortOrder,
      image: {
        src: 'https://example.com/coffee-collection.jpg',
        alt: 'Premium Coffee Collection',
      },
    });
    console.log('Created collection:', newCollection);

    // Add product to collection
    await client.collections.addProduct(newCollection.id, newProduct.id);
    console.log('Added product to collection');

    // Create a smart collection
    const smartCollection = await client.collections.createSmartCollection({
      title: 'Premium Coffee Beans',
      body_html: '<p>Premium coffee beans over 200,000 VND</p>',
      published: true,
      disjunctive: true,
      rules: [
        {
          column: 'variant_price',
          relation: 'greater_than',
          condition: '200000',
        } as SmartCollectionRule,
        {
          column: 'product_type',
          relation: 'equals',
          condition: 'Coffee',
        } as SmartCollectionRule,
      ],
    });
    console.log('Created smart collection:', smartCollection);

    // Working with Orders
    console.log('\n=== Orders ===');

    // Create an order
    const orderData: CreateOrderData = {
      line_items: [
        {
          variant_id: newProduct.variants[0].id,
          quantity: 2,
        },
      ],
      customer: {
        id: newCustomer.id,
        email: newCustomer.email,
      },
      shipping_address: {
        first_name: newCustomer.first_name,
        last_name: newCustomer.last_name,
        address1: '123 Main St',
        city: 'Ho Chi Minh City',
        country: 'Vietnam',
        zip: '70000',
        phone: '+84 123 456 789',
      },
    };
    const newOrder = await client.orders.create(orderData);
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

    // Get and display rate limits
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

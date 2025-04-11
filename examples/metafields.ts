import { SapoClient } from '../src';
import { OAuthConfig } from '../src/types/auth';

async function main() {
  // Initialize the SDK
  const config: OAuthConfig = {
    type: 'oauth',
    store: 'your-store.mysapo.net',
    apiKey: 'your-api-key',
    secretKey: 'your-secret-key',
    redirectUri: 'https://your-app.com/oauth/callback',
  };

  const client = new SapoClient(config);

  try {
    // Set access token (after OAuth flow)
    client.setAccessToken('your-access-token');
    client.setStore('your-store.mysapo.net');

    // First, create a test product to add metafields to
    console.log('\n=== Creating Test Product ===');
    const product = await client.products.create({
      name: 'Test Product',
      content: 'Product description',
    });
    console.log('Created product:', product.id);

    // Add metafields to the product
    console.log('\n=== Adding Product Metafields ===');

    // Add warranty information
    const warrantyField = await client.metafields.create(
      {
        owner_type: 'product',
        owner_id: product.id,
      },
      {
        namespace: 'warranty',
        key: 'duration',
        value: '24',
        value_type: 'integer',
        description: 'Warranty duration in months',
      }
    );
    console.log('Added warranty metafield:', warrantyField);

    // Add shipping dimensions
    const dimensionsField = await client.metafields.create(
      {
        owner_type: 'product',
        owner_id: product.id,
      },
      {
        namespace: 'shipping',
        key: 'dimensions',
        value: JSON.stringify({ length: 10, width: 5, height: 3 }),
        value_type: 'json',
        description: 'Product dimensions in cm',
      }
    );
    console.log('Added dimensions metafield:', dimensionsField);

    // List all metafields for the product
    console.log('\n=== Product Metafields ===');
    const productMetafields = await client.metafields.list({
      owner_type: 'product',
      owner_id: product.id,
    });
    console.log('All product metafields:', productMetafields);

    // Update a metafield
    console.log('\n=== Updating Metafield ===');
    const updatedWarranty = await client.metafields.update(
      {
        owner_type: 'product',
        owner_id: product.id,
      },
      warrantyField.id,
      {
        value: '36', // Extend warranty to 36 months
      }
    );
    console.log('Updated warranty:', updatedWarranty);

    // Add metafields to a customer
    console.log('\n=== Creating Customer Metafields ===');
    const customer = await client.customers.create({
      email: 'test@example.com',
      first_name: 'John',
      last_name: 'Doe',
    });

    // Add customer preferences
    const prefsField = await client.metafields.create(
      {
        owner_type: 'customer',
        owner_id: customer.id,
      },
      {
        namespace: 'preferences',
        key: 'communication',
        value: JSON.stringify({
          email: true,
          sms: false,
          post: true,
        }),
        value_type: 'json',
        description: 'Customer communication preferences',
      }
    );
    console.log('Added preferences metafield:', prefsField);

    // Demonstrate value validation
    console.log('\n=== Validating Metafield Values ===');
    try {
      client.metafields.validateValue({
        value: 'invalid-json',
        value_type: 'json',
      });
    } catch (error) {
      console.log('Validation error:', error.message);
    }

    try {
      client.metafields.validateValue({
        value: '50',
        value_type: 'integer',
        rules: {
          min: 0,
          max: 100,
        },
      });
      console.log('Value validation passed');
    } catch (error) {
      console.log('Validation error:', error.message);
    }

    // Bulk delete metafields
    console.log('\n=== Bulk Delete Metafields ===');
    const deleteResult = await client.metafields.bulkDelete(
      {
        owner_type: 'product',
        owner_id: product.id,
      },
      {
        namespace: 'shipping',
      }
    );
    console.log('Bulk delete result:', deleteResult);

    // Get metafield counts
    const productMetafieldCount = await client.metafields.count({
      owner_type: 'product',
      owner_id: product.id,
    });
    const customerMetafieldCount = await client.metafields.count({
      owner_type: 'customer',
      owner_id: customer.id,
    });

    console.log('\n=== Metafield Counts ===');
    console.log('Product metafields:', productMetafieldCount);
    console.log('Customer metafields:', customerMetafieldCount);

    // Check rate limits
    const limits = client.getRateLimits();
    console.log('\nRate limits:', limits);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the example
main().catch(console.error);

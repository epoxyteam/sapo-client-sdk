import { SapoClient } from '../src';

console.log('Testing Private App Authentication...\n');

const client = new SapoClient({
  type: 'private',
  store: 'your-store.mysapo.net',
  apiKey: 'your-api-key',
  apiSecret: 'your-secret-key',
});

async function testProductCount() {
  try {
    // Simple test using product count endpoint
    console.log('Fetching product count...');
    const response = await client.get('admin/orders.json');
    console.log('Success!');
    console.log('Product count:', response);
  } catch (error: any) {
    console.error('Error:', {
      message: error.message,
      status: error.status,
      code: error.code,
      data: error.errors,
    });
  }
}

// Run test
testProductCount();

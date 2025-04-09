import { SapoClient, WebhookTopic } from '../src';
import * as crypto from 'crypto';

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

    // Create a new webhook for order creation
    console.log('\n=== Creating Webhook ===');
    const webhook = await client.webhooks.create({
      topic: 'orders/create',
      address: 'https://your-app.com/webhooks/orders',
      format: 'json',
      fields: ['id', 'total_price', 'customer'],
      metafield_namespaces: ['custom'],
    });
    console.log('Created webhook:', webhook);

    // Create webhooks for multiple events
    console.log('\n=== Creating Multiple Webhooks ===');
    const topics: WebhookTopic[] = ['products/create', 'products/update', 'products/delete'];

    const webhookPromises = topics.map((topic) =>
      client.webhooks.create({
        topic,
        address: `https://your-app.com/webhooks/products/${topic.split('/')[1]}`,
        format: 'json',
      })
    );

    const productWebhooks = await Promise.all(webhookPromises);
    console.log('Created product webhooks:', productWebhooks);

    // List all webhooks
    console.log('\n=== Listing Webhooks ===');
    const webhooks = await client.webhooks.list({
      limit: 10,
    });
    console.log('Active webhooks:', webhooks);

    // Get webhook count
    const count = await client.webhooks.count();
    console.log('\nTotal webhooks:', count);

    // Test webhook delivery
    console.log('\n=== Testing Webhook ===');
    await client.webhooks.test(webhook.id);
    console.log('Sent test delivery');

    // List recent deliveries
    console.log('\n=== Recent Deliveries ===');
    const deliveries = await client.webhooks.listDeliveries(webhook.id, {
      limit: 5,
    });
    console.log('Recent deliveries:', deliveries);

    // Example of verifying a webhook payload
    console.log('\n=== Webhook Verification Example ===');
    const mockPayload = JSON.stringify({
      order_id: 123456,
      total_price: 99.99,
    });

    // Generate a test HMAC signature (this would normally come from Sapo)
    const hmac = crypto
      .createHmac('sha256', client['config'].secretKey)
      .update(mockPayload)
      .digest('base64');

    // Verify the signature
    const isValid = client.webhooks.verifySignature(hmac, mockPayload);
    console.log('Webhook signature valid:', isValid);

    // Demonstrate error handling
    console.log('\n=== Error Handling ===');
    try {
      const deliveryDetails = await client.webhooks.getDelivery(webhook.id, 99999);
      console.log('Delivery details:', deliveryDetails);
    } catch (error) {
      console.log('Error getting non-existent delivery:', error.message);
    }

    // Update webhook configuration
    console.log('\n=== Updating Webhook ===');
    const updatedWebhook = await client.webhooks.update(webhook.id, {
      fields: ['id', 'total_price', 'customer', 'shipping_address'],
    });
    console.log('Updated webhook:', updatedWebhook);

    // Clean up
    console.log('\n=== Cleanup ===');
    await Promise.all(
      [webhook.id, ...productWebhooks.map((w) => w.id)].map((id) => client.webhooks.delete(id))
    );
    console.log('Deleted all test webhooks');

    // Check rate limits
    const limits = client.getRateLimits();
    console.log('\nRate limits:', limits);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Example webhook handler (Express.js style)
function handleWebhook(req: any, res: any) {
  const client = new SapoClient({
    apiKey: 'your-api-key',
    secretKey: 'your-secret-key',
    redirectUri: 'https://your-app.com/oauth/callback',
  });

  const hmac = req.headers['x-sapo-hmac-sha256'];
  const body = JSON.stringify(req.body);

  // Verify webhook signature
  if (!client.webhooks.verifySignature(hmac, body)) {
    res.status(401).send('Invalid signature');
    return;
  }

  // Process webhook based on topic
  const topic = req.headers['x-sapo-topic'] as WebhookTopic;
  switch (topic) {
    case 'orders/create':
      // Handle new order
      console.log('New order received:', req.body);
      break;

    case 'products/update':
      // Handle product update
      console.log('Product updated:', req.body);
      break;

    default:
      console.log(`Unhandled webhook topic: ${topic}`);
  }

  res.status(200).send('OK');
}

// Run the example
main().catch(console.error);

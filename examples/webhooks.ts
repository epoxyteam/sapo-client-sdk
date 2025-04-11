import { SapoClient } from '../src';
import { OAuthConfig, Scope } from '../src/types/auth';
import { CreateWebhookData, WebhookTopic } from '../src/types/webhooks';
import * as crypto from 'crypto';

/**
 * Type definitions for webhook handlers
 */
interface WebhookRequest {
  headers: Record<string, string>;
  body: unknown;
}

interface WebhookResponse {
  status: (code: number) => { send: (message: string) => void };
}

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
  const scopes: Scope[] = ['read_products', 'write_products'];

  try {
    // Complete OAuth flow
    const authUrl = client.getAuthorizationUrl('your-store.mysapo.net', scopes);
    console.log('1. Direct user to auth URL:', authUrl);

    const accessToken = await client.completeOAuth('your-store.mysapo.net', 'callback-code-here');
    console.log('2. Got access token:', accessToken);
    client.setAccessToken(accessToken);

    // Create a new webhook for order creation
    console.log('\n=== Creating Webhook ===');
    const webhookData: CreateWebhookData = {
      topic: 'orders/create',
      address: 'https://your-app.com/webhooks/orders',
      format: 'json',
      fields: ['id', 'total_price', 'customer'],
      metafield_namespaces: ['custom'],
    };

    const webhook = await client.webhooks.create(webhookData);
    console.log('Created webhook:', webhook);

    // Create webhooks for multiple events
    console.log('\n=== Creating Multiple Webhooks ===');
    const topics: WebhookTopic[] = ['products/create', 'products/update', 'products/delete'];

    const webhookPromises = topics.map((topic) => {
      const data: CreateWebhookData = {
        topic,
        address: `https://your-app.com/webhooks/products/${topic.split('/')[1]}`,
        format: 'json',
      };
      return client.webhooks.create(data);
    });

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
    const hmac = crypto.createHmac('sha256', config.secretKey).update(mockPayload).digest('base64');

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

/**
 * Example webhook handler for Express.js
 * @export
 */
export function handleWebhook(req: WebhookRequest, res: WebhookResponse) {
  const webhookConfig: OAuthConfig = {
    type: 'oauth',
    store: 'your-store.mysapo.net',
    apiKey: 'your-api-key',
    secretKey: 'your-secret-key',
    redirectUri: 'https://your-app.com/oauth/callback',
  };

  const webhookClient = new SapoClient(webhookConfig);

  const hmac = req.headers['x-sapo-hmac-sha256'];
  const body = JSON.stringify(req.body);

  // Verify webhook signature
  if (!webhookClient.webhooks.verifySignature(hmac, body)) {
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

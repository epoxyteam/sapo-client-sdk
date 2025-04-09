# Sapo Client SDK

A TypeScript SDK for the Sapo API, providing easy-to-use methods for authentication and API operations.

## Features

- Full TypeScript support with comprehensive type definitions
- OAuth 2.0 authentication
- Automatic rate limiting (40 requests/minute, 80,000/day)
- Resource-specific API modules
- Error handling with typed error classes
- Request/Response interceptors
- Webhook handling utilities

## Installation

```bash
# Using npm
npm install sapo-client-sdk

# Using yarn
yarn add sapo-client-sdk

# Using pnpm
pnpm add sapo-client-sdk
```

### Requirements
- Node.js 14.x or later
- TypeScript 4.x or later (for TypeScript users)

### Configuration
Create a `.env` file in your project root:

```env
SAPO_API_KEY=your_api_key
SAPO_SECRET_KEY=your_secret_key
SAPO_REDIRECT_URI=https://your-app.com/oauth/callback
```

## Quick Start

```typescript
import { SapoClient } from 'sapo-client-sdk';

// Initialize the client
const client = new SapoClient({
  apiKey: 'your-api-key',
  secretKey: 'your-secret-key',
  redirectUri: 'https://your-app.com/oauth/callback',
});

// Get OAuth authorization URL
const authUrl = client.getAuthorizationUrl({
  store: 'your-store.mysapo.net',
  scopes: ['read_products', 'write_products'],
});

// After OAuth callback, complete authentication
const token = await client.completeOAuth(
  'your-store.mysapo.net',
  'callback-url-with-code'
);

// Now you can make API calls
try {
  const products = await client.get('/admin/products.json');
  console.log(products);
} catch (error) {
  console.error('API Error:', error);
}
```

## Authentication Guide

The SDK supports OAuth 2.0 authentication flow. Here's a detailed guide on implementing authentication:

1. Initialize the client with your credentials:
```typescript
const client = new SapoClient({
  apiKey: process.env.SAPO_API_KEY,
  secretKey: process.env.SAPO_SECRET_KEY,
  redirectUri: process.env.SAPO_REDIRECT_URI,
});
```

2. Generate the authorization URL:
```typescript
const authUrl = client.getAuthorizationUrl({
  store: 'your-store.mysapo.net',
  scopes: ['read_products', 'write_products'],
  state: 'optional-state-parameter', // For CSRF protection
});
// Redirect user to authUrl
```

3. Handle the OAuth callback:
```typescript
// In your callback route handler
app.get('/oauth/callback', async (req, res) => {
  try {
    const token = await client.completeOAuth(
      'your-store.mysapo.net',
      req.url // Full callback URL with code
    );
    
    // Store the token securely
    await saveToken(token);
    
    res.redirect('/dashboard');
  } catch (error) {
    console.error('OAuth Error:', error);
    res.redirect('/error');
  }
});
```

4. Token Management:
```typescript
// Save token for future use
const token = await client.completeOAuth(...);
client.setToken(token);

// Check if token is expired
if (client.isTokenExpired()) {
  // Refresh the token
  const newToken = await client.refreshToken(token.refresh_token);
  client.setToken(newToken);
}
```

## Rate Limiting

The SDK implements a token bucket algorithm to handle Sapo's rate limits:
- 40 requests per minute per IP
- 80,000 requests per day per shop

### Automatic Rate Limiting
The SDK automatically manages rate limits and will queue requests when limits are reached:

```typescript
const client = new SapoClient({...});

// These requests will be automatically rate limited
for (let i = 0; i < 100; i++) {
  await client.get('/admin/products.json'); // Requests are queued if needed
}
```

### Manual Rate Limit Checking
You can check current rate limits:

```typescript
const limits = client.getRateLimits();
console.log({
  remaining: limits.remaining,  // Requests remaining in current window
  limit: limits.limit,         // Total request limit
  reset: limits.reset          // Timestamp when limit resets
});

// Handle rate limit errors
try {
  await client.get('/admin/products.json');
} catch (error) {
  if (error instanceof RateLimitError) {
    console.log('Rate limit exceeded');
    console.log('Retry after:', error.retryAfter, 'seconds');
  }
}
```

## Error Handling Guide

The SDK provides typed error classes for better error handling:

```typescript
import { 
  SapoError,
  AuthenticationError,
  RateLimitError,
  ValidationError,
  NotFoundError,
  NetworkError
} from 'sapo-client-sdk';

try {
  await client.get('/admin/products.json');
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.log('Auth failed:', error.message);
    // Handle authentication errors (401)
  } else if (error instanceof RateLimitError) {
    console.log('Rate limit exceeded, retry after:', error.retryAfter);
    // Handle rate limiting (429)
  } else if (error instanceof ValidationError) {
    console.log('Validation failed:', error.errors);
    // Handle validation errors (422)
  } else if (error instanceof NotFoundError) {
    console.log('Resource not found:', error.message);
    // Handle not found errors (404)
  } else if (error instanceof NetworkError) {
    console.log('Network error:', error.message);
    // Handle network/timeout errors
  } else if (error instanceof SapoError) {
    console.log('API Error:', error.message, error.code);
    // Handle other API errors
  }
}
```

## Webhook Handling Guide

The SDK provides comprehensive webhook handling capabilities:

### Setting Up Webhooks

```typescript
const webhooks = client.webhooks;

// Create a webhook
const webhook = await webhooks.create({
  topic: 'orders/create',
  address: 'https://your-app.com/webhooks',
  format: 'json'
});

// List active webhooks
const activeWebhooks = await webhooks.list();

// Update a webhook
await webhooks.update(webhook.id, {
  address: 'https://new-address.com/webhooks'
});
```

### Securing Webhooks

```typescript
import express from 'express';
const app = express();

// Verify webhook signatures
app.post('/webhooks', express.raw({type: 'application/json'}), (req, res) => {
  const signature = req.headers['x-sapo-hmac-sha256'];
  const body = req.body.toString(); // Keep raw body as string

  if (!client.webhooks.verifySignature(signature, body)) {
    return res.status(401).send('Invalid signature');
  }

  // Process webhook
  const webhook = JSON.parse(body);
  console.log('Received webhook:', webhook);
  res.status(200).send('OK');
});
```

### Managing Webhook Deliveries

```typescript
// List webhook deliveries
const deliveries = await webhooks.listDeliveries(webhookId);

// Get delivery details
const delivery = await webhooks.getDelivery(webhookId, deliveryId);

// Retry failed delivery
await webhooks.resendDelivery(webhookId, deliveryId);

// Test webhook
await webhooks.test(webhookId);
```

## API Documentation

For detailed API documentation and examples, see:
- [Authentication](docs/authentication.md)
- [Products](docs/products.md)
- [Orders](docs/orders.md)
- [Customers](docs/customers.md)

## License

MIT License - see LICENSE file for details.
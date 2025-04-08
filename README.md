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
npm install sapo-client-sdk
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

## OAuth Authentication

The SDK handles the complete OAuth flow:

1. Generate authorization URL:
```typescript
const authUrl = client.getAuthorizationUrl({
  store: 'your-store.mysapo.net',
  scopes: ['read_products', 'write_products'],
});
// Redirect user to authUrl
```

2. Handle OAuth callback:
```typescript
const token = await client.completeOAuth(
  'your-store.mysapo.net',
  'callback-url-with-code'
);
// Token is automatically set for future requests
```

## Working with Products

Example of basic product operations:

```typescript
import { SapoClient, Products } from 'sapo-client-sdk';

const client = new SapoClient({
  apiKey: 'your-api-key',
  secretKey: 'your-secret-key',
  redirectUri: 'https://your-app.com/oauth/callback',
});

const products = new Products(client);

// List products
const productList = await products.list({
  limit: 10,
  page: 1,
  vendor: 'Apple',
});

// Create a product
const newProduct = await products.create({
  name: 'Test Product',
  content: 'Product description',
  variants: [
    {
      price: 99.99,
      inventory_quantity: 10,
    },
  ],
});

// Update a product
const updatedProduct = await products.update(newProduct.id, {
  name: 'Updated Product Name',
});

// Delete a product
await products.delete(newProduct.id);
```

## Error Handling

The SDK provides typed error classes for better error handling:

```typescript
import { SapoError, RateLimitError } from 'sapo-client-sdk';

try {
  await products.list();
} catch (error) {
  if (error instanceof RateLimitError) {
    console.log('Rate limit exceeded, retry after:', error.retryAfter);
  } else if (error instanceof SapoError) {
    console.log('API Error:', error.message, error.code);
  }
}
```

## Rate Limiting

The SDK automatically handles Sapo's rate limits:
- 40 requests per minute per IP
- 80,000 requests per day per shop

You can check current rate limits:

```typescript
const limits = client.getRateLimits();
console.log('Remaining requests:', limits.remaining);
```

## Webhook Handling

Verify webhook signatures:

```typescript
const isValid = client.verifyHmac(query, hmac);
if (isValid) {
  // Process webhook
}
```

## API Documentation

For detailed API documentation and examples, see:
- [Authentication](docs/authentication.md)
- [Products](docs/products.md)
- [Orders](docs/orders.md)
- [Customers](docs/customers.md)

## License

MIT License - see LICENSE file for details.
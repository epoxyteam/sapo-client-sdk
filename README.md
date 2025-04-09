# Sapo Client SDK

Một SDK viết bằng TypeScript dành cho API của Sapo, cung cấp các phương thức tiện lợi để xác thực và thao tác với API.

## Tính năng nổi bật

- Hỗ trợ đầy đủ TypeScript với định nghĩa kiểu rõ ràng
- Hỗ trợ xác thực theo chuẩn OAuth 2.0
- Tự động giới hạn tốc độ gọi API (40 yêu cầu/phút, 80.000 yêu cầu/ngày)
- Các module API theo từng loại tài nguyên
- Xử lý lỗi với các class lỗi được định nghĩa sẵn
- Hỗ trợ interceptor cho request/response
- Tiện ích xử lý webhook

## Cài đặt

```bash
# Sử dụng npm
npm install sapo-client-sdk

# Sử dụng yarn
yarn add sapo-client-sdk

# Sử dụng pnpm
pnpm add sapo-client-sdk
```

### Yêu cầu hệ thống

- Node.js phiên bản 14.x trở lên
- TypeScript phiên bản 4.x trở lên (nếu bạn dùng TypeScript)

### Cấu hình

Tạo file `.env` ở thư mục gốc của dự án:

```env
SAPO_API_KEY=your_api_key
SAPO_SECRET_KEY=your_secret_key
SAPO_REDIRECT_URI=https://your-app.com/oauth/callback
```

## Khởi động nhanh

```typescript
import { SapoClient } from 'sapo-client-sdk';

// Khởi tạo client
const client = new SapoClient({
  apiKey: 'your-api-key',
  secretKey: 'your-secret-key',
  redirectUri: 'https://your-app.com/oauth/callback',
});

// Lấy URL để người dùng xác thực OAuth
const authUrl = client.getAuthorizationUrl({
  store: 'your-store.mysapo.net',
  scopes: ['read_products', 'write_products'],
});

// Sau khi xác thực, hoàn tất quy trình OAuth
const token = await client.completeOAuth('your-store.mysapo.net', 'callback-url-with-code');

// Gọi API
try {
  const products = await client.get('/admin/products.json');
  console.log(products);
} catch (error) {
  console.error('Lỗi API:', error);
}
```

## Hướng dẫn xác thực

SDK hỗ trợ quy trình xác thực theo chuẩn OAuth 2.0. Các bước triển khai như sau:

### 1. Khởi tạo client

```typescript
const client = new SapoClient({
  apiKey: process.env.SAPO_API_KEY,
  secretKey: process.env.SAPO_SECRET_KEY,
  redirectUri: process.env.SAPO_REDIRECT_URI,
});
```

### 2. Tạo URL xác thực

```typescript
const authUrl = client.getAuthorizationUrl({
  store: 'your-store.mysapo.net',
  scopes: ['read_products', 'write_products'],
  state: 'optional-state-parameter', // Tùy chọn để bảo vệ CSRF
});
// Chuyển hướng người dùng tới authUrl
```

### 3. Xử lý callback từ OAuth

```typescript
app.get('/oauth/callback', async (req, res) => {
  try {
    const token = await client.completeOAuth(
      'your-store.mysapo.net',
      req.url // URL callback chứa mã xác thực
    );

    // Lưu token một cách an toàn
    await saveToken(token);

    res.redirect('/dashboard');
  } catch (error) {
    console.error('Lỗi OAuth:', error);
    res.redirect('/error');
  }
});
```

### 4. Quản lý token

```typescript
// Lưu token
const token = await client.completeOAuth(...);
client.setToken(token);

// Kiểm tra token hết hạn
if (client.isTokenExpired()) {
  // Làm mới token
  const newToken = await client.refreshToken(token.refresh_token);
  client.setToken(newToken);
}
```

## Giới hạn tốc độ (Rate Limiting)

SDK sử dụng thuật toán token bucket để giới hạn tốc độ theo yêu cầu của Sapo:

- 40 yêu cầu/phút/IP
- 80.000 yêu cầu/ngày/shop

### Giới hạn tự động

SDK sẽ tự động quản lý việc giới hạn tốc độ và xếp hàng các yêu cầu nếu cần:

```typescript
const client = new SapoClient({...});

for (let i = 0; i < 100; i++) {
  await client.get('/admin/products.json'); // SDK sẽ tự xếp hàng các yêu cầu
}
```

### Kiểm tra thủ công

Bạn có thể tự kiểm tra trạng thái giới hạn:

```typescript
const limits = client.getRateLimits();
console.log({
  remaining: limits.remaining, // Số yêu cầu còn lại
  limit: limits.limit, // Tổng giới hạn
  reset: limits.reset, // Thời gian reset tiếp theo
});
```

Xử lý lỗi do vượt quá giới hạn:

```typescript
try {
  await client.get('/admin/products.json');
} catch (error) {
  if (error instanceof RateLimitError) {
    console.log('Vượt quá giới hạn gọi API');
    console.log('Thử lại sau:', error.retryAfter, 'giây');
  }
}
```

## Hướng dẫn xử lý lỗi

SDK cung cấp các class lỗi được định nghĩa để dễ xử lý:

```typescript
import {
  SapoError,
  AuthenticationError,
  RateLimitError,
  ValidationError,
  NotFoundError,
  NetworkError,
} from 'sapo-client-sdk';

try {
  await client.get('/admin/products.json');
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.log('Xác thực thất bại:', error.message);
  } else if (error instanceof RateLimitError) {
    console.log('Quá giới hạn, thử lại sau:', error.retryAfter);
  } else if (error instanceof ValidationError) {
    console.log('Lỗi xác thực dữ liệu:', error.errors);
  } else if (error instanceof NotFoundError) {
    console.log('Không tìm thấy tài nguyên:', error.message);
  } else if (error instanceof NetworkError) {
    console.log('Lỗi mạng:', error.message);
  } else if (error instanceof SapoError) {
    console.log('Lỗi từ API:', error.message, error.code);
  }
}
```

## Hướng dẫn xử lý Webhook

SDK hỗ trợ đầy đủ các thao tác với webhook:

### Tạo Webhook

```typescript
const webhooks = client.webhooks;

// Tạo webhook mới
const webhook = await webhooks.create({
  topic: 'orders/create',
  address: 'https://your-app.com/webhooks',
  format: 'json',
});

// Danh sách webhook đang hoạt động
const activeWebhooks = await webhooks.list();

// Cập nhật webhook
await webhooks.update(webhook.id, {
  address: 'https://new-address.com/webhooks',
});
```

### Bảo mật webhook

```typescript
import express from 'express';
const app = express();

app.post('/webhooks', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['x-sapo-hmac-sha256'];
  const body = req.body.toString();

  if (!client.webhooks.verifySignature(signature, body)) {
    return res.status(401).send('Chữ ký không hợp lệ');
  }

  const webhook = JSON.parse(body);
  console.log('Webhook nhận được:', webhook);
  res.status(200).send('OK');
});
```

### Quản lý webhook deliveries

```typescript
// Danh sách lịch sử gửi webhook
const deliveries = await webhooks.listDeliveries(webhookId);

// Xem chi tiết một lần gửi
const delivery = await webhooks.getDelivery(webhookId, deliveryId);

// Gửi lại nếu thất bại
await webhooks.resendDelivery(webhookId, deliveryId);

// Test webhook
await webhooks.test(webhookId);
```

## Tài liệu API

Tham khảo thêm tại:

- [Xác thực](docs/authentication.md)
- [Sản phẩm](docs/products.md)
- [Đơn hàng](docs/orders.md)
- [Khách hàng](docs/customers.md)

## Giấy phép sử dụng

Phát hành theo giấy phép MIT – xem file LICENSE để biết thêm chi tiết.

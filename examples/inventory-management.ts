import { SapoClient } from '../src';
import { OAuthConfig, Scope } from '../src/types/auth';
import { CreateProductData } from '../src/types/products';
import { InventoryAdjustment, InventoryTransferData } from '../src/types/inventory';

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

    // Get available locations
    console.log('\n=== Locations ===');
    const locations = await client.inventory.listLocations();
    console.log('Available locations:', locations);

    // Create a product
    console.log('\n=== Create Product ===');
    const productData: CreateProductData = {
      name: 'Test Product',
      content: 'Product description',
      vendor: 'Test Vendor',
      variants: [
        {
          price: 99.99,
          inventory_quantity: 10,
          sku: 'TEST001',
          inventory_management: 'sapo',
          requires_shipping: true,
        },
      ],
    };
    const newProduct = await client.products.create(productData);
    console.log('Created product:', newProduct);

    // Get inventory item for the product variant
    console.log('\n=== Inventory Management ===');
    const inventoryItems = await client.inventory.list({
      variant_id: newProduct.variants[0].id,
    });
    const inventoryItem = inventoryItems.data[0];
    console.log('Inventory item:', inventoryItem);

    // Add inventory to first location
    const location = locations[0];
    await client.inventory.setLevel(inventoryItem.id, location.id, {
      available: 100,
      max_orderable: 10,
    });
    console.log('Set inventory level at location:', location.name);

    // Adjust inventory quantity
    const adjustment: InventoryAdjustment = {
      location_id: location.id,
      quantity: 5,
      action: 'add',
      reason: 'Stock replenishment',
    };
    await client.inventory.adjustQuantity(inventoryItem.id, adjustment);
    console.log('Adjusted inventory quantity');

    // If there's more than one location, transfer inventory
    if (locations.length > 1) {
      const transferData: InventoryTransferData = {
        from_location_id: locations[0].id,
        to_location_id: locations[1].id,
        quantity: 10,
        reference_number: 'TRANS001',
        notes: 'Stock balancing',
      };
      const transfer = await client.inventory.transfer(inventoryItem.id, transferData);
      console.log('Created inventory transfer:', transfer);

      // Get transfer details
      const transferDetails = await client.inventory.getTransfer(inventoryItem.id, transfer.id);
      console.log('Transfer details:', transferDetails);
    }

    // Get updated inventory levels
    const updatedItem = await client.inventory.get(inventoryItem.id);
    console.log('\n=== Current Inventory Levels ===');
    updatedItem.location_inventories.forEach((level) => {
      const location = locations.find((loc) => loc.id === level.location_id);
      console.log(`${location?.name}: ${level.available} available`);
    });

    // Get total inventory count
    const count = await client.inventory.count();
    console.log('\nTotal inventory items:', count);

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

// Run the example
main().catch(console.error);

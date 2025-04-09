import { SapoClient } from '../src';

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

    // Get available locations
    console.log('\n=== Locations ===');
    const locations = await client.inventory.listLocations();
    console.log('Available locations:', locations);

    // Create a product
    console.log('\n=== Create Product ===');
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
    await client.inventory.adjustQuantity(inventoryItem.id, {
      location_id: location.id,
      quantity: 5,
      action: 'add',
      reason: 'Stock replenishment',
    });
    console.log('Adjusted inventory quantity');

    // If there's more than one location, transfer inventory
    if (locations.length > 1) {
      const transfer = await client.inventory.transfer(inventoryItem.id, {
        from_location_id: locations[0].id,
        to_location_id: locations[1].id,
        quantity: 10,
        reference_number: 'TRANS001',
        notes: 'Stock balancing',
      });
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
    const limits = client.getRateLimits();
    console.log('\nRate limits:', limits);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the example
main().catch(console.error);

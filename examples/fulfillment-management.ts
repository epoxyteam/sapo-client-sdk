import { SapoClient } from '../src';

async function main() {
  // Initialize the SDK
  const client = new SapoClient({
    type: 'oauth',
    store: 'your-store.mysapo.net',
    apiKey: 'your-api-key',
    secretKey: 'your-secret-key',
    redirectUri: 'https://your-app.com/oauth/callback',
  });

  try {
    // Set access token (after OAuth flow)
    client.setAccessToken('your-access-token');
    client.setStore('your-store.mysapo.net');

    // First, create a test order
    console.log('\n=== Creating Test Order ===');
    const order = await client.orders.create({
      line_items: [
        {
          variant_id: 123456, // Replace with actual variant ID
          quantity: 2,
        },
        {
          variant_id: 789012, // Replace with actual variant ID
          quantity: 1,
        },
      ],
      customer: {
        email: 'test@example.com',
      },
      shipping_address: {
        first_name: 'John',
        last_name: 'Doe',
        address1: '123 Test St',
        city: 'Test City',
        country: 'Vietnam',
        phone: '1234567890',
      },
    });
    console.log('Created order:', order.id);

    // Get available carriers
    console.log('\n=== Available Carriers ===');
    const carriers = await client.fulfillments.getCarriers();
    console.log('Shipping carriers:', carriers);

    // Create a fulfillment for part of the order
    console.log('\n=== Creating Partial Fulfillment ===');
    const fulfillment = await client.fulfillments.create(order.id, {
      line_items: [
        {
          id: order.line_items[0].id,
          quantity: 1, // Fulfill only one of the first item
        },
      ],
      tracking_number: 'TRACK123',
      tracking_company: carriers[0]?.code || 'custom',
      notify_customer: true,
    });
    console.log('Created fulfillment:', fulfillment);

    // Add a fulfillment event
    console.log('\n=== Adding Fulfillment Event ===');
    const event = await client.fulfillments.createEvent(order.id, fulfillment.id, {
      status: 'in_transit',
      message: 'Package has left the warehouse',
    });
    console.log('Created event:', event);

    // List all events for the fulfillment
    console.log('\n=== Fulfillment Events ===');
    const events = await client.fulfillments.listEvents(order.id, fulfillment.id);
    console.log('All events:', events);

    // Update tracking information
    console.log('\n=== Updating Tracking Info ===');
    const updatedFulfillment = await client.fulfillments.updateTracking(order.id, fulfillment.id, {
      tracking_number: 'TRACK123-UPDATED',
      notify_customer: true,
    });
    console.log('Updated tracking:', updatedFulfillment);

    // Create another fulfillment for remaining items
    console.log('\n=== Fulfilling Remaining Items ===');
    const remainingFulfillment = await client.fulfillments.create(order.id, {
      line_items: [
        {
          id: order.line_items[0].id,
          quantity: 1, // Fulfill the remaining quantity
        },
        {
          id: order.line_items[1].id,
          quantity: 1, // Fulfill the second item
        },
      ],
      tracking_number: 'TRACK456',
      tracking_company: carriers[0]?.code || 'custom',
      notify_customer: true,
    });
    console.log('Created fulfillment for remaining items:', remainingFulfillment);

    // List all fulfillments for the order
    console.log('\n=== All Order Fulfillments ===');
    const fulfillments = await client.fulfillments.list(order.id);
    console.log('Total fulfillments:', fulfillments.data.length);
    console.log('Fulfillments:', fulfillments);

    // Get fulfillment count
    const count = await client.fulfillments.count(order.id);
    console.log('\nTotal fulfillments for order:', count);

    // Check rate limits
    const limits = client.getRateLimits();
    console.log('\nRate limits:', limits);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the example
main().catch(console.error);

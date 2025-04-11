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

    console.log('\n=== Creating Price Rule ===');

    // Create a percentage discount
    const percentageRule = await client.priceRules.create({
      title: '20% Off Everything',
      target_type: 'line_item',
      target_selection: 'all',
      allocation_method: 'across',
      value_type: 'percentage',
      value: -20.0,
      customer_selection: 'all',
      starts_at: new Date().toISOString(),
    });
    console.log('Created percentage discount:', percentageRule);

    // Create a fixed amount discount
    const fixedRule = await client.priceRules.create({
      title: '$10 Off Order',
      target_type: 'line_item',
      target_selection: 'all',
      allocation_method: 'across',
      value_type: 'fixed_amount',
      value: -10.0,
      customer_selection: 'all',
      starts_at: new Date().toISOString(),
      once_per_customer: true,
    });
    console.log('Created fixed amount discount:', fixedRule);

    console.log('\n=== Creating Discount Codes ===');

    // Create a discount code for the percentage rule
    const percentageCode = await client.priceRules.createDiscountCode(percentageRule.id, {
      code: 'SAVE20',
    });
    console.log('Created percentage discount code:', percentageCode);

    // Create a discount code for the fixed rule
    const fixedCode = await client.priceRules.createDiscountCode(fixedRule.id, {
      code: 'SAVE10',
    });
    console.log('Created fixed amount discount code:', fixedCode);

    console.log('\n=== Lookup Discount Codes ===');

    // Lookup discount codes
    const foundCode1 = await client.priceRules.lookupDiscountCode('SAVE20');
    console.log('Found SAVE20 code:', foundCode1);

    const foundCode2 = await client.priceRules.lookupDiscountCode('INVALID');
    console.log('Found INVALID code:', foundCode2); // Should be null

    console.log('\n=== Listing Price Rules ===');

    // List all price rules
    const priceRules = await client.priceRules.list({
      limit: 10,
    });
    console.log('Price rules:', priceRules);

    // Get discount codes for a price rule
    const discountCodes = await client.priceRules.listDiscountCodes(percentageRule.id);
    console.log('\nDiscount codes for percentage rule:', discountCodes);

    // Update a price rule
    const updatedRule = await client.priceRules.update(percentageRule.id, {
      value: -25.0, // Change to 25% off
      title: '25% Off Everything',
    });
    console.log('\nUpdated price rule:', updatedRule);

    // Update a discount code
    const updatedCode = await client.priceRules.updateDiscountCode(
      percentageRule.id,
      percentageCode.id,
      {
        code: 'SAVE25',
      }
    );
    console.log('\nUpdated discount code:', updatedCode);

    // Get price rule count
    const count = await client.priceRules.count();
    console.log('\nTotal price rules:', count);

    // Clean up
    console.log('\n=== Cleanup ===');

    // Delete discount codes
    await client.priceRules.deleteDiscountCode(percentageRule.id, percentageCode.id);
    await client.priceRules.deleteDiscountCode(fixedRule.id, fixedCode.id);
    console.log('Deleted discount codes');

    // Delete price rules
    await client.priceRules.delete(percentageRule.id);
    await client.priceRules.delete(fixedRule.id);
    console.log('Deleted price rules');

    // Check rate limits
    const limits = client.getRateLimits();
    console.log('\nRate limits:', limits);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the example
main().catch(console.error);

// productRoutes.test.js
const request = require('supertest');
const app = require('./app'); // Your Express app instance
const { db } = require('./productRoutes'); // Import db specifically for the reset function

// --- Sample Test Data ---
const validProductData = {
    product: {
        name: "iPhone 11 Pro Max - Used",
        model_id: 55, // Example model ID
        category_id: 10, // Example category ID
        description: "Slightly used iPhone 11 Pro Max in great condition.",
        slug: "iphone-11-pro-max-used-g1"
    },
    variants: [
        {
            sku: "IP11PM-GRN-256-G-01",
            price: 650.00,
            imei: "123456789012345",
            options: [
                { option_name: "Color", value: "Midnight Green" },
                { option_name: "Storage", value: "256GB" },
                { option_name: "Condition", value: "Good" },
                { option_name: "Year Manufactured", value: "2019" },
                { option_name: "OS Version", value: "iOS 15.5" }
            ]
        },
        {
            sku: "IP11PM-SLV-512-E-02",
            price: 780.50,
            imei: "987654321098765",
            options: [
                { option_name: "Color", value: "Silver" },
                { option_name: "Storage", value: "512GB" },
                { option_name: "Condition", value: "Excellent" },
                { option_name: "Year Manufactured", value: "2020" },
                { option_name: "OS Version", value: "iOS 16.1" }
            ]
        }
    ]
};

// --- Test Suite ---
describe('POST /api/products', () => {

    // Reset the in-memory store before each test
    beforeEach(() => {
        db._resetStore(); // Use the helper function to reset data
    });

    // Test successful creation
    test('should create a new product and its variants successfully', async () => {
        const response = await request(app)
            .post('/api/products')
            .send(validProductData);

        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe('Product and variants registered successfully (in-memory).');
        expect(response.body.product).toHaveProperty('product_id');
        expect(response.body.product.name).toBe(validProductData.product.name);
        expect(response.body.created_variants).toHaveLength(validProductData.variants.length);
        expect(response.body.created_variants[0]).toHaveProperty('variant_id');
        expect(response.body.created_variants[0].sku).toBe(validProductData.variants[0].sku);
        expect(response.body.created_variants[1].sku).toBe(validProductData.variants[1].sku);

        // Optional: Further checks on the in-memory store state if needed
        // expect(db.products).toHaveLength(1);
        // expect(db.variants).toHaveLength(2);
    });

    // Test validation: Missing product name
    test('should return 400 if product name is missing', async () => {
        const invalidData = JSON.parse(JSON.stringify(validProductData)); // Deep clone
        delete invalidData.product.name;

        const response = await request(app)
            .post('/api/products')
            .send(invalidData);

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toContain('Missing required product information');
    });

     // Test validation: Missing product model_id
    test('should return 400 if product model_id is missing', async () => {
        const invalidData = JSON.parse(JSON.stringify(validProductData)); // Deep clone
        delete invalidData.product.model_id;

        const response = await request(app)
            .post('/api/products')
            .send(invalidData);

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toContain('Missing required product information');
    });

    // Test validation: Missing variants array
    test('should return 400 if variants array is missing', async () => {
        const invalidData = JSON.parse(JSON.stringify(validProductData)); // Deep clone
        delete invalidData.variants;

        const response = await request(app)
            .post('/api/products')
            .send(invalidData);

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('At least one variant must be provided.');
    });

    // Test validation: Empty variants array
    test('should return 400 if variants array is empty', async () => {
        const invalidData = JSON.parse(JSON.stringify(validProductData)); // Deep clone
        invalidData.variants = [];

        const response = await request(app)
            .post('/api/products')
            .send(invalidData);

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('At least one variant must be provided.');
    });

    // Test validation: Missing variant SKU
    test('should return 400 if a variant SKU is missing', async () => {
        const invalidData = JSON.parse(JSON.stringify(validProductData)); // Deep clone
        delete invalidData.variants[0].sku;

        const response = await request(app)
            .post('/api/products')
            .send(invalidData);

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toContain('Invalid data for variant SKU (missing)');
    });

     // Test validation: Missing variant price
    test('should return 400 if a variant price is missing', async () => {
        const invalidData = JSON.parse(JSON.stringify(validProductData)); // Deep clone
        delete invalidData.variants[1].price;

        const response = await request(app)
            .post('/api/products')
            .send(invalidData);

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toContain(`Invalid data for variant SKU ${invalidData.variants[1].sku}`);
    });

    // Test validation: Missing variant options array
    test('should return 400 if variant options array is missing', async () => {
        const invalidData = JSON.parse(JSON.stringify(validProductData)); // Deep clone
        delete invalidData.variants[0].options;

        const response = await request(app)
            .post('/api/products')
            .send(invalidData);

        expect(response.statusCode).toBe(400);
         expect(response.body.message).toContain(`Invalid data for variant SKU ${invalidData.variants[0].sku}`);
    });

    // Test validation: Missing option_name in variant options
    test('should return 400 if option_name is missing in variant options', async () => {
        const invalidData = JSON.parse(JSON.stringify(validProductData)); // Deep clone
        delete invalidData.variants[0].options[1].option_name; // Remove 'Storage' name

        const response = await request(app)
            .post('/api/products')
            .send(invalidData);

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toContain(`Invalid option data in variant SKU ${invalidData.variants[0].sku}`);
    });

     // Test validation: Missing value in variant options
    test('should return 400 if value is missing in variant options', async () => {
        const invalidData = JSON.parse(JSON.stringify(validProductData)); // Deep clone
        delete invalidData.variants[1].options[0].value; // Remove 'Silver' value

        const response = await request(app)
            .post('/api/products')
            .send(invalidData);

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toContain(`Invalid option data in variant SKU ${invalidData.variants[1].sku}`);
    });

    // Test error handling: Non-existent option type
    test('should return 500 if an option_name does not exist in predefined options', async () => {
        const invalidData = JSON.parse(JSON.stringify(validProductData)); // Deep clone
        invalidData.variants[0].options.push({ option_name: "NonExistentOption", value: "SomeValue" });

        const response = await request(app)
            .post('/api/products')
            .send(invalidData);

        expect(response.statusCode).toBe(500);
        expect(response.body.message).toContain('Failed to register product');
        expect(response.body.error).toContain('Option type "NonExistentOption" not found');
    });

});

const express = require('express');
const fs = require('fs'); // File system module needed if we want to truly reset without caching
const path = require('path'); // Path module
const router = express.Router();

// --- Load Initial Data Store State ---
// Define the path to the data store file
const dataStorePath = path.join(__dirname, 'data-store.json');

// Function to load the initial state from the JSON file
const loadInitialData = () => {
    try {
        // Read the file synchronously for simplicity at startup
        // Use JSON.parse to avoid caching issues with require() during resets
        const rawData = fs.readFileSync(dataStorePath, 'utf-8');
        return JSON.parse(rawData);
    } catch (error) {
        console.error("Error reading data-store.json:", error);
        // Fallback to a minimal default state if file reading fails
        return {
            options: [],
            products: [],
            optionValues: [],
            variants: [],
            variantOptionValues: [],
            initialCounters: { nextProductId: 1, nextOptionId: 1, nextOptionValueId: 1, nextVariantId: 1 }
        };
    }
};

// Initialize the data store variables
let initialState = loadInitialData();
let products = [...initialState.products]; // Use spread syntax for shallow copy
let options = [...initialState.options];
let optionValues = [...initialState.optionValues];
let variants = [...initialState.variants];
let variantOptionValues = [...initialState.variantOptionValues];

// Initialize ID counters
let nextProductId = initialState.initialCounters.nextProductId;
let nextOptionId = initialState.initialCounters.nextOptionId;
let nextOptionValueId = initialState.initialCounters.nextOptionValueId;
let nextVariantId = initialState.initialCounters.nextVariantId;
// --- End Data Store Initialization ---


// --- Simulated Database Interaction Layer ---
// Functions now interact with the variables initialized above.
const db = {
    findOrCreateProduct: async (productData) => {
        console.log('JSON_DB: Finding or creating product:', productData.name);
        let product = products.find(p => p.slug === productData.slug || p.name === productData.name);
        if (!product) {
            product = {
                product_id: nextProductId++,
                ...productData,
                created_at: new Date(),
                updated_at: new Date()
            };
            products.push(product);
            console.log('JSON_DB: Created new product:', product);
        } else {
            console.log('JSON_DB: Found existing product:', product);
            product.updated_at = new Date();
        }
        return product;
    },

    findOptionByName: async (optionName) => {
        console.log('JSON_DB: Finding option:', optionName);
        const option = options.find(o => o.name.toLowerCase() === optionName.toLowerCase());
        if (option) {
            console.log('JSON_DB: Found option:', option);
            return option;
        } else {
            console.log('JSON_DB: Option not found:', optionName);
            return null;
        }
    },

    findOrCreateOptionValue: async (optionId, value) => {
        console.log(`JSON_DB: Finding or creating option value: OptionID=${optionId}, Value=${value}`);
        let optionValue = optionValues.find(ov => ov.option_id === optionId && String(ov.value).toLowerCase() === String(value).toLowerCase());
        if (!optionValue) {
            optionValue = {
                option_value_id: nextOptionValueId++,
                option_id: optionId,
                value: value
            };
            optionValues.push(optionValue);
            console.log('JSON_DB: Created new option value:', optionValue);
        } else {
             console.log('JSON_DB: Found existing option value:', optionValue);
        }
        return optionValue;
    },

    createVariant: async (variantData) => {
        console.log('JSON_DB: Creating variant:', variantData.sku);
        const variant = {
            variant_id: nextVariantId++,
            ...variantData,
            created_at: new Date(),
            updated_at: new Date()
        };
        variants.push(variant);
         console.log('JSON_DB: Created new variant:', variant);
        return variant;
    },

    linkVariantOptionValue: async (variantId, optionValueId) => {
        console.log(`JSON_DB: Linking VariantID=${variantId} to OptionValueID=${optionValueId}`);
        const link = {
            variant_id: variantId,
            option_value_id: optionValueId
        };
        const exists = variantOptionValues.some(vov => vov.variant_id === variantId && vov.option_value_id === optionValueId);
        if (!exists) {
             variantOptionValues.push(link);
             console.log('JSON_DB: Link created:', link);
        } else {
             console.log('JSON_DB: Link already exists:', link);
        }
        return { success: true };
    },

    beginTransaction: async () => {
        console.log('JSON_DB: Begin transaction (No-Op)');
        return {};
    },
    commitTransaction: async (transaction) => {
        console.log('JSON_DB: Commit transaction (No-Op)');
    },
    rollbackTransaction: async (transaction) => {
        console.log('JSON_DB: Rollback transaction (No-Op - Cannot automatically undo array changes)');
    },
    // Helper function for tests to reset the store by reloading from the file
    _resetStore: () => {
        console.log('JSON_DB: Resetting Store from File...');
        initialState = loadInitialData(); // Reload the initial state
        // Re-initialize the arrays and counters
        products = [...initialState.products];
        options = [...initialState.options];
        optionValues = [...initialState.optionValues];
        variants = [...initialState.variants];
        variantOptionValues = [...initialState.variantOptionValues];
        nextProductId = initialState.initialCounters.nextProductId;
        nextOptionId = initialState.initialCounters.nextOptionId;
        nextOptionValueId = initialState.initialCounters.nextOptionValueId;
        nextVariantId = initialState.initialCounters.nextVariantId;
        console.log('JSON_DB: Store Reset Complete');
    }
};
// --- End Simulated Database Interaction Layer ---


/**
 * POST /api/products
 * Registers a new product and its initial variants (used phones) using in-memory storage loaded from JSON.
 * Expects a body like:
 * {
 * "product": { "name": "...", "model_id": ..., "category_id": ..., "description": "...", "slug": "..." },
 * "variants": [
 * { "sku": "...", "price": ..., "imei": "...", "options": [ { "option_name": "Color", "value": "Red" }, ... ] },
 * ...
 * ]
 * }
 */
router.post('/', async (req, res) => {
    const { product: productData, variants: variantsData } = req.body;

    // --- Basic Input Validation ---
    if (!productData || !productData.name || !productData.model_id) {
        return res.status(400).json({ message: 'Missing required product information (name, model_id).' });
    }
    if (!variantsData || !Array.isArray(variantsData) || variantsData.length === 0) {
        return res.status(400).json({ message: 'At least one variant must be provided.' });
    }
    for (const variant of variantsData) {
        if (!variant.sku || variant.price === undefined || !variant.imei || !variant.options || !Array.isArray(variant.options)) {
             return res.status(400).json({ message: `Invalid data for variant SKU ${variant.sku || '(missing)'}. Ensure sku, price, imei, and options array are present.` });
        }
        for(const option of variant.options) {
            if (!option.option_name || option.value === undefined) {
                 return res.status(400).json({ message: `Invalid option data in variant SKU ${variant.sku}. Ensure option_name and value are present.` });
            }
        }
    }
    // --- End Validation ---

    let transaction;

    try {
        transaction = await db.beginTransaction();

        // 1. Find or Create the Base Product
        const product = await db.findOrCreateProduct(productData);
        const productId = product.product_id;

        if (!productId) {
            throw new Error('Failed to find or create the product.');
        }

        const createdVariantsInfo = [];

        // 2. Process Each Variant
        for (const variantInput of variantsData) {
            const optionValueIds = [];

            // 2a. Find/Create Option Values
            for (const optionInput of variantInput.options) {
                const optionType = await db.findOptionByName(optionInput.option_name);
                if (!optionType) {
                    console.error(`Option type "${optionInput.option_name}" not found. Cannot process variant SKU ${variantInput.sku}.`);
                    throw new Error(`Option type "${optionInput.option_name}" not found in the predefined options list.`);
                }
                const optionValue = await db.findOrCreateOptionValue(optionType.option_id, optionInput.value);
                if (!optionValue || !optionValue.option_value_id) {
                     throw new Error(`Failed to find or create option value "${optionInput.value}" for option "${optionInput.option_name}".`);
                }
                optionValueIds.push(optionValue.option_value_id);
            }

            if (optionValueIds.length !== variantInput.options.length) {
                 console.error(`Mismatch in processed options for variant SKU ${variantInput.sku}. Expected ${variantInput.options.length}, got ${optionValueIds.length}.`);
                 throw new Error(`Could not process all options for variant SKU ${variantInput.sku}.`);
            }

            // 2b. Create the Variant record
            const newVariantData = {
                product_id: productId,
                sku: variantInput.sku,
                price: variantInput.price,
                imei: variantInput.imei,
                stock_quantity: 1,
            };
            const newVariant = await db.createVariant(newVariantData);
            const variantId = newVariant.variant_id;

             if (!variantId) {
                 throw new Error(`Failed to create variant record for SKU ${variantInput.sku}.`);
            }

            // 2c. Link Variant to its Option Values
            for (const optionValueId of optionValueIds) {
                await db.linkVariantOptionValue(variantId, optionValueId);
            }

            createdVariantsInfo.push({ variant_id: variantId, sku: newVariant.sku });
        } // End loop through variantsData

        await db.commitTransaction(transaction);

        // 4. Send Success Response
        console.log("Current Products:", products);
        console.log("Current Variants:", variants);
        console.log("Current Option Values:", optionValues);
        console.log("Current Variant Links:", variantOptionValues);

        res.status(201).json({
            message: 'Product and variants registered successfully (in-memory).',
            product: { product_id: productId, name: product.name },
            created_variants: createdVariantsInfo
        });

    } catch (error) {
        console.error('Error registering product (in-memory):', error);
        if (transaction) {
            await db.rollbackTransaction(transaction);
        }
        console.error("State on Error - Products:", products);
        console.error("State on Error - Variants:", variants);
        console.error("State on Error - Option Values:", optionValues);
        console.error("State on Error - Variant Links:", variantOptionValues);

        res.status(500).json({ message: 'Failed to register product (in-memory).', error: error.message });
    }
});

// Export the router AND the db object (specifically for the reset function in tests)
module.exports = { router, db };

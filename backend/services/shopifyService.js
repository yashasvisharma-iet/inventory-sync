'use strict';

const crypto = require('node:crypto');

function getShopifyApiSdk() {
  // Lazy import so local tests can run without Shopify SDK installed.
  // Install @shopify/shopify-api in production.
  // eslint-disable-next-line global-require
  return require('@shopify/shopify-api');
}

function createShopifyGraphqlClient() {
  const { shopifyApi, LATEST_API_VERSION } = getShopifyApiSdk();
  const {
    SHOPIFY_API_KEY,
    SHOPIFY_API_SECRET,
    SHOPIFY_STORE_DOMAIN,
    SHOPIFY_ACCESS_TOKEN
  } = process.env;

  if (!SHOPIFY_API_KEY || !SHOPIFY_API_SECRET || !SHOPIFY_STORE_DOMAIN || !SHOPIFY_ACCESS_TOKEN) {
    throw new Error('Missing Shopify configuration in environment variables.');
  }

  const shopify = shopifyApi({
    apiKey: SHOPIFY_API_KEY,
    apiSecretKey: SHOPIFY_API_SECRET,
    scopes: ['write_inventory', 'read_inventory', 'read_products'],
    hostName: SHOPIFY_STORE_DOMAIN.replace(/^https?:\/\//, ''),
    apiVersion: LATEST_API_VERSION,
    isEmbeddedApp: false
  });

  return new shopify.clients.Graphql({
    session: {
      shop: SHOPIFY_STORE_DOMAIN,
      accessToken: SHOPIFY_ACCESS_TOKEN
    }
  });
}

function verifyShopifyWebhookHmac(rawBody, hmacHeader, secret) {
  if (!rawBody || !hmacHeader || !secret) {
    return false;
  }

  const digest = crypto.createHmac('sha256', secret).update(rawBody, 'utf8').digest('base64');

  const expected = Buffer.from(digest, 'utf8');
  const received = Buffer.from(hmacHeader, 'utf8');

  if (expected.length !== received.length) {
    return false;
  }

  return crypto.timingSafeEqual(expected, received);
}

async function updateShopifyInventory(sku, qty, options = {}) {
  const {
    inventoryItemId,
    locationId,
    graphqlClient = createShopifyGraphqlClient()
  } = options;

  if (!inventoryItemId || !locationId) {
    throw new Error(`Missing inventoryItemId/locationId for SKU ${sku}.`);
  }

  const mutation = `#graphql
    mutation inventorySet($input: InventorySetInput!) {
      inventorySet(input: $input) {
        inventoryLevel {
          id
          quantities(names: ["available"]) {
            quantity
          }
          item {
            id
            sku
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      reason: 'correction',
      name: 'available',
      quantities: [{ inventoryItemId, locationId, quantity: qty }]
    }
  };

  const response = await graphqlClient.query({ data: { query: mutation, variables } });
  const payload = response?.body?.data?.inventorySet;

  if (!payload) throw new Error(`No inventorySet payload returned for SKU ${sku}.`);
  if (payload.userErrors?.length) {
    throw new Error(`Shopify inventorySet errors for SKU ${sku}: ${JSON.stringify(payload.userErrors)}`);
  }

  return payload.inventoryLevel;
}

module.exports = {
  createShopifyGraphqlClient,
  verifyShopifyWebhookHmac,
  updateShopifyInventory
};

'use strict';

const crypto = require('node:crypto');

/* ===================== PUBLIC API ===================== */

function createShopifyGraphqlClient() {
  const config = loadShopifyConfig();
  validateShopifyConfig(config);

  const shopify = createShopifyApiInstance(config);
  return createGraphqlClient(shopify, config);
}

function verifyShopifyWebhookHmac(rawBody, hmacHeader, secret) {
  if (!isValidHmacInput(rawBody, hmacHeader, secret)) return false;

  const expected = generateHmacDigest(rawBody, secret);
  return compareHmac(expected, hmacHeader);
}

function buildShopifyInstallUrl(options = {}) {
  if (!isValidInstallOptions(options)) return null;

  return buildInstallUrl(options);
}

async function updateShopifyInventory(sku, qty, options = {}) {
  const client = resolveGraphqlClient(options);
  validateInventoryInput(sku, options);

  const response = await executeInventoryMutation(client, qty, options);
  return extractInventoryLevel(response, sku);
}

module.exports = {
  buildShopifyInstallUrl,
  createShopifyGraphqlClient,
  verifyShopifyWebhookHmac,
  updateShopifyInventory
};

/* ===================== CONFIG ===================== */

function loadShopifyConfig() {
  const env = process.env;

  return {
    apiKey: env.SHOPIFY_API_KEY || env.SHOPIFY_CLIENT_ID,
    apiSecret: env.SHOPIFY_API_SECRET || env.SHOPIFY_CLIENT_SECRET,
    shopDomain: normalizeShopDomain(env.SHOPIFY_STORE_DOMAIN),
    accessToken: env.SHOPIFY_ACCESS_TOKEN
  };
}

function validateShopifyConfig({ apiKey, apiSecret, shopDomain, accessToken }) {
  if (!apiKey || !apiSecret || !shopDomain || !accessToken) {
    throw new Error('Missing Shopify configuration in environment variables.');
  }
}

/* ===================== SHOPIFY CLIENT ===================== */

function createShopifyApiInstance(config) {
  const { shopifyApi, LATEST_API_VERSION } = getShopifyApiSdk();

  return shopifyApi({
    apiKey: config.apiKey,
    apiSecretKey: config.apiSecret,
    scopes: ['write_inventory', 'read_inventory', 'read_products'],
    hostName: config.shopDomain,
    apiVersion: LATEST_API_VERSION,
    isEmbeddedApp: false
  });
}

function createGraphqlClient(shopify, config) {
  return new shopify.clients.Graphql({
    session: {
      shop: config.shopDomain,
      accessToken: config.accessToken
    }
  });
}

/* ===================== HMAC ===================== */

function isValidHmacInput(rawBody, hmacHeader, secret) {
  return rawBody && hmacHeader && secret;
}

function generateHmacDigest(rawBody, secret) {
  return crypto
    .createHmac('sha256', secret)
    .update(rawBody, 'utf8')
    .digest('base64');
}

function compareHmac(expected, received) {
  const expectedBuffer = Buffer.from(expected, 'utf8');
  const receivedBuffer = Buffer.from(received, 'utf8');

  if (expectedBuffer.length !== receivedBuffer.length) return false;
  return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
}

/* ===================== INSTALL URL ===================== */

function isValidInstallOptions({ apiKey, shopDomain, redirectUri }) {
  return apiKey && shopDomain && redirectUri;
}

function buildInstallUrl({ apiKey, shopDomain, redirectUri, scopes, state }) {
  const url = new URL(`https://${normalizeShopDomain(shopDomain)}/admin/oauth/authorize`);

  url.searchParams.set('client_id', apiKey);
  url.searchParams.set('scope', scopes || defaultScopes());
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('state', state || defaultState());

  return url.toString();
}

function defaultScopes() {
  return 'read_inventory,write_inventory,read_products,read_orders';
}

function defaultState() {
  return 'inventory-sync-state';
}

/* ===================== INVENTORY ===================== */

function resolveGraphqlClient({ graphqlClient }) {
  return graphqlClient || createShopifyGraphqlClient();
}

function validateInventoryInput(sku, { inventoryItemId, locationId }) {
  if (!inventoryItemId || !locationId) {
    throw new Error(`Missing inventoryItemId/locationId for SKU ${sku}.`);
  }
}

async function executeInventoryMutation(client, qty, { inventoryItemId, locationId }) {
  const mutation = buildInventoryMutation();
  const variables = buildInventoryVariables(qty, inventoryItemId, locationId);

  return client.query({ data: { query: mutation, variables } });
}

function extractInventoryLevel(response, sku) {
  const payload = response?.body?.data?.inventorySet;

  if (!payload) {
    throw new Error(`No inventorySet payload returned for SKU ${sku}.`);
  }

  if (payload.userErrors?.length) {
    throw new Error(
      `Shopify inventorySet errors for SKU ${sku}: ${JSON.stringify(payload.userErrors)}`
    );
  }

  return payload.inventoryLevel;
}

function buildInventoryMutation() {
  return `#graphql
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
}

function buildInventoryVariables(qty, inventoryItemId, locationId) {
  return {
    input: {
      reason: 'correction',
      name: 'available',
      quantities: [{ inventoryItemId, locationId, quantity: qty }]
    }
  };
}

/* ===================== UTIL ===================== */

function normalizeShopDomain(domain = '') {
  return domain.replace(/^https?:\/\//, '');
}

function getShopifyApiSdk() {
  return require('@shopify/shopify-api');
}
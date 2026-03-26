'use strict';

const fs = require('node:fs/promises');
const path = require('node:path');
const express = require('express');
const cron = require('node-cron');
const {
  updateShopifyInventory,
  verifyShopifyWebhookHmac
} = require('./services/shopifyService');
const { applySafetyBuffer, shouldSync, deductStock } = require('./syncLogic');

const app = express();
app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf.toString('utf8');
  }
}));

const DATA_FILE = path.join(__dirname, 'mockSwil.json');
const STATUS_FILE = path.join(__dirname, 'syncStatus.json');
const PORT = Number(process.env.PORT || 4000);
const SYNC_CRON = process.env.SYNC_CRON || '*/5 * * * *';

/**
 * Example SKU mapping; in production this can come from DB/config.
 */
const skuShopifyMapping = {
  'SR-RED-38': {
    inventoryItemId: 'gid://shopify/InventoryItem/1111111111',
    locationId: 'gid://shopify/Location/2222222222'
  },
  'SR-RED-40': {
    inventoryItemId: 'gid://shopify/InventoryItem/1111111112',
    locationId: 'gid://shopify/Location/2222222222'
  },
  'ST-BLU-M': {
    inventoryItemId: 'gid://shopify/InventoryItem/1111111113',
    locationId: 'gid://shopify/Location/2222222222'
  },
  'ST-GRN-L': {
    inventoryItemId: 'gid://shopify/InventoryItem/1111111114',
    locationId: 'gid://shopify/Location/2222222222'
  }
};

const syncState = {
  perSku: {},
  lastSuccessAt: null,
  lastRunAt: null,
  lastError: null
};

async function readJson(file) {
  const content = await fs.readFile(file, 'utf8');
  return JSON.parse(content);
}

async function writeJson(file, data) {
  await fs.writeFile(file, JSON.stringify(data, null, 2));
}

async function syncSwilToShopify(options = {}) {
  const { shopifyUpdater = updateShopifyInventory } = options;

  syncState.lastRunAt = new Date().toISOString();
  const data = await readJson(DATA_FILE);
  const products = data.products || [];

  for (const product of products) {
    if (!shouldSync(product.LastUpdated, syncState.perSku[product.ItemCode]?.lastSyncedAt)) {
      continue;
    }

    const mapping = skuShopifyMapping[product.ItemCode];
    if (!mapping) {
      syncState.perSku[product.ItemCode] = {
        status: 'skipped',
        reason: 'Missing Shopify mapping',
        lastAttemptAt: new Date().toISOString(),
        swilLastUpdated: product.LastUpdated,
        rawStockQty: product.StockQty,
        syncedQty: null
      };
      continue;
    }

    const qtyForShopify = applySafetyBuffer(product.StockQty);

    try {
      await shopifyUpdater(product.ItemCode, qtyForShopify, mapping);
      syncState.perSku[product.ItemCode] = {
        status: 'success',
        lastSyncedAt: new Date().toISOString(),
        swilLastUpdated: product.LastUpdated,
        rawStockQty: product.StockQty,
        syncedQty: qtyForShopify
      };
    } catch (error) {
      syncState.perSku[product.ItemCode] = {
        status: 'failed',
        reason: error.message,
        lastAttemptAt: new Date().toISOString(),
        swilLastUpdated: product.LastUpdated,
        rawStockQty: product.StockQty,
        syncedQty: qtyForShopify
      };
      syncState.lastError = error.message;
    }
  }

  syncState.lastSuccessAt = new Date().toISOString();
  await writeJson(STATUS_FILE, syncState);
  return syncState;
}

app.get('/health', (_req, res) => {
  res.status(200).json({ ok: true, service: 'inventory-sync-middleware' });
});

app.get('/shopify/config-status', (_req, res) => {
  const apiKey = process.env.SHOPIFY_API_KEY || process.env.SHOPIFY_CLIENT_ID;
  const apiSecret = process.env.SHOPIFY_API_SECRET || process.env.SHOPIFY_CLIENT_SECRET;
  const storeDomain = process.env.SHOPIFY_STORE_DOMAIN;
  const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;
  const publicBaseUrl = process.env.PUBLIC_BASE_URL;

  const missing = [];
  if (!apiKey) missing.push('SHOPIFY_API_KEY (or SHOPIFY_CLIENT_ID)');
  if (!apiSecret) missing.push('SHOPIFY_API_SECRET (or SHOPIFY_CLIENT_SECRET)');
  if (!storeDomain) missing.push('SHOPIFY_STORE_DOMAIN');
  if (!accessToken) missing.push('SHOPIFY_ACCESS_TOKEN');

  return res.status(200).json({
    ok: missing.length === 0,
    configured: {
      apiKey: Boolean(apiKey),
      apiSecret: Boolean(apiSecret),
      storeDomain: Boolean(storeDomain),
      accessToken: Boolean(accessToken),
      webhookSecret: Boolean(process.env.SHOPIFY_WEBHOOK_SECRET),
      publicBaseUrl: Boolean(publicBaseUrl)
    },
    webhookUrl: publicBaseUrl ? `${publicBaseUrl}/webhook/shopify-order` : null,
    missing
  });
});

app.post('/webhook/shopify-order', async (req, res) => {
  try {
    const webhookSecret = process.env.SHOPIFY_WEBHOOK_SECRET;
    const hmacHeader = req.get('X-Shopify-Hmac-Sha256');

    if (webhookSecret && !verifyShopifyWebhookHmac(req.rawBody, hmacHeader, webhookSecret)) {
      return res.status(401).json({ ok: false, error: 'Invalid webhook signature.' });
    }

    const { line_items: lineItems = [] } = req.body;
    const data = await readJson(DATA_FILE);

    for (const line of lineItems) {
      const sku = line.sku;
      const soldQty = Number(line.quantity || 0);
      const row = data.products.find((item) => item.ItemCode === sku);

      if (!row) {
        continue;
      }

      row.StockQty = deductStock(row.StockQty, soldQty);
      row.LastUpdated = new Date().toISOString();
    }

    await writeJson(DATA_FILE, data);
    return res.status(200).json({ ok: true, message: 'Swil stock adjusted from Shopify order.' });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }
});

app.get('/sync/status', async (_req, res) => {
  try {
    let fileState;
    try {
      fileState = await readJson(STATUS_FILE);
    } catch {
      fileState = syncState;
    }

    return res.status(200).json({ ok: true, status: fileState });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }
});

app.post('/sync/run', async (_req, res) => {
  try {
    const state = await syncSwilToShopify();
    return res.status(200).json({ ok: true, status: state });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }
});

cron.schedule(SYNC_CRON, () => {
  syncSwilToShopify().catch((error) => {
    syncState.lastError = error.message;
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Inventory middleware listening on port ${PORT} (cron: ${SYNC_CRON})`);
  });
}

module.exports = {
  app,
  applySafetyBuffer,
  syncSwilToShopify,
  syncState,
  DATA_FILE,
  STATUS_FILE,
  SYNC_CRON
};

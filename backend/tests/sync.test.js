'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { applySafetyBuffer, shouldSync, deductStock } = require('../syncLogic');
const { buildShopifyInstallUrl, verifyShopifyWebhookHmac } = require('../services/shopifyService');

test('Safety buffer converts stock <= 1 to zero', () => {
  assert.equal(applySafetyBuffer(0), 0);
  assert.equal(applySafetyBuffer(1), 0);
  assert.equal(applySafetyBuffer(2), 2);
});

test('shouldSync only when LastUpdated is newer than last sync', () => {
  const old = '2026-03-26T09:00:00.000Z';
  const newer = '2026-03-26T10:00:00.000Z';

  assert.equal(shouldSync(newer, old), true);
  assert.equal(shouldSync(old, newer), false);
  assert.equal(shouldSync(old, old), false);
  assert.equal(shouldSync('invalid', old), false);
});

test('deductStock never goes negative', () => {
  assert.equal(deductStock(8, 2), 6);
  assert.equal(deductStock(1, 4), 0);
  assert.equal(deductStock(0, 1), 0);
});

test('verifyShopifyWebhookHmac validates webhook signatures', () => {
  const rawBody = JSON.stringify({ id: 123, line_items: [{ sku: 'SR-RED-38', quantity: 1 }] });
  const secret = 'shpss_testsecret';
  const validHmac = crypto.createHmac('sha256', secret).update(rawBody, 'utf8').digest('base64');

  assert.equal(verifyShopifyWebhookHmac(rawBody, validHmac, secret), true);
  assert.equal(verifyShopifyWebhookHmac(rawBody, 'invalid-signature', secret), false);
  assert.equal(verifyShopifyWebhookHmac(rawBody, validHmac, ''), false);
});


test('buildShopifyInstallUrl returns install link when required fields are present', () => {
  const url = buildShopifyInstallUrl({
    apiKey: 'key123',
    shopDomain: 'example.myshopify.com',
    redirectUri: 'https://my-backend.com/shopify/callback',
    scopes: 'read_inventory,write_inventory',
    state: 'abc123'
  });

  assert.ok(url.includes('https://example.myshopify.com/admin/oauth/authorize'));
  assert.ok(url.includes('client_id=key123'));
  assert.ok(url.includes('state=abc123'));
});

'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { applySafetyBuffer, shouldSync, deductStock } = require('../syncLogic');

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

'use strict';

/**
 * SAFETY BUFFER RULE:
 * If Swil stock is 0 or 1, publish 0 to Shopify.
 */
function applySafetyBuffer(stockQty) {
  return Number(stockQty) <= 1 ? 0 : Number(stockQty);
}

/**
 * True when Swil row has changed since last successful sync.
 */
function shouldSync(lastUpdatedIso, lastSyncedIso) {
  const updated = new Date(lastUpdatedIso).getTime();
  const synced = lastSyncedIso ? new Date(lastSyncedIso).getTime() : 0;

  if (!Number.isFinite(updated)) return false;
  return updated > synced;
}

/**
 * Deduct sold quantity from local Swil stock safely.
 */
function deductStock(currentQty, soldQty) {
  const current = Number(currentQty) || 0;
  const sold = Number(soldQty) || 0;
  return Math.max(0, current - sold);
}

module.exports = {
  applySafetyBuffer,
  shouldSync,
  deductStock
};

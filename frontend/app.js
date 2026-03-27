const config = window.APP_CONFIG || {};
const backendBaseUrl = (config.BACKEND_BASE_URL || '').replace(/\/$/, '');

const connectionStatusEl = document.querySelector('#connection-status');
const syncStatusEl = document.querySelector('#sync-status');
const integrationsEl = document.querySelector('#integrations');
const syncNowBtn = document.querySelector('#sync-now');
const refreshBtn = document.querySelector('#refresh');

if (!backendBaseUrl) {
  connectionStatusEl.textContent = 'Backend URL is missing in runtime-config.js';
}

async function callApi(path, options = {}) {
  const url = `${backendBaseUrl}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || `HTTP ${response.status}`);
  }

  return data;
}

async function loadHealth() {
  try {
    const health = await callApi('/health');
    connectionStatusEl.textContent = `Connected ✅ (${health.service})`;
  } catch (error) {
    connectionStatusEl.textContent = `Connection failed ❌ ${error.message}`;
  }
}

function renderIntegrations(data) {
  const installButton = data?.shopify?.installUrl
    ? `<a class="btn-link" href="${data.shopify.installUrl}" target="_blank" rel="noopener noreferrer">Connect Shopify App</a>`
    : '<span class="warn">Shopify install URL unavailable (check env vars)</span>';

  const billingButton = data?.billingSoftware?.url
    ? `<a class="btn-link" href="${data.billingSoftware.url}" target="_blank" rel="noopener noreferrer">Open Billing Software</a>`
    : '<span class="warn">Billing software URL not set (BILLING_SOFTWARE_URL)</span>';

  integrationsEl.innerHTML = `
    <div>Store: <strong>${data?.shopify?.storeDomain || 'not configured'}</strong></div>
    <div class="row">${installButton}</div>
    <div class="row">${billingButton}</div>
  `;
}

async function loadIntegrationStatus() {
  try {
    const data = await callApi('/integrations/status');
    renderIntegrations(data);
  } catch (error) {
    integrationsEl.textContent = `Failed to load integrations: ${error.message}`;
  }
}

async function loadSyncStatus() {
  try {
    const status = await callApi('/sync/status');
    syncStatusEl.textContent = JSON.stringify(status.status, null, 2);
  } catch (error) {
    syncStatusEl.textContent = `Failed to load sync status: ${error.message}`;
  }
}

syncNowBtn.addEventListener('click', async () => {
  syncNowBtn.disabled = true;
  syncNowBtn.textContent = 'Running...';

  try {
    await callApi('/sync/run', { method: 'POST' });
    await loadSyncStatus();
  } catch (error) {
    alert(`Sync failed: ${error.message}`);
  } finally {
    syncNowBtn.disabled = false;
    syncNowBtn.textContent = 'Run Sync Now';
  }
});

refreshBtn.addEventListener('click', async () => {
  await Promise.all([loadHealth(), loadIntegrationStatus(), loadSyncStatus()]);
});

await Promise.all([loadHealth(), loadIntegrationStatus(), loadSyncStatus()]);

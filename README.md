# Inventory Sync Middleware (SwilERP ↔ Shopify)

This repo is your **bridge service** between SwilERP (currently mocked) and Shopify.

It does 2-way sync:
- **Inventory push (SwilERP → Shopify)** on schedule or manual trigger.
- **Order pull effect (Shopify → SwilERP)** through a webhook that deducts stock in Swil data.

---

## 1) Architecture aligned with your SRS

- **Source of truth for stock:** SwilERP (mock file for now).
- **Middleware:** Node.js + Express service (this repo).
- **Inventory sync cadence:** configurable cron (`SYNC_CRON`, default every 5 min).
- **Safety buffer rule:** if Swil stock is `0` or `1`, publish `0` to Shopify.
- **Order sync:** Shopify `orders/create` webhook hits middleware, middleware deducts stock in Swil side.

---

## 2) What you need in Shopify (exact setup checklist)

> Do this in your **Shopify Partner/Dev app + development store admin**.

### A. In Shopify Dev Dashboard (App config)

1. Open your app (`inventory-sync`) in Shopify Dev Dashboard.
2. Go to **Configuration** (or **API access**, depending on UI label).
3. Under **Admin API access scopes**, enable at least:
   - `read_inventory`
   - `write_inventory`
   - `read_products`
   - `read_orders` (recommended for order payload handling)
4. Save config and create/release a new app version if prompted.

### B. Install app on your dev store and get Admin API token

1. In app dashboard, click **Install app** for your dev store.
2. In store admin, approve permissions.
3. Go to app/API credentials section and copy:
   - **Admin API access token** (`shpat_...`)
   - **API key**
   - **API secret key**

### C. Configure webhook in Shopify

1. In your store admin, go to **Settings → Notifications → Webhooks**.
2. Click **Create webhook**.
3. Event: **Order creation** (`orders/create`).
4. Format: **JSON**.
5. URL: `https://<your-public-domain>/webhook/shopify-order`
6. Save.

> The code verifies webhook HMAC when `SHOPIFY_WEBHOOK_SECRET` is set.

### D. Map Shopify IDs for each SKU

For each SKU, you need:
- `inventoryItemId` (gid://shopify/InventoryItem/...)
- `locationId` (gid://shopify/Location/...)

Use Shopify GraphQL query from any GraphQL client (or Admin API console):

```graphql
query ProductVariantsBySku($query: String!) {
  productVariants(first: 10, query: $query) {
    edges {
      node {
        sku
        inventoryItem {
          id
        }
      }
    }
  }
  locations(first: 10) {
    edges {
      node {
        id
        name
      }
    }
  }
}
```

Variables example:

```json
{ "query": "sku:SR-RED-38" }
```

Then update `skuShopifyMapping` in `backend/index.js`.

---

## 3) Local setup

```bash
cd backend
npm install
cp .env.example .env
# fill real values (never commit .env with live secrets)
npm start
```

Service runs on `http://localhost:4000` by default.

---

## 4) Environment variables

Defined in `backend/.env.example`:

- `PORT` (default 4000)
- `SYNC_CRON` (default `*/5 * * * *`)
- `SHOPIFY_API_KEY`
- `SHOPIFY_API_SECRET`
- `SHOPIFY_CLIENT_ID` (optional alias of `SHOPIFY_API_KEY`)
- `SHOPIFY_CLIENT_SECRET` (optional alias of `SHOPIFY_API_SECRET`)
- `SHOPIFY_STORE_DOMAIN` (e.g. `your-store.myshopify.com`)
- `SHOPIFY_ACCESS_TOKEN`
- `SHOPIFY_WEBHOOK_SECRET`
- `PUBLIC_BASE_URL` (public HTTPS URL, e.g. your ngrok URL)

---

## 5) Endpoints you can test immediately

### Health
```bash
curl http://localhost:4000/health
```

### Check Shopify config wiring (safe, no secret values returned)
```bash
curl http://localhost:4000/shopify/config-status
```

### Run sync now (SwilERP → Shopify)
```bash
curl -X POST http://localhost:4000/sync/run
```

### Check sync status
```bash
curl http://localhost:4000/sync/status
```

### Simulate Shopify order webhook
```bash
curl -X POST http://localhost:4000/webhook/shopify-order \
  -H "Content-Type: application/json" \
  -d '{
    "line_items": [
      {"sku": "SR-RED-38", "quantity": 1},
      {"sku": "ST-BLU-M", "quantity": 2}
    ]
  }'
```

If your backend is exposed via ngrok, configure Shopify webhook URL as:
`https://<your-ngrok-domain>/webhook/shopify-order` (for example `https://august-viscoelastic-pamila.ngrok-free.dev/webhook/shopify-order`).

---

## 6) Production deployment checklist

- Deploy this backend on Render/AWS/Fly/etc with HTTPS.
- Set all env vars in deployment platform.
- Update webhook URL to production domain.
- Restrict incoming webhook endpoint by HMAC verification (already supported).
- Move SKU mapping from hardcoded object to DB/config table.
- Replace `mockSwil.json` with actual SwilERP API client.

---

## 7) How to plug real SwilERP API later

Replace file read/write in `syncSwilToShopify()` and webhook handler:

- **Current mock read:** `backend/mockSwil.json`
- **Future real pull:** `GET /items?updated_after=<timestamp>` from Swil API
- **Future real order injection:** call Swil endpoint like `PostSalesInvoice`

Recommended pattern:
1. Pull changed SKUs only since last successful sync timestamp.
2. Apply safety buffer.
3. Update Shopify inventory.
4. Persist per-SKU sync result + global sync timestamp.

---

## 8) Current limitations (explicit)

- SwilERP integration is mocked, not live API.
- SKU mapping is static in code.
- Sync status persistence is JSON file (not Redis yet).

If you want, next step I can add:
1. Redis-backed sync state (drop-in),
2. DB-based SKU mapping,
3. real Swil API adapter interface.

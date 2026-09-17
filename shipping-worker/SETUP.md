# Greenovia Shipping Worker — Setup Guide

Free km-based shipping rates for Shopify using Cloudflare Workers + Google Maps API.

---

## What You Need (all free)

- Cloudflare account → https://cloudflare.com (free)
- Google Cloud account → https://console.cloud.google.com (free $200/month credit)
- Node.js installed on your PC

---

## Step 1 — Get a Google Maps API Key

1. Go to https://console.cloud.google.com
2. Create a new project → name it "Greenovia Shipping"
3. Go to **APIs & Services → Enable APIs**
4. Enable **"Distance Matrix API"**
5. Go to **APIs & Services → Credentials → Create Credentials → API Key**
6. Copy the key — keep it safe, don't share it

---

## Step 2 — Edit Your Rates

Open `src/index.js` and find this section near the top:

```js
const STORE_ADDRESS = 'Mussafah, Abu Dhabi, UAE'; // ← your actual address

const RATE_TIERS = [
  { maxKm: 20,       priceFils: 1500, label: 'Local Delivery'   }, // AED 15
  { maxKm: 50,       priceFils: 2500, label: 'Standard Delivery' }, // AED 25
  { maxKm: 100,      priceFils: 4000, label: 'Standard Delivery' }, // AED 40
  { maxKm: 200,      priceFils: 6000, label: 'Long Distance'     }, // AED 60
  { maxKm: Infinity, priceFils: 8000, label: 'Remote Delivery'   }, // AED 80
];

const FREE_SHIPPING_THRESHOLD_FILS = 19900; // AED 199 — orders above this get free shipping
```

Change:
- `STORE_ADDRESS` → your exact shop address in Abu Dhabi
- `priceFils` → price × 100 (AED 30 = 3000)
- `FREE_SHIPPING_THRESHOLD_FILS` → your free shipping threshold × 100

---

## Step 3 — Deploy to Cloudflare Workers

Open a terminal/PowerShell in the `shipping-worker` folder:

```powershell
# Install Cloudflare CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Add your Google Maps key as a secret (never stored in code)
wrangler secret put GOOGLE_MAPS_KEY
# → paste your key when prompted

# Deploy the worker
wrangler deploy
```

After deploy you'll get a URL like:
```
https://greenovia-shipping.YOUR-SUBDOMAIN.workers.dev
```

Copy that URL — you need it for Step 4.

---

## Step 4 — Register as Shopify Carrier Service

Shopify needs to know about your worker. Run this in PowerShell:

```powershell
# Replace YOUR_WORKER_URL and YOUR_SHOPIFY_TOKEN below

$headers = @{
    "X-Shopify-Access-Token" = "YOUR_SHOPIFY_ADMIN_API_TOKEN"
    "Content-Type" = "application/json"
}

$body = @{
    carrier_service = @{
        name = "Greenovia Delivery"
        callback_url = "https://greenovia-shipping.YOUR-SUBDOMAIN.workers.dev"
        service_discovery = $true
    }
} | ConvertTo-Json -Depth 3

Invoke-RestMethod -Uri "https://greenovia-3.myshopify.com/admin/api/2024-01/carrier_services.json" `
    -Method POST -Headers $headers -Body $body
```

### How to get your Shopify Admin API Token:
1. Shopify Admin → **Settings → Apps → Develop apps**
2. Click **Create an app** → name it "Shipping Worker"
3. Under **Configuration**, enable `write_shipping` and `read_shipping`
4. Install the app → copy the **Admin API access token**

---

## Step 5 — Enable Carrier-Calculated Shipping in Shopify

1. Go to **Settings → Shipping and Delivery**
2. Click your shipping profile → **Manage rates**
3. Under UAE zone, make sure "Carrier and app rates" is visible
4. If not visible: you may need to contact Shopify support to enable third-party carrier rates on your plan (it's free on annual Basic plan and above)

---

## Step 6 — Test It

1. Go to your store and add a product to cart
2. Proceed to checkout
3. Enter a UAE delivery address
4. You should see a rate like: **"Local Delivery (12 km) — AED 15"**

---

## Rate Tiers (default)

| Distance from Abu Dhabi | Rate |
|---|---|
| 0 – 20 km | AED 15 |
| 20 – 50 km | AED 25 |
| 50 – 100 km | AED 40 |
| 100 – 200 km | AED 60 |
| 200 km+ | AED 80 |
| Order above AED 199 | FREE |

---

## Update Rates Later

Edit `src/index.js`, then run:
```powershell
wrangler deploy
```
Changes go live instantly.

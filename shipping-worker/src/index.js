/**
 * Greenovia Garden Center — Shopify Carrier Service Worker
 * Hosted on Cloudflare Workers (free tier)
 * Calculates shipping rates based on driving distance from Abu Dhabi store
 */

// ============================================================
//  CONFIGURE YOUR RATES HERE — edit these values
// ============================================================

/** Your store's full address (used as the origin for distance calculation) */
const STORE_ADDRESS = 'Mussafah, Abu Dhabi, UAE';

/**
 * Rate tiers — distance in km → price in fils (AED cents)
 * e.g. AED 15 = 1500, AED 25 = 2500
 * Tiers are checked in order; the first one where distanceKm <= maxKm wins.
 */
const RATE_TIERS = [
  { maxKm: 20,       priceFils: 1500, label: 'Local Delivery'        }, // AED 15
  { maxKm: 50,       priceFils: 2500, label: 'Standard Delivery'     }, // AED 25
  { maxKm: 100,      priceFils: 4000, label: 'Standard Delivery'     }, // AED 40
  { maxKm: 200,      priceFils: 6000, label: 'Long Distance Delivery' }, // AED 60
  { maxKm: Infinity, priceFils: 8000, label: 'Remote Delivery'       }, // AED 80
];

/** Orders at or above this value (in fils) qualify for free shipping. AED 199 = 19900 */
const FREE_SHIPPING_THRESHOLD_FILS = 19900;

/** Fallback rate if Google Maps can't resolve the address */
const FALLBACK_RATE = { priceFils: 2500, label: 'Standard Delivery' };

// ============================================================

export default {
  async fetch(request, env) {
    // Only accept POST requests from Shopify
    if (request.method !== 'POST') {
      return new Response('Not found', { status: 404 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ rates: [] });
    }

    const rateRequest = body?.rate;
    if (!rateRequest?.destination) {
      return jsonResponse({ rates: [] });
    }

    const currency = rateRequest.currency || 'AED';

    // Calculate cart total in fils
    const cartTotal = (rateRequest.items || []).reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );

    // ---- Free shipping check ----
    if (cartTotal >= FREE_SHIPPING_THRESHOLD_FILS) {
      return jsonResponse({
        rates: [buildRate({
          label: '🌿 Free Delivery',
          code: 'free_delivery',
          priceFils: 0,
          currency,
          minDays: 1,
          maxDays: 3,
        })]
      });
    }

    // ---- Build destination address string ----
    const dest = rateRequest.destination;
    const destParts = [dest.address1, dest.address2, dest.city, dest.province, dest.country];
    const destAddress = destParts.filter(Boolean).join(', ');

    // ---- Call Google Maps Distance Matrix API ----
    let distanceKm = null;

    try {
      const mapsUrl =
        `https://maps.googleapis.com/maps/api/distancematrix/json` +
        `?origins=${encodeURIComponent(STORE_ADDRESS)}` +
        `&destinations=${encodeURIComponent(destAddress)}` +
        `&units=metric` +
        `&mode=driving` +
        `&key=${env.GOOGLE_MAPS_KEY}`;

      const mapsResp = await fetch(mapsUrl);
      const mapsData = await mapsResp.json();
      const element = mapsData?.rows?.[0]?.elements?.[0];

      if (element?.status === 'OK') {
        distanceKm = element.distance.value / 1000; // metres → km
      }
    } catch (err) {
      console.error('Google Maps API error:', err);
    }

    // ---- Match tier ----
    if (distanceKm !== null) {
      const tier = RATE_TIERS.find(t => distanceKm <= t.maxKm) || RATE_TIERS[RATE_TIERS.length - 1];
      const aed = (tier.priceFils / 100).toFixed(2);

      return jsonResponse({
        rates: [buildRate({
          label: `${tier.label} (${Math.round(distanceKm)} km) — AED ${aed}`,
          code: 'greenovia_delivery',
          priceFils: tier.priceFils,
          currency,
          minDays: 1,
          maxDays: 3,
        })]
      });
    }

    // ---- Fallback if Maps API failed ----
    return jsonResponse({
      rates: [buildRate({
        label: FALLBACK_RATE.label,
        code: 'standard_delivery',
        priceFils: FALLBACK_RATE.priceFils,
        currency,
        minDays: 1,
        maxDays: 4,
      })]
    });
  }
};

// ---- Helpers ----

function buildRate({ label, code, priceFils, currency, minDays, maxDays }) {
  return {
    service_name: label,
    service_code: code,
    total_price: priceFils.toString(),
    currency,
    min_delivery_date: futureDate(minDays),
    max_delivery_date: futureDate(maxDays),
    description: 'Greenovia Garden Center delivery',
  };
}

function futureDate(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

function jsonResponse(data) {
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
}

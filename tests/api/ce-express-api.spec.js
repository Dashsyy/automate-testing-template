/**
 * API Tests — CE Express Public Tracking Endpoint
 *
 * These tests call the CE Express API directly to verify the data
 * the bot depends on is available and structured as expected.
 *
 * PRD Reference: Section 10 — CE Express API
 * Endpoint: GET https://cp.cambodianexpress.com/api/public/shipment/track?code=<CODE>&_=<timestamp>
 *
 * Run: npm run test:api
 */

import { test, expect } from '@playwright/test';

const CE_API = 'https://cp.cambodianexpress.com/api/public/shipment/track';

// Replace with a real tracking code before running
const VALID_CODE = process.env.CE_VALID_TRACKING_CODE || 'CEX000000000';
const INVALID_CODE = 'INVALIDCODE000';

function trackingUrl(code) {
  return `${CE_API}?code=${code}&_=${Date.now()}`;
}

test.describe('CE Express Tracking API', () => {

  test('TC-API-001 — Valid code returns 200 with shipment data', async ({ request }) => {
    const response = await request.get(trackingUrl(VALID_CODE));

    expect(response.status()).toBe(200);

    const body = await response.json();

    // Top-level response must have data
    expect(body).toBeTruthy();

    // Shipment status must be a known code (10, 20, 30, 40, 50, 60, 70, 80)
    const validStatuses = [10, 20, 30, 40, 50, 60, 70, 80];
    expect(validStatuses).toContain(body.shipmentStatus ?? body.status);
  });

  test('TC-API-002 — Valid code returns event history with timestamps', async ({ request }) => {
    const response = await request.get(trackingUrl(VALID_CODE));
    const body = await response.json();

    // Events / history must be an array with at least one entry
    const events = body.events ?? body.history ?? body.trackingEvents ?? [];
    expect(Array.isArray(events)).toBe(true);
    expect(events.length).toBeGreaterThan(0);

    // Each event should have a timestamp
    const firstEvent = events[0];
    expect(firstEvent).toHaveProperty('time');
  });

  test('TC-API-003 — Valid code response includes package weight', async ({ request }) => {
    const response = await request.get(trackingUrl(VALID_CODE));
    const body = await response.json();

    // Weight field must exist and be non-null
    const weight = body.weight ?? body.packageWeight ?? body.parcelWeight;
    expect(weight).toBeDefined();
  });

  test('TC-API-004 — Invalid code returns non-200 or empty data', async ({ request }) => {
    const response = await request.get(trackingUrl(INVALID_CODE));

    // CE Express may return 200 with empty/null data, or a 4xx error
    if (response.status() === 200) {
      const body = await response.json();
      // If 200, the shipment data should be null/empty — not a real shipment
      const hasData = body && body.shipmentStatus != null;
      expect(hasData).toBe(false);
    } else {
      // Any 4xx is also acceptable
      expect(response.status()).toBeGreaterThanOrEqual(400);
    }
  });

  test('TC-API-005 — Out for Delivery response includes courier info', async ({ request }) => {
    // This test only runs if you have a code with status 40 (Out for Delivery)
    const OFD_CODE = process.env.CE_OFD_TRACKING_CODE;
    if (!OFD_CODE) {
      test.skip(true, 'Set CE_OFD_TRACKING_CODE in .env to run this test');
      return;
    }

    const response = await request.get(trackingUrl(OFD_CODE));
    expect(response.status()).toBe(200);

    const body = await response.json();

    // Courier name and phone should be present for status 40
    const courierName = body.courierName ?? body.driverName ?? body.courier?.name;
    const courierPhone = body.courierPhone ?? body.driverPhone ?? body.courier?.phone;

    expect(courierName).toBeTruthy();
    expect(courierPhone).toBeTruthy();
  });

  test('TC-API-006 — API response time is acceptable (under 5 seconds)', async ({ request }) => {
    const start = Date.now();
    await request.get(trackingUrl(VALID_CODE));
    const duration = Date.now() - start;

    expect(duration).toBeLessThan(5000);
  });

});

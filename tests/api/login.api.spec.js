/**
 * API Tests — Login Endpoint
 * Test cases: TC-LOGIN-005 to TC-LOGIN-006
 * Spec reference: test-cases/example/login-feature.md
 */

import { test, expect } from '@playwright/test';
import 'dotenv/config';

const API_BASE = process.env.API_BASE_URL;
const EMAIL = process.env.TEST_USER_EMAIL;
const PASSWORD = process.env.TEST_USER_PASSWORD;

// Update this path to match your app's login endpoint
const LOGIN_ENDPOINT = `${API_BASE}/auth/login`;

test.describe('Login API', () => {

  // TC-LOGIN-005
  test('TC-LOGIN-005 — POST /auth/login returns 200 with valid credentials', async ({ request }) => {
    const response = await request.post(LOGIN_ENDPOINT, {
      data: {
        email: EMAIL,
        password: PASSWORD,
      },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();

    // Adjust these field names to match your API response shape
    expect(body).toHaveProperty('token');
    expect(body).toHaveProperty('user');
    expect(body.user).toHaveProperty('email', EMAIL);
  });

  // TC-LOGIN-006
  test('TC-LOGIN-006 — POST /auth/login returns 422 with empty body', async ({ request }) => {
    const response = await request.post(LOGIN_ENDPOINT, {
      data: {},
    });

    expect(response.status()).toBe(422);

    const body = await response.json();

    // Adjust field names to match your API validation error format
    expect(body).toHaveProperty('errors');
    expect(body.errors).toHaveProperty('email');
    expect(body.errors).toHaveProperty('password');
  });

  test('TC-LOGIN-007 — POST /auth/login returns 401 with wrong password', async ({ request }) => {
    const response = await request.post(LOGIN_ENDPOINT, {
      data: {
        email: EMAIL,
        password: 'wrong-password',
      },
    });

    // Some apps return 401, others return 422 — adjust to match your API
    expect([401, 422]).toContain(response.status());
  });

});

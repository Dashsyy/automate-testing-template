/**
 * E2E Tests — Login Feature
 * Test cases: TC-LOGIN-001 to TC-LOGIN-004
 * Spec reference: test-cases/example/login-feature.md
 */

import { test, expect } from '@playwright/test';
import 'dotenv/config';

const EMAIL = process.env.TEST_USER_EMAIL;
const PASSWORD = process.env.TEST_USER_PASSWORD;

test.describe('Login Feature', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  // TC-LOGIN-001
  test('TC-LOGIN-001 — Successful login with valid credentials', async ({ page }) => {
    await page.getByLabel('Email').fill(EMAIL);
    await page.getByLabel('Password').fill(PASSWORD);
    await page.getByRole('button', { name: /login/i }).click();

    // Update this URL to match your app's post-login redirect
    await expect(page).toHaveURL(/\/dashboard/);
  });

  // TC-LOGIN-002
  test('TC-LOGIN-002 — Login fails with wrong password', async ({ page }) => {
    await page.getByLabel('Email').fill(EMAIL);
    await page.getByLabel('Password').fill('wrong-password-123');
    await page.getByRole('button', { name: /login/i }).click();

    // User must stay on login page
    await expect(page).toHaveURL(/\/login/);

    // Update this text to match your app's actual error message
    await expect(page.getByText(/invalid|credentials|do not match/i)).toBeVisible();
  });

  // TC-LOGIN-003
  test('TC-LOGIN-003 — Login fails with unregistered email', async ({ page }) => {
    await page.getByLabel('Email').fill('nonexistent@example.com');
    await page.getByLabel('Password').fill('any-password');
    await page.getByRole('button', { name: /login/i }).click();

    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByText(/invalid|credentials|do not match/i)).toBeVisible();
  });

  // TC-LOGIN-004
  test('TC-LOGIN-004 — Login form validation with empty fields', async ({ page }) => {
    await page.getByRole('button', { name: /login/i }).click();

    // Should still be on login page — no redirect
    await expect(page).toHaveURL(/\/login/);

    // At minimum the browser or app should flag the empty email field
    const emailInput = page.getByLabel('Email');
    await expect(emailInput).toBeFocused();
  });

});

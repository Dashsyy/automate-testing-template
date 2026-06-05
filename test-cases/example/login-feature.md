# Test Cases — Login Feature

**Project:** Example App
**Feature:** User Login
**Prepared by:** QA Team
**Date:** 2026-06-05
**PRD Reference:** Section 2.1 — Authentication

---

## Summary

Users must be able to log in to the app using email and password. The system should allow valid credentials, block invalid ones, and handle edge cases gracefully.

---

## Pre-conditions

- App is deployed and accessible at `BASE_URL`
- A valid test user account exists: `qa-test@yourapp.com`
- The login page is accessible at `/login`

---

## Test Cases

---

### TC-LOGIN-001 — Successful login with valid credentials

| Field | Value |
|---|---|
| **Priority** | High |
| **Type** | E2E |
| **Roles** | User |

**Pre-conditions:**
> User is not logged in. Valid credentials are in `.env`.

**Test Steps:**
1. Navigate to `/login`
2. Enter valid email and password
3. Click the Login button

**Expected Result:**
> User is redirected to the dashboard (`/dashboard`). A welcome message or user name is visible. No error messages are shown.

**Actual Result:**
> ✅ User redirected to `/dashboard`. Header shows "Welcome, QA User".

**Status:** Pass

**Bug Task:** —

**Notes:**
> Redirect URL may differ per project — update the expected URL in the test spec.

---

### TC-LOGIN-002 — Login fails with wrong password

| Field | Value |
|---|---|
| **Priority** | High |
| **Type** | E2E |
| **Roles** | User |

**Pre-conditions:**
> User is not logged in.

**Test Steps:**
1. Navigate to `/login`
2. Enter valid email with an incorrect password
3. Click the Login button

**Expected Result:**
> User stays on `/login`. An error message is displayed: "Invalid credentials" or similar. No redirect occurs.

**Actual Result:**
> ✅ Error message shown: "These credentials do not match our records."

**Status:** Pass

**Bug Task:** —

**Notes:**
> Exact error message text may vary — update assertion in test spec to match.

---

### TC-LOGIN-003 — Login fails with unregistered email

| Field | Value |
|---|---|
| **Priority** | Medium |
| **Type** | E2E |
| **Roles** | User |

**Pre-conditions:**
> User is not logged in.

**Test Steps:**
1. Navigate to `/login`
2. Enter an email that does not exist in the system
3. Enter any password
4. Click the Login button

**Expected Result:**
> Error message shown. User stays on login page. No account enumeration leak (error should be generic, not "email not found").

**Actual Result:**
>

**Status:** Not Tested

**Bug Task:** —

**Notes:**
> Security consideration: the error message should NOT confirm whether the email exists.

---

### TC-LOGIN-004 — Login form validation — empty fields

| Field | Value |
|---|---|
| **Priority** | Medium |
| **Type** | E2E |
| **Roles** | User |

**Pre-conditions:**
> User is not logged in.

**Test Steps:**
1. Navigate to `/login`
2. Leave both email and password fields empty
3. Click the Login button

**Expected Result:**
> Form validation errors shown for both fields. No network request made. User stays on login page.

**Actual Result:**
>

**Status:** Not Tested

**Bug Task:** —

**Notes:**
> Check both browser-level HTML5 validation and any app-level validation.

---

### TC-LOGIN-005 — Login API returns 200 with valid credentials

| Field | Value |
|---|---|
| **Priority** | High |
| **Type** | API |
| **Roles** | User |

**Pre-conditions:**
> API is accessible. Valid test credentials available.

**Test Steps:**
1. Send `POST /api/v1/auth/login` with valid email and password
2. Check response status and body

**Expected Result:**
> HTTP 200. Response body contains `token` and `user` object with at least `id` and `email`.

**Actual Result:**
>

**Status:** Not Tested

**Bug Task:** —

**Notes:**
> Adjust endpoint path to match the actual API. Token field name may vary (`access_token`, `token`, `data.token`).

---

### TC-LOGIN-006 — Login API returns 422 with missing fields

| Field | Value |
|---|---|
| **Priority** | Medium |
| **Type** | API |
| **Roles** | User |

**Pre-conditions:**
> API is accessible.

**Test Steps:**
1. Send `POST /api/v1/auth/login` with empty body `{}`
2. Check response status and body

**Expected Result:**
> HTTP 422. Response body contains validation errors for `email` and `password` fields.

**Actual Result:**
>

**Status:** Not Tested

**Bug Task:** —

**Notes:**
>

---

## Coverage Summary

| TC ID | Title | Priority | Type | Status |
|---|---|---|---|---|
| TC-LOGIN-001 | Successful login with valid credentials | High | E2E | Pass |
| TC-LOGIN-002 | Login fails with wrong password | High | E2E | Pass |
| TC-LOGIN-003 | Login fails with unregistered email | Medium | E2E | Not Tested |
| TC-LOGIN-004 | Login form validation — empty fields | Medium | E2E | Not Tested |
| TC-LOGIN-005 | Login API returns 200 with valid credentials | High | API | Not Tested |
| TC-LOGIN-006 | Login API returns 422 with missing fields | Medium | API | Not Tested |

---

## Out of Scope

- Password reset flow — covered in `password-reset.md`
- OAuth / social login — not in scope for this release
- Session expiry behavior — covered in `session-management.md`

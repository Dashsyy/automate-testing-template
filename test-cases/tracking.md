# Test Cases — Manual Tracking & Rate Limiting

**Project:** CE Express Auto Tracker
**Feature:** Manual Tracking & Rate Limiting
**Prepared by:**
**Date:** 2026-06-05
**PRD Reference:** Section 6.1, 6.7, 6.8

---

## Pre-conditions

- [ ] Bot is deployed and accessible (staging or production)
- [ ] Telegram account available for testing
- [ ] At least one **real** CE Express tracking code available (in-transit parcel preferred)
- [ ] At least one **delivered** CE Express tracking code available (to test status 60)
- [ ] At least one tracking code with status **Out for Delivery (40)** available (to verify courier info)
- [ ] Bot state is clean — run `/delete` on all codes before starting

---

## Test Cases

---

### TC-TRACK-001 — Send valid tracking code → receive full status reply

| Field | Value |
|---|---|
| **Priority** | High |
| **Type** | Manual |
| **Role** | User |

**Extra pre-conditions:**
> A real CE Express tracking code with at least one status event

**Test Steps:**
1. Open Telegram and start a chat with the bot
2. Send a valid CE Express tracking code as a plain text message (e.g. `CEX123456789`)

**Expected Result:**
> Bot replies with a formatted message containing:
> - Shipment status label (e.g. "In Transit")
> - Full event history with timestamps
> - Package weight
> - Destination address (masked — not full address)
> No error message is shown.

**Actual Result:**
>

**Status:** Not Tested

**Bug Report:**

**Notes:**
> Note the exact response format for future regression checks.

---

### TC-TRACK-002 — Send invalid / non-existent tracking code → error message

| Field | Value |
|---|---|
| **Priority** | High |
| **Type** | Manual |
| **Role** | User |

**Extra pre-conditions:**
> None

**Test Steps:**
1. Open Telegram and start a chat with the bot
2. Send a clearly fake tracking code: `INVALID000000`

**Expected Result:**
> Bot replies with a user-friendly error message indicating the tracking code was not found or is invalid. The bot does NOT crash or go silent.

**Actual Result:**
>

**Status:** Not Tested

**Bug Report:**

**Notes:**
> The message should be human-readable, not a raw API error.

---

### TC-TRACK-003 — Out for Delivery status includes courier name and phone

| Field | Value |
|---|---|
| **Priority** | High |
| **Type** | Manual |
| **Role** | User |

**Extra pre-conditions:**
> A tracking code whose current status is "Out for Delivery" (status code 40)

**Test Steps:**
1. Send the tracking code with status 40 to the bot

**Expected Result:**
> Reply includes courier name and courier phone number in addition to the standard tracking info.

**Actual Result:**
>

**Status:** Not Tested

**Bug Report:**

**Notes:**
> Per PRD section 6.1 — courier info only shown for status 40.

---

### TC-TRACK-004 — Destination address is masked

| Field | Value |
|---|---|
| **Priority** | Medium |
| **Type** | Manual |
| **Role** | User |

**Extra pre-conditions:**
> Any valid tracking code that has a destination address

**Test Steps:**
1. Send a valid tracking code to the bot
2. Inspect the destination address in the reply

**Expected Result:**
> Destination address is partially masked (e.g. shows city/province but not full street address). Full address is NOT visible.

**Actual Result:**
>

**Status:** Not Tested

**Bug Report:**

**Notes:**
> PRD section 11 — privacy requirement.

---

### TC-TRACK-005 — Same code re-checked within 5 minutes is rate limited

| Field | Value |
|---|---|
| **Priority** | High |
| **Type** | Manual |
| **Role** | User |

**Extra pre-conditions:**
> A valid tracking code that was just checked (within the last 5 minutes)

**Test Steps:**
1. Send a valid tracking code to the bot
2. Wait less than 5 minutes
3. Send the same tracking code again

**Expected Result:**
> Bot replies with a rate limit message explaining the cooldown. It does NOT re-fetch the tracking data. The message should indicate when the user can check again.

**Actual Result:**
>

**Status:** Not Tested

**Bug Report:**

**Notes:**
> MIN_CHECK_INTERVAL default is 300 seconds (5 min). Test with the configured value.

---

### TC-TRACK-006 — Same code can be re-checked after 5 minutes

| Field | Value |
|---|---|
| **Priority** | Medium |
| **Type** | Manual |
| **Role** | User |

**Extra pre-conditions:**
> A valid tracking code that was checked more than 5 minutes ago

**Test Steps:**
1. Send a valid tracking code
2. Wait at least 5 minutes
3. Send the same code again

**Expected Result:**
> Bot fetches and returns fresh tracking data. No rate limit message.

**Actual Result:**
>

**Status:** Not Tested

**Bug Report:**

**Notes:**
>

---

### TC-TRACK-007 — Adding 10 tracking codes succeeds

| Field | Value |
|---|---|
| **Priority** | Medium |
| **Type** | Manual |
| **Role** | User |

**Extra pre-conditions:**
> State is clean (no existing tracked codes). Have 10 different valid tracking codes ready.

**Test Steps:**
1. Send 10 different tracking codes to the bot one by one
2. After each one, confirm the bot replies normally

**Expected Result:**
> All 10 codes are accepted. Bot replies with tracking info for each. No error messages.

**Actual Result:**
>

**Status:** Not Tested

**Bug Report:**

**Notes:**
> MAX_CODES_PER_USER default is 10.

---

### TC-TRACK-008 — Adding an 11th tracking code is rejected

| Field | Value |
|---|---|
| **Priority** | High |
| **Type** | Manual |
| **Role** | User |

**Extra pre-conditions:**
> User already has 10 tracking codes registered (run TC-TRACK-007 first)

**Test Steps:**
1. Send an 11th new tracking code to the bot

**Expected Result:**
> Bot replies with an error message explaining the maximum limit has been reached. The 11th code is NOT added. Existing 10 codes remain unaffected.

**Actual Result:**
>

**Status:** Not Tested

**Bug Report:**

**Notes:**
>

---

## Coverage Summary

| TC ID | Title | Priority | Type | Status |
|---|---|---|---|---|
| TC-TRACK-001 | Send valid code → full status reply | High | Manual | Not Tested |
| TC-TRACK-002 | Invalid code → error message | High | Manual | Not Tested |
| TC-TRACK-003 | Out for Delivery → courier info shown | High | Manual | Not Tested |
| TC-TRACK-004 | Destination address is masked | Medium | Manual | Not Tested |
| TC-TRACK-005 | Re-check within 5 min → rate limited | High | Manual | Not Tested |
| TC-TRACK-006 | Re-check after 5 min → succeeds | Medium | Manual | Not Tested |
| TC-TRACK-007 | Adding 10 codes succeeds | Medium | Manual | Not Tested |
| TC-TRACK-008 | Adding 11th code is rejected | High | Manual | Not Tested |

---

## Out of Scope

- Delivered parcels removing themselves from tracking — not specified in PRD v1
- Concurrent multi-user testing — out of scope for manual phase

---

## Test Execution Sign-off

| Field | Value |
|---|---|
| **Executed by** | |
| **Execution date** | |
| **Bot username** | |
| **Environment** | |
| **Total cases** | 8 |
| **Pass** | |
| **Fail** | |
| **Blocked** | |
| **Skipped** | |

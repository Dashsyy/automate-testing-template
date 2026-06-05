# Test Cases — Automatic Status Alerts

**Project:** CE Express Auto Tracker
**Feature:** Automatic Status Alerts (Background Worker)
**Prepared by:**
**Date:** 2026-06-05
**PRD Reference:** Section 6.2

---

## Pre-conditions

- [ ] Bot is deployed with worker service running
- [ ] Worker poll interval is known (default: 3600 seconds / 1 hour)
- [ ] For faster testing, confirm with dev team if poll interval can be reduced (e.g. 60 seconds) on staging
- [ ] At least one tracking code that is expected to change status soon (active in-transit parcel)

---

## Test Cases

---

### TC-ALERT-001 — Status change triggers automatic alert to user

| Field | Value |
|---|---|
| **Priority** | High |
| **Type** | Manual |
| **Role** | User |

**Extra pre-conditions:**
> A tracking code is registered. Dev confirms or simulates a status change in the test environment.

**Test Steps:**
1. Add a tracking code to the bot
2. Wait for the worker to poll (or ask dev to trigger a status change in staging)
3. Observe the Telegram chat

**Expected Result:**
> Bot sends an unsolicited message (no user action needed) containing:
> - Previous status → new status (e.g. "In Transit → Out for Delivery")
> - Full updated event history
> User does not need to send any message to receive this alert.

**Actual Result:**
>

**Status:** Not Tested

**Bug Report:**

**Notes:**
> This test depends on a real status change. Coordinate with dev team to trigger one in staging. If not possible, test on a real parcel and wait.

---

### TC-ALERT-002 — Alert includes courier info when new status is Out for Delivery

| Field | Value |
|---|---|
| **Priority** | High |
| **Type** | Manual |
| **Role** | User |

**Extra pre-conditions:**
> A tracked parcel transitions to status 40 (Out for Delivery) during a worker poll

**Test Steps:**
1. Track a code that transitions to Out for Delivery
2. Wait for the worker alert

**Expected Result:**
> The alert message includes courier name and courier phone number in addition to status change and event history.

**Actual Result:**
>

**Status:** Not Tested

**Bug Report:**

**Notes:**
> Per PRD 6.2 — courier info must be in the alert when status is Out for Delivery.

---

### TC-ALERT-003 — No status change → no alert sent

| Field | Value |
|---|---|
| **Priority** | High |
| **Type** | Manual |
| **Role** | User |

**Extra pre-conditions:**
> A tracking code is registered. Its status has NOT changed since the last poll.

**Test Steps:**
1. Add a tracking code
2. Wait for at least one full worker poll cycle
3. Observe the Telegram chat

**Expected Result:**
> No message is sent by the bot. The chat remains silent. No duplicate or unnecessary alerts.

**Actual Result:**
>

**Status:** Not Tested

**Bug Report:**

**Notes:**
> Important — spamming users with repeated alerts when nothing changes is a critical UX bug.

---

### TC-ALERT-004 — Delivered parcel alert is sent

| Field | Value |
|---|---|
| **Priority** | High |
| **Type** | Manual |
| **Role** | User |

**Extra pre-conditions:**
> A tracked parcel reaches status 60 (Delivered)

**Test Steps:**
1. Track a code for a parcel near delivery
2. Wait for the worker to detect the delivered status

**Expected Result:**
> Bot sends an alert with the Delivered status. The alert clearly indicates the parcel has been delivered.

**Actual Result:**
>

**Status:** Not Tested

**Bug Report:**

**Notes:**
> Confirm with dev whether delivered codes are auto-removed from tracking or remain tracked.

---

### TC-ALERT-005 — Multiple users tracking the same code each receive their own alert

| Field | Value |
|---|---|
| **Priority** | Medium |
| **Type** | Manual |
| **Role** | User |

**Extra pre-conditions:**
> Two different Telegram accounts both track the same code. Status changes during a poll.

**Test Steps:**
1. Account A adds a tracking code
2. Account B adds the same tracking code
3. Wait for a status change and worker poll

**Expected Result:**
> Both Account A and Account B independently receive the alert. Neither one is skipped.

**Actual Result:**
>

**Status:** Not Tested

**Bug Report:**

**Notes:**
> Per PRD architecture — each chat ID is an independent user context.

---

## Coverage Summary

| TC ID | Title | Priority | Type | Status |
|---|---|---|---|---|
| TC-ALERT-001 | Status change → alert sent to user | High | Manual | Not Tested |
| TC-ALERT-002 | Alert includes courier info for OFD | High | Manual | Not Tested |
| TC-ALERT-003 | No change → no alert sent | High | Manual | Not Tested |
| TC-ALERT-004 | Delivered status alert sent | High | Manual | Not Tested |
| TC-ALERT-005 | Multiple users get independent alerts | Medium | Manual | Not Tested |

---

## Out of Scope

- Worker polling frequency accuracy — infrastructure concern, not QA scope
- Alert delivery latency — depends on Telegram infrastructure

---

## Test Execution Sign-off

| Field | Value |
|---|---|
| **Executed by** | |
| **Execution date** | |
| **Bot username** | |
| **Environment** | |
| **Total cases** | 5 |
| **Pass** | |
| **Fail** | |
| **Blocked** | |
| **Skipped** | |

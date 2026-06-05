# Test Cases — Error Handling & Edge Cases

**Project:** CE Express Auto Tracker
**Feature:** Error Handling & Edge Cases
**Prepared by:**
**Date:** 2026-06-05
**PRD Reference:** Section 12 (Constraints & Risks)

---

## Pre-conditions

- [ ] Bot is deployed and accessible
- [ ] Telegram account available for testing

---

## Test Cases

---

### TC-ERR-001 — Sending an empty message is handled gracefully

| Field | Value |
|---|---|
| **Priority** | Medium |
| **Type** | Manual |
| **Role** | User |

**Extra pre-conditions:**
> None

**Test Steps:**
1. Open the bot chat
2. Send a message with only spaces: `   `

**Expected Result:**
> Bot either ignores the message or replies with a helpful message. It does NOT crash or go silent indefinitely.

**Actual Result:**
>

**Status:** Not Tested

**Bug Report:**

**Notes:**
> Per PRD — any text is treated as a tracking code attempt.

---

### TC-ERR-002 — Sending a very long string is handled gracefully

| Field | Value |
|---|---|
| **Priority** | Low |
| **Type** | Manual |
| **Role** | User |

**Extra pre-conditions:**
> None

**Test Steps:**
1. Send a message with 500+ random characters to the bot

**Expected Result:**
> Bot replies with an error or "not found" message. Does NOT crash. Does NOT add the long string as a tracked code.

**Actual Result:**
>

**Status:** Not Tested

**Bug Report:**

**Notes:**
>

---

### TC-ERR-003 — CE Express API unavailable → user-friendly error shown

| Field | Value |
|---|---|
| **Priority** | High |
| **Type** | Manual |
| **Role** | User |

**Extra pre-conditions:**
> Dev team can simulate an API outage in staging (e.g. block the CE Express endpoint)

**Test Steps:**
1. Ask dev to simulate CE Express API being unavailable
2. Send a tracking code to the bot

**Expected Result:**
> Bot replies with a user-friendly error message (e.g. "Unable to fetch tracking info, please try again later."). Does NOT show a raw error, stack trace, or go silent.

**Actual Result:**
>

**Status:** Not Tested

**Bug Report:**

**Notes:**
> Per PRD section 12 — error handling returns user-friendly messages when API is down. This is High priority.

---

### TC-ERR-004 — Sending a command with wrong format is handled

| Field | Value |
|---|---|
| **Priority** | Low |
| **Type** | Manual |
| **Role** | User |

**Extra pre-conditions:**
> None

**Test Steps:**
1. Send `/delete` with extra unexpected arguments: `/delete code1 code2 code3`

**Expected Result:**
> Bot handles it gracefully — either processes the first code, or replies with usage instructions. Does NOT crash.

**Actual Result:**
>

**Status:** Not Tested

**Bug Report:**

**Notes:**
>

---

### TC-ERR-005 — Bot responds after being restarted (state is preserved)

| Field | Value |
|---|---|
| **Priority** | High |
| **Type** | Manual |
| **Role** | User |

**Extra pre-conditions:**
> User has at least 2 tracked codes. Dev restarts the bot service.

**Test Steps:**
1. Add 2 tracking codes and confirm with `/list`
2. Ask dev to restart the bot service
3. After restart, send `/list`

**Expected Result:**
> All previously tracked codes are still listed. State is preserved across restarts (persisted in `state.json`).

**Actual Result:**
>

**Status:** Not Tested

**Bug Report:**

**Notes:**
> Per PRD architecture — state is persisted in `/data/state.json` via Docker volume. Critical for production reliability.

---

### TC-ERR-006 — Unknown command is handled gracefully

| Field | Value |
|---|---|
| **Priority** | Low |
| **Type** | Manual |
| **Role** | User |

**Extra pre-conditions:**
> None

**Test Steps:**
1. Send an unknown command: `/unknown`

**Expected Result:**
> Bot either ignores it or replies with a helpful message suggesting `/help`. Does NOT crash or show an error trace.

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
| TC-ERR-001 | Empty/spaces message handled | Medium | Manual | Not Tested |
| TC-ERR-002 | Very long string handled | Low | Manual | Not Tested |
| TC-ERR-003 | CE Express API down → friendly error | High | Manual | Not Tested |
| TC-ERR-004 | Wrong command format handled | Low | Manual | Not Tested |
| TC-ERR-005 | State preserved after bot restart | High | Manual | Not Tested |
| TC-ERR-006 | Unknown command handled | Low | Manual | Not Tested |

---

## Out of Scope

- Network timeout edge cases — infrastructure concern
- Telegram API rate limiting — outside bot's control

---

## Test Execution Sign-off

| Field | Value |
|---|---|
| **Executed by** | |
| **Execution date** | |
| **Bot username** | |
| **Environment** | |
| **Total cases** | 6 |
| **Pass** | |
| **Fail** | |
| **Blocked** | |
| **Skipped** | |

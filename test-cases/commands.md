# Test Cases — Bot Commands

**Project:** CE Express Auto Tracker
**Feature:** Bot Commands (/start, /list, /help, /delete)
**Prepared by:**
**Date:** 2026-06-05
**PRD Reference:** Section 6.3, 6.4, 6.5, 6.6, 7

---

## Pre-conditions

- [ ] Bot is deployed and accessible
- [ ] Telegram account available for testing
- [ ] At least 2–3 valid CE Express tracking codes available

---

## Test Cases

---

### TC-CMD-001 — /start with no tracked codes → welcome message only

| Field | Value |
|---|---|
| **Priority** | High |
| **Type** | Manual |
| **Role** | User |

**Extra pre-conditions:**
> User has zero tracked codes (fresh state or after deleting all)

**Test Steps:**
1. Ensure no codes are being tracked (run `/delete` on all if needed)
2. Send `/start` to the bot

**Expected Result:**
> Bot replies with a welcome message. No inline keyboard buttons are shown (no codes to display).

**Actual Result:**
>

**Status:** Not Tested

**Bug Report:**

**Notes:**
>

---

### TC-CMD-002 — /start with existing tracked codes → inline keyboard shown

| Field | Value |
|---|---|
| **Priority** | High |
| **Type** | Manual |
| **Role** | User |

**Extra pre-conditions:**
> User has at least 2 tracked codes registered

**Test Steps:**
1. Add 2 tracking codes by sending them as plain text
2. Send `/start`

**Expected Result:**
> Bot replies with welcome message AND renders inline keyboard buttons — one button per tracked code. Each button label shows the tracking code.

**Actual Result:**
>

**Status:** Not Tested

**Bug Report:**

**Notes:**
>

---

### TC-CMD-003 — Tapping inline button from /start triggers re-check

| Field | Value |
|---|---|
| **Priority** | High |
| **Type** | Manual |
| **Role** | User |

**Extra pre-conditions:**
> User has at least 1 tracked code and /start inline buttons are visible

**Test Steps:**
1. Send `/start`
2. Tap one of the inline keyboard buttons (a tracking code)

**Expected Result:**
> Bot immediately re-checks that tracking code and sends back the current status — same format as a manual text message check. Rate limit still applies if within 5 minutes.

**Actual Result:**
>

**Status:** Not Tested

**Bug Report:**

**Notes:**
>

---

### TC-CMD-004 — /list with no tracked codes

| Field | Value |
|---|---|
| **Priority** | Medium |
| **Type** | Manual |
| **Role** | User |

**Extra pre-conditions:**
> User has zero tracked codes

**Test Steps:**
1. Ensure no codes are tracked
2. Send `/list`

**Expected Result:**
> Bot replies with a message indicating there are no tracked codes. It does NOT show an empty list or crash.

**Actual Result:**
>

**Status:** Not Tested

**Bug Report:**

**Notes:**
>

---

### TC-CMD-005 — /list with tracked codes shows all codes and last status

| Field | Value |
|---|---|
| **Priority** | High |
| **Type** | Manual |
| **Role** | User |

**Extra pre-conditions:**
> User has at least 2 tracked codes with known statuses

**Test Steps:**
1. Add 2–3 tracking codes
2. Send `/list`

**Expected Result:**
> Bot replies with a list of all tracked codes and each one's last known status. The list matches exactly what was added — no missing or extra codes.

**Actual Result:**
>

**Status:** Not Tested

**Bug Report:**

**Notes:**
>

---

### TC-CMD-006 — /delete with no tracked codes

| Field | Value |
|---|---|
| **Priority** | Medium |
| **Type** | Manual |
| **Role** | User |

**Extra pre-conditions:**
> User has zero tracked codes

**Test Steps:**
1. Ensure no codes are tracked
2. Send `/delete`

**Expected Result:**
> Bot replies with a message saying there are no codes to delete. No inline buttons shown. Does NOT crash.

**Actual Result:**
>

**Status:** Not Tested

**Bug Report:**

**Notes:**
>

---

### TC-CMD-007 — /delete shows inline buttons, tapping removes the code

| Field | Value |
|---|---|
| **Priority** | High |
| **Type** | Manual |
| **Role** | User |

**Extra pre-conditions:**
> User has at least 2 tracked codes

**Test Steps:**
1. Add 2 tracking codes
2. Send `/delete`
3. Tap the button for the first tracking code

**Expected Result:**
> Bot shows inline buttons — one per tracked code. After tapping, the selected code is removed and a confirmation message is shown. Running `/list` afterwards confirms the code is no longer tracked.

**Actual Result:**
>

**Status:** Not Tested

**Bug Report:**

**Notes:**
>

---

### TC-CMD-008 — /delete <CODE> removes a specific code directly

| Field | Value |
|---|---|
| **Priority** | High |
| **Type** | Manual |
| **Role** | User |

**Extra pre-conditions:**
> User has at least 1 tracked code: `CEX123456789`

**Test Steps:**
1. Add a tracking code (e.g. `CEX123456789`)
2. Send `/delete CEX123456789`

**Expected Result:**
> Bot confirms the code was removed. No inline buttons shown. Running `/list` confirms the code is gone.

**Actual Result:**
>

**Status:** Not Tested

**Bug Report:**

**Notes:**
>

---

### TC-CMD-009 — /delete <CODE> with a code not being tracked

| Field | Value |
|---|---|
| **Priority** | Medium |
| **Type** | Manual |
| **Role** | User |

**Extra pre-conditions:**
> None

**Test Steps:**
1. Send `/delete CODENOTEXIST`

**Expected Result:**
> Bot replies with an error or "not found" message. No crash, no silent failure.

**Actual Result:**
>

**Status:** Not Tested

**Bug Report:**

**Notes:**
>

---

### TC-CMD-010 — /help shows all available commands

| Field | Value |
|---|---|
| **Priority** | Medium |
| **Type** | Manual |
| **Role** | User |

**Extra pre-conditions:**
> None

**Test Steps:**
1. Send `/help`

**Expected Result:**
> Bot replies with a list of all commands: `/start`, `/list`, `/delete`, `/help` — each with a brief description. No commands are missing from the PRD table.

**Actual Result:**
>

**Status:** Not Tested

**Bug Report:**

**Notes:**
> Cross-check against PRD section 7 command table.

---

## Coverage Summary

| TC ID | Title | Priority | Type | Status |
|---|---|---|---|---|
| TC-CMD-001 | /start no codes → welcome only | High | Manual | Not Tested |
| TC-CMD-002 | /start with codes → inline keyboard | High | Manual | Not Tested |
| TC-CMD-003 | Tap inline button → triggers re-check | High | Manual | Not Tested |
| TC-CMD-004 | /list no codes → empty state message | Medium | Manual | Not Tested |
| TC-CMD-005 | /list with codes → all codes + status | High | Manual | Not Tested |
| TC-CMD-006 | /delete no codes → empty state message | Medium | Manual | Not Tested |
| TC-CMD-007 | /delete inline button → code removed | High | Manual | Not Tested |
| TC-CMD-008 | /delete CODE → direct removal | High | Manual | Not Tested |
| TC-CMD-009 | /delete CODE not tracked → error | Medium | Manual | Not Tested |
| TC-CMD-010 | /help → all commands listed | Medium | Manual | Not Tested |

---

## Out of Scope

- Deep-linking via Telegram `/start` payload — not in PRD v1
- Bot response time / latency — not in PRD v1

---

## Test Execution Sign-off

| Field | Value |
|---|---|
| **Executed by** | |
| **Execution date** | |
| **Bot username** | |
| **Environment** | |
| **Total cases** | 10 |
| **Pass** | |
| **Fail** | |
| **Blocked** | |
| **Skipped** | |

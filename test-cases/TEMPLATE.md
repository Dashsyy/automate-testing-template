# Test Cases — [Feature Name]

**Project:** [Project Name]
**Feature:** [Feature Name]
**Prepared by:** [Your Name]
**Date:** [YYYY-MM-DD]
**PRD Reference:** [Link or section name in the spec]

---

## How to Fill This Template

1. Replace `[Feature Name]` in the title and header above
2. Fill in the Pre-conditions section — things that must be true before any test runs
3. Copy the test case block below for each scenario you need to test
4. Give each test case a unique ID: `TC-[FEATURECODE]-[NUMBER]` (e.g. `TC-LOGIN-001`)
5. Leave "Actual Result" and "Status" blank — fill those in during test execution
6. See `example/login-feature.md` for a fully filled reference

**Status values:**
| Status | Meaning |
|---|---|
| Not Tested | Not yet run |
| Pass | Actual result matches expected result |
| Fail | Actual result does NOT match expected result |
| Blocked | Cannot run — something else is broken or missing |
| Skipped | Intentionally skipped this cycle (add a reason in Notes) |

**Priority values:**
| Priority | Meaning |
|---|---|
| High | Blocks product launch if broken. Must pass. |
| Medium | Degrades UX if broken. Should pass before launch. |
| Low | Minor or cosmetic. Can ship with a known issue. |

**Test type values:**
| Type | Meaning |
|---|---|
| E2E | End-to-end browser test — simulates a real user clicking through |
| API | Direct API call test — tests the backend endpoint |
| Manual | Must be tested by hand — automation not applicable |

---

## Pre-conditions

List everything that must be true before any test in this file can run:

- [ ] User is logged in as [role]
- [ ] [Feature or setting] is enabled
- [ ] Test data: [describe what data must exist]
- [ ] Testing environment URL: [URL]

---

## Test Cases

---

### TC-[FEATURE]-001 — [Short descriptive title]

| Field | Value |
|---|---|
| **Priority** | High / Medium / Low |
| **Type** | E2E / API / Manual |
| **Role** | User / Admin / Guest |

**Extra pre-conditions for this test:**
> (Leave blank if none beyond the section pre-conditions above)

**Test Steps:**
1. [Describe the first action — be specific, e.g. "Navigate to /login"]
2. [Describe the second action — e.g. "Enter email: qa-test@example.com in the Email field"]
3. [Describe the third action — e.g. "Click the Login button"]

**Expected Result:**
> What should happen after the last step. Be specific — include exact messages, URLs, or UI changes.
> Example: "User is redirected to /dashboard. The header shows the user's name. No error message is visible."

**Actual Result:**
> Fill this in during test execution.

**Status:** Not Tested

**Bug Report:** [Link to bug report file if failed — e.g. BUG-LOGIN-001.md]

**Notes:**
> Any observations, edge cases, or context worth recording.

---

### TC-[FEATURE]-002 — [Short descriptive title]

| Field | Value |
|---|---|
| **Priority** | High / Medium / Low |
| **Type** | E2E / API / Manual |
| **Role** | User / Admin / Guest |

**Extra pre-conditions for this test:**
>

**Test Steps:**
1.
2.
3.

**Expected Result:**
>

**Actual Result:**
>

**Status:** Not Tested

**Bug Report:**

**Notes:**
>

---

## Coverage Summary

Update this table as you add test cases and execute them.

| TC ID | Title | Priority | Type | Status |
|---|---|---|---|---|
| TC-[FEATURE]-001 | | High | E2E | Not Tested |
| TC-[FEATURE]-002 | | Medium | Manual | Not Tested |

---

## Out of Scope

List anything explicitly NOT covered in this file and why:

- [Item] — [Reason, e.g. "covered in another file" or "not in scope for this release"]

---

## Test Execution Sign-off

| Field | Value |
|---|---|
| **Executed by** | |
| **Execution date** | |
| **Environment URL** | |
| **Browser** | |
| **Total cases** | |
| **Pass** | |
| **Fail** | |
| **Blocked** | |
| **Skipped** | |

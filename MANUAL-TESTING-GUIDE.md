# Manual Testing Guide

For QA testers. No coding or technical knowledge required.

---

## Overview — Your Testing Workflow

```
Receive PRD / Spec
       ↓
Write test cases  ←── do this BEFORE dev is done
       ↓
Wait for dev to signal "ready to test"
       ↓
Execute tests manually in the browser
       ↓
Record results (Pass / Fail / Blocked)
       ↓
Report bugs in Asana for any failures
       ↓
Dev fixes bugs → re-test those specific cases
       ↓
Sign off when all critical cases pass
```

---

## Step 1 — Understand What You Are Testing

Before writing a single test case:

1. **Read the PRD or spec document** — understand what the feature is supposed to do
2. **Identify the features** — break the product into testable areas
   - Example: Login, User Registration, Product Listing, Checkout, Admin Panel
3. **Identify the user roles** — who uses the app and with what permissions?
   - Example: Guest (not logged in), Regular User, Admin
4. **Ask the PM or dev** to clarify anything that is not clear in the spec

---

## Step 2 — Write Test Cases (Before Dev is Done)

One markdown file per feature. Use the template.

**How to do it:**
1. Go to the `test-cases/` folder
2. Copy `TEMPLATE.md` → paste it → rename to your feature
   - Example: `checkout-flow.md`, `user-registration.md`, `product-search.md`
3. Fill in the file — see `test-cases/example/login-feature.md` as a full reference

**What makes a good test case:**
- **Clear steps** — anyone should be able to follow them, not just you
- **Specific expected result** — don't write "it works". Write exactly what should appear, happen, or change
- **One scenario per test case** — don't mix multiple things in one case
- **Cover the happy path AND failure paths:**
  - Happy path: user does everything correctly
  - Error path: user does something wrong (wrong password, empty field, etc.)
  - Edge cases: very long input, special characters, empty state, etc.

**Test case priorities:**
| Priority | Meaning |
|---|---|
| High | Blocks the product launch if broken. Must pass. |
| Medium | Degrades user experience if broken. Should pass before launch. |
| Low | Minor or cosmetic issue. Can ship with a known issue. |

---

## Step 3 — Get Ready to Test (When Dev Signals Ready)

Before you open the browser:

- [ ] Confirm the **URL** of the staging or test environment with the dev team
- [ ] Confirm your **test account** (email and password) — do not use your real account
- [ ] Confirm any **test data** you need is in place (e.g. "there must be at least 3 products in the catalog")
- [ ] Know which **browser** to test in (if not specified, use Chrome)
- [ ] Review your test cases and make sure you understand all the steps

---

## Step 4 — Execute Tests

Go through your test cases one by one. For each test case:

1. **Follow the steps exactly** as written
2. **Observe what happens**
3. **Fill in "Actual Result"** — describe what actually happened
4. **Set the Status:**

| Status | When to use |
|---|---|
| Pass | The actual result matches the expected result exactly |
| Fail | The actual result does NOT match the expected result |
| Blocked | You cannot run this test because something else is broken or missing |
| Skipped | Intentionally not tested this cycle (note the reason) |
| Not Tested | Not yet run |

**Tips during execution:**
- Take a screenshot whenever something looks wrong — even if you're not sure it's a bug
- Test one role at a time (e.g. finish all User tests before switching to Admin)
- If you find a bug that blocks many other tests, report it immediately and mark the blocked tests as "Blocked"
- Re-test after every developer fix — don't assume it's fixed without checking

---

## Step 5 — Report Bugs

For every test case with Status = **Fail**:

1. Go to `test-cases/` folder
2. Copy `BUG-REPORT.md` → paste it alongside your test case file
3. Rename it — example: `BUG-LOGIN-001.md`
4. Fill in all fields — see `test-cases/example/bug-report-example.md` as reference
5. Create a new task in Asana with the title: `[BUG] BUG-LOGIN-001 — Short description`
6. Paste the bug report content into the Asana task description
7. Copy the Asana task URL back into your bug report file under "Asana Task"

**Good bug reports include:**
- Exact steps so the developer can reproduce it every time
- What you expected vs what actually happened
- A screenshot or screen recording
- The URL of the page where the bug occurred
- The browser and OS you were using

---

## Step 6 — Re-testing After Fixes

When a developer marks a bug as fixed:

1. Go back to the original test case
2. Execute only that test case again (you don't need to re-run everything)
3. Update the Status: Pass or Fail
4. If it passes — update the Asana task and note it was verified
5. If it still fails — comment on the Asana task with new evidence

---

## Step 7 — Sign Off

Testing is complete when:
- All **High** priority test cases have Status = Pass
- All bugs marked **Critical** or **High** severity have been fixed and re-verified
- Any remaining open bugs are **Medium or Low** severity and agreed with the PM to ship

Create a short test summary and share it with the PM and dev team:
- Total test cases: X
- Pass: X | Fail: X | Blocked: X | Skipped: X
- Open bugs: X (list the Asana task links)
- Sign-off decision: Ready to launch / Not ready

---

## Quick Reference

### Test case file naming
`[feature-name].md` → e.g. `login.md`, `checkout-flow.md`, `admin-user-management.md`

### Test case ID format
`TC-[FEATURE]-[NUMBER]` → e.g. `TC-LOGIN-001`, `TC-CHECKOUT-003`

### Bug report file naming
`BUG-[FEATURE]-[NUMBER].md` → e.g. `BUG-LOGIN-001.md`

### Bug severity guide
| Severity | Meaning |
|---|---|
| Critical | App crashes, data is lost, or security is broken |
| High | Core feature is broken and there is no workaround |
| Medium | Feature works but has a noticeable problem — workaround exists |
| Low | Minor visual or cosmetic issue |

### Where to get help
- Unclear spec → ask the PM or product owner
- Unclear test environment → ask the dev team
- Not sure if something is a bug → ask the dev team before logging it

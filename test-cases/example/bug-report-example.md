# Bug Report — BUG-LOGIN-001

> This is a filled example. Use it as a reference when writing your own bug reports.

---

## Summary

**Bug ID:** BUG-LOGIN-001
**Related Test Case:** TC-LOGIN-002
**Feature:** User Login
**Date Found:** 2026-06-05
**Found by:** QA Team
**Asana Task:** https://app.asana.com/0/123456789/987654321

---

## Severity

Mark one:

- [ ] Critical — App crashes, data is lost, or security is broken
- [x] High — Core feature is broken, no workaround exists
- [ ] Medium — Feature works but has a noticeable problem, workaround exists
- [ ] Low — Minor visual or cosmetic issue

---

## Environment

| Field | Value |
|---|---|
| **Environment URL** | https://staging.example.com |
| **Page URL where bug occurred** | https://staging.example.com/login |
| **Browser** | Chrome 124.0.6367.82 |
| **Operating System** | macOS 14.4 |
| **Screen size / device** | Desktop 1440px |
| **User role / account used** | Regular user: qa-test@example.com |

---

## Steps to Reproduce

1. Navigate to https://staging.example.com/login
2. Enter email: `qa-test@example.com`
3. Enter password: `WrongPassword123`
4. Click the **Login** button

---

## Expected Result

User stays on the `/login` page. An error message is displayed: "These credentials do not match our records." No redirect occurs.

---

## Actual Result

The page shows a blank white screen with no message. The browser console shows: `Uncaught TypeError: Cannot read properties of undefined (reading 'message')`. The user is not redirected and cannot try again without refreshing the page.

---

## Evidence

- Screenshot: `screenshots/BUG-LOGIN-001-blank-screen.png`
- Console error:
  ```
  Uncaught TypeError: Cannot read properties of undefined (reading 'message')
      at handleLoginError (auth.js:47)
      at login (auth.js:23)
  ```

---

## Additional Notes

- Happens every time with any wrong password
- Also tested in Firefox — same behavior
- Did not test with admin account
- The error only started after the latest deployment on 2026-06-04 — it worked correctly before that

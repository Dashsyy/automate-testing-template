# Pre-Testing Checklist

Complete this checklist before starting any test cycle on a new project.

---

## Phase 1 — Before Dev Is Done (Test Planning)

These items are needed to write test cases, even before the app is ready.

- [ ] **PRD or Spec document received**
  - Who to ask: Product Manager / Project Owner
  - Why: All test cases must be derived from the spec, not assumptions

- [ ] **Feature list confirmed**
  - Break the spec into testable features (e.g. Login, Checkout, User Profile)
  - One markdown file per feature in `test-cases/`

- [ ] **User roles identified**
  - List all roles that exist in the app (e.g. Admin, Member, Guest)
  - Each role may need separate test cases

- [ ] **Test case template copied and filled**
  - Copy `test-cases/TEMPLATE.md` for each feature
  - Fill in: scenario, steps, expected result, priority

- [ ] **Test case reviewed**
  - Share with dev or PM to confirm expected results are correct
  - Especially for edge cases and error scenarios

---

## Phase 2 — Before Running Automated Tests (When Dev Is Ready)

These items are needed before running Playwright tests.

- [ ] **Base URL confirmed**
  - Staging or UAT environment URL
  - Example: `https://staging.yourapp.com`
  - Set in `.env` → `BASE_URL`

- [ ] **Test credentials created**
  - At least one test account per user role
  - Set in `.env` → `TEST_USER_EMAIL`, `TEST_USER_PASSWORD`
  - Do NOT use real production accounts

- [ ] **API base URL confirmed** (if testing APIs)
  - Example: `https://staging.yourapp.com/api/v1`
  - Set in `.env` → `API_BASE_URL`

- [ ] **API auth token obtained** (if APIs require auth)
  - A valid bearer token for the test account
  - Set in `.env` → `API_AUTH_TOKEN`

- [ ] **`.env` file created**
  ```bash
  cp .env.example .env
  # Fill in all values
  ```

- [ ] **Dependencies installed**
  ```bash
  npm install
  npx playwright install
  ```

- [ ] **Smoke test run** (confirm setup works)
  ```bash
  npm test
  ```

---

## Phase 3 — Asana Integration (Bug Tracking)

These items are needed so failed tests auto-create Asana tasks.

- [ ] **Asana personal access token**
  - Get from: Asana → Profile → Apps → Personal Access Tokens
  - Set in `.env` → `ASANA_TOKEN`

- [ ] **Asana Project GID (ID)**
  - Open the Asana project in browser
  - The URL contains the project ID: `app.asana.com/0/[PROJECT_GID]/...`
  - Set in `.env` → `ASANA_PROJECT_ID`

- [ ] **Asana task fields agreed with team**
  - What fields does the team expect on a bug task?
  - Default template creates: Title, Description, Steps to Reproduce, Environment, Priority
  - Customize in `utils/asana.js` if needed

- [ ] **Asana integration tested**
  ```bash
  node utils/asana.js --test
  ```
  - This creates one test task in Asana to verify the connection

---

## Phase 4 — Before Each Test Cycle

Run through this every time you start a new round of testing.

- [ ] App is deployed to the correct environment (confirm with dev)
- [ ] Test data is in place (if tests rely on specific data being present)
- [ ] Previous test reports cleared if needed (`reports/` folder)
- [ ] `.env` `ENVIRONMENT` value matches the current environment

---

## Quick Reference — Things You Should Never Do

- Never test on production with automated tests
- Never commit `.env` to git (it's in `.gitignore`)
- Never use real user accounts as test credentials
- Never skip writing test cases — plan first, run second

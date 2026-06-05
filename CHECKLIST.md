# Pre-Testing Checklist

Complete this checklist before starting any test cycle on a new project.

---

## Manual Testing Checklist (QAs — no code needed)

### Before Dev is Done — Test Planning

- [ ] **PRD or spec document received**
  - Who to ask: Product Manager / Project Owner
  - Why: All test cases must come from the spec, not assumptions

- [ ] **Features identified and listed**
  - Break the spec into testable areas (e.g. Login, Checkout, User Profile)
  - One markdown file per feature in `test-cases/`

- [ ] **User roles identified**
  - List every role that exists in the app (e.g. Admin, User, Guest)
  - Each role likely needs its own test cases

- [ ] **Test cases written for each feature**
  - Copy `test-cases/TEMPLATE.md` for each feature
  - Fill in: scenario, steps, expected result, priority
  - Reference: `test-cases/example/login-feature.md`

- [ ] **Test cases reviewed with PM or dev**
  - Confirm expected results are correct before testing begins
  - Especially review edge cases and error scenarios

---

### When Dev Signals Ready — Before You Start Testing

- [ ] **Test environment URL confirmed**
  - Get the staging or UAT URL from the dev team
  - Example: `https://staging.yourapp.com`

- [ ] **Test account credentials confirmed**
  - Get a dedicated test account (email + password) per role
  - Do NOT use your real account or production accounts

- [ ] **Test data confirmed**
  - Ask the dev team what data is already set up in the test environment
  - Example: "Are there existing products I can browse?" or "Is there an order I can view?"

- [ ] **Browser decided**
  - If not specified by the team, use **Chrome** as default
  - Note the browser version you are using

- [ ] **All test cases reviewed**
  - Read through your test cases before opening the browser
  - Make sure you understand every step before executing

---

### After Testing — Closing Out

- [ ] **All test cases have a status** (Pass / Fail / Blocked / Skipped)
- [ ] **Bug reports filed for every Fail** in `test-cases/` and linked in Asana
- [ ] **Blocked tests explained** — note what is blocking them
- [ ] **Test summary shared** with PM and dev team
- [ ] **Sign-off table filled** at the bottom of each test case file

---

## Automation Checklist (Technical Staff Only)

> Skip this section if you are doing manual testing only.

### First-Time Setup

- [ ] **Node.js installed** — version 18 or higher
  ```bash
  node --version
  ```

- [ ] **Dependencies installed**
  ```bash
  npm install
  npx playwright install
  ```

- [ ] **`.env` file created**
  ```bash
  cp .env.example .env
  ```

- [ ] **`.env` filled in** — see `.env.example` for all required variables:
  - `BASE_URL` — app URL
  - `TEST_USER_EMAIL` / `TEST_USER_PASSWORD`
  - `ASANA_TOKEN` / `ASANA_PROJECT_ID`

### Before Each Automation Run

- [ ] **`.env` `ENVIRONMENT` matches current environment** (staging / uat / production)
- [ ] **Test credentials still valid** — log in manually to confirm accounts are active
- [ ] **Asana integration working** (if enabled):
  ```bash
  node utils/asana.js --test
  ```

### After Each Automation Run

- [ ] **HTML report reviewed** — run `npm run report` to open it
- [ ] **`reports/results.json` saved** if you need a record of this run
- [ ] **Asana tasks created for failures** — verify in Asana project

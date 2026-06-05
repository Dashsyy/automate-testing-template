# QA Automation Template — Source of Truth

A reusable testing template for QA engineers to plan, automate, and track bugs across multiple web projects.

---

## Who This Is For

QA engineers who:
- Test web apps from a real user perspective (UAT / acceptance testing)
- Need to plan test cases **before** dev is done
- Run E2E and API tests **when dev is ready**
- Auto-create bug tasks in **Asana** when tests fail

---

## Workflow This Template Supports

```
1. Receive PRD / Spec
       ↓
2. Fill test cases in test-cases/ (before dev is done)
       ↓
3. Dev signals ready → copy .env.example → fill real values
       ↓
4. Run tests → reports generated in reports/
       ↓
5. Failed tests → Asana tasks auto-created
       ↓
6. Dev fixes → re-run tests → confirm pass
```

---

## Folder Structure

```
├── README.md                  ← you are here
├── CHECKLIST.md               ← what to prepare before you start
├── .env.example               ← copy to .env and fill in values
├── package.json               ← dependencies (Playwright)
├── playwright.config.js       ← test runner config
├── .gitignore
│
├── config/
│   └── settings.js            ← loads .env, exports config object
│
├── test-cases/
│   ├── TEMPLATE.md            ← blank test case template (copy per feature)
│   └── example/
│       └── login-feature.md   ← filled example — use as reference
│
├── tests/
│   ├── e2e/                   ← browser flow tests (Playwright)
│   │   └── example.spec.js
│   └── api/                   ← API endpoint tests (Playwright API)
│       └── example.api.spec.js
│
├── utils/
│   ├── asana.js               ← creates Asana task on test failure
│   └── reporter.js            ← custom reporter that calls asana.js
│
└── reports/                   ← test output saved here (HTML + JSON)
```

---

## Quick Start (New Project)

### Step 1 — Install dependencies
```bash
npm install
npx playwright install
```

### Step 2 — Set up environment
```bash
cp .env.example .env
# Edit .env with real values (base URL, credentials, Asana token)
```

### Step 3 — Plan test cases
- Copy `test-cases/TEMPLATE.md` → rename to your feature (e.g. `checkout-flow.md`)
- Fill in test cases from the PRD before dev is done

### Step 4 — Run tests (when dev is ready)
```bash
# Run all tests
npm test

# Run only E2E tests
npm run test:e2e

# Run only API tests
npm run test:api

# Run with visible browser (debug mode)
npm run test:headed

# View HTML report after run
npm run report
```

### Step 5 — Check results
- Reports saved in `reports/`
- Failed tests automatically create tasks in Asana

---

## Environment Variables Reference

See `.env.example` for full list. Key ones:

| Variable | Purpose |
|---|---|
| `BASE_URL` | App URL to test against (staging/UAT) |
| `TEST_USER_EMAIL` | Test account email |
| `TEST_USER_PASSWORD` | Test account password |
| `ASANA_TOKEN` | Asana personal access token |
| `ASANA_PROJECT_ID` | Asana project where bug tasks are created |
| `ENVIRONMENT` | staging / uat / production |

---

## Using This Template for a New Project

1. Copy this entire folder
2. Rename it to your project name
3. Delete files inside `test-cases/example/` and `tests/e2e/` and `tests/api/` (keep the folders)
4. Fill `.env` with the new project values
5. Start writing test cases from the PRD

---

## Conventions

- One markdown file per **feature** in `test-cases/`
- Test case IDs: `TC-[FEATURE]-[NUMBER]` e.g. `TC-LOGIN-001`
- Asana task title format: `[BUG] TC-LOGIN-001 — Login fails with valid credentials`
- Test files mirror test case files: `login.spec.js` ↔ `login-feature.md`

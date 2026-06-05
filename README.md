# QA Testing Template — Source of Truth

A reusable template for QA teams to plan, execute, and track bugs across web projects.

Designed for **non-technical QAs** doing manual testing, with an automation layer available for technical staff.

---

## Who This Is For

| Role | What you use |
|---|---|
| QA (manual tester) | `MANUAL-TESTING-GUIDE.md`, `test-cases/`, `CHECKLIST.md` |
| Technical QA / Dev | Everything above + `tests/`, `playwright.config.js`, `utils/` |

---

## Phase 1 — Manual Testing (QAs — no code needed)

This is where you start. No installation, no terminal, no code.

**Step 1 — Read the process guide**
Open [MANUAL-TESTING-GUIDE.md](MANUAL-TESTING-GUIDE.md) — it walks you through everything.

**Step 2 — Prepare your test cases (before dev is done)**
- Open [CHECKLIST.md](CHECKLIST.md) → complete the Manual Testing section
- Copy [test-cases/TEMPLATE.md](test-cases/TEMPLATE.md) → rename to your feature
- Fill in test cases from the PRD
- See [test-cases/example/login-feature.md](test-cases/example/login-feature.md) as a reference

**Step 3 — Execute tests (when dev is ready)**
- Go through each test case manually in the browser
- Fill in "Actual Result" and set a Status for each
- See [MANUAL-TESTING-GUIDE.md](MANUAL-TESTING-GUIDE.md) for what each status means

**Step 4 — Report bugs**
- Copy [test-cases/BUG-REPORT.md](test-cases/BUG-REPORT.md) for each failed test
- Fill it in and paste into Asana as a new task
- See [test-cases/example/bug-report-example.md](test-cases/example/bug-report-example.md) as a reference

---

## Phase 2 — Automation (Technical staff only)

Run automated E2E and API tests with Playwright. Failed tests auto-create Asana tasks.

### Setup
```bash
npm install
npx playwright install
cp .env.example .env
# Fill in .env with real values
```

### Run tests
```bash
npm test                  # all tests
npm run test:e2e          # browser tests only
npm run test:api          # API tests only
npm run test:headed       # run with visible browser
npm run report            # open HTML report
```

### Asana integration test
```bash
node utils/asana.js --test
```

### Environment variables
See [.env.example](.env.example) — copy to `.env` and fill in all values before running.

---

## Folder Structure

```
├── README.md                      ← you are here
├── MANUAL-TESTING-GUIDE.md        ← QA process guide (start here)
├── CHECKLIST.md                   ← what to prepare before testing
├── .env.example                   ← automation config (technical use)
├── package.json
├── playwright.config.js
│
├── test-cases/
│   ├── TEMPLATE.md                ← blank test case template (copy per feature)
│   ├── BUG-REPORT.md              ← bug report template (copy per bug)
│   └── example/
│       ├── login-feature.md       ← filled test case example
│       └── bug-report-example.md  ← filled bug report example
│
├── tests/                         ← automated test scripts (technical)
│   ├── e2e/
│   └── api/
│
├── utils/                         ← automation helpers (technical)
│   ├── asana.js
│   └── reporter.js
│
└── reports/                       ← test output from automation runs
```

---

## Using This Template for a New Project

1. Copy this entire folder and rename it to your project name
2. Delete contents of `test-cases/example/` (keep the folder)
3. Delete contents of `tests/e2e/` and `tests/api/` (keep the folders)
4. Start from [MANUAL-TESTING-GUIDE.md](MANUAL-TESTING-GUIDE.md)

---

## Conventions

- One markdown file per **feature** in `test-cases/`
- Test case IDs: `TC-[FEATURE]-[NUMBER]` — e.g. `TC-LOGIN-001`
- Bug IDs: `BUG-[FEATURE]-[NUMBER]` — e.g. `BUG-LOGIN-001`
- Asana task title format: `[BUG] BUG-LOGIN-001 — Short description`

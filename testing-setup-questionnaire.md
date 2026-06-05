# Testing Setup Questionnaire

Answer each question below. Delete options that don't apply or write your own answer.

---

## 1. Web Application Type

What kind of app are you testing?
answer: normal human testing to verify if app or web service is usageble for user or not 

- [ ] Laravel + Blade (server-rendered)
- [ ] Laravel API + Frontend SPA (Vue / React / etc.)
- [ ] Pure API (no frontend)
- [ ] Other: ___

---

## 2. Frontend Stack

What frontend does the app use?
doesnot matter since we just a qa not a dev ?
- [ ] Blade templates (no JS framework)
- [ ] Vue.js
- [ ] React
- [ ] Other: ___
- [ ] No frontend (API only)

---

## 3. Test Types Needed

Which types of tests do you want to automate? (check all that apply)
e2e testing/brower tests and api tests.
- [ ] E2E / browser tests (simulate real user clicks and navigation)
- [ ] API tests (test endpoints directly)
- [ ] Unit tests (test individual functions/classes)
- [ ] Not sure — need recommendation

---

## 4. Test Tools Preference

Do you have a preferred tool, or should I recommend one?
any tools that get the job done.
- [ ] Playwright
- [ ] Cypress
- [ ] Pest (PHP)
- [ ] PHPUnit
- [ ] Postman / Newman (API)
- [ ] No preference — recommend for me

---

## 5. Test Case Planning

How do you currently write your test cases before testing?
yes write in excel

- [ ] Google Sheets / Excel
- [ ] Notion / Confluence
- [ ] Plain text / markdown
- [ ] No standard format yet — need a template
- [ ] Other: ___

---

## 6. Bug Tracking

Where do you create tasks when bugs are found?
use Asana

- [ ] Jira
- [ ] Linear
- [ ] GitHub Issues
- [ ] Trello
- [ ] Notion
- [ ] Other: ___

---

## 7. CI/CD Integration

Do you want tests to run automatically on code push?
not now just dump the test into file and we will check
- [ ] Yes — GitHub Actions
- [ ] Yes — GitLab CI
- [ ] Yes — other: ___
- [ ] No — run tests manually only

---

## 8. Priority

What do you need most urgently?

- [yes ] A test case planning template (write tests before dev is done)
- [ yes] A test automation framework setup (run tests when dev is ready)
- [ ] Both
- [ ] Not sure

---

## 9. App Description (optional but helpful)

Briefly describe the web app you're testing:
will apply to multiple project but this will be serve as a template for other qa too.
> (e.g. "A SaaS HR system with employee management, leave requests, and payroll")

___

---

## 10. Anything Else?

Any constraints, preferences, or context I should know?
think of us as a real whitelist user that need to test the product before out in the market.
___
my question what do you think are the essestial key to do this like you need a broswer endpoint of the product host so you can start testing. PRD? to verify the logic and connection to Asana to auto create tasks? and what else do you think ?
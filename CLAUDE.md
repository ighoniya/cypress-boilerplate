# Cypress Boilerplate - Standardization Guide

---

## Project Structure

`cypress/integration/{project}/{feature}.feature` - BDD tests
`cypress/support/pages/{project}/{page}.page.js` - Page objects
`cypress/support/step_definitions/{project}/{page}.step.js` - Step definitions
`cypress/support/language/{en,...}.json` - Translations
`cypress/fixtures/credentials/{env}/{type}.json` - Test data
`cypress/support/exclude/{env}/` - Environment exclusions
`cypress/support/helper/` - Helper functions

---

## Language Format

**Pattern:** `{project}.{page_name}.{element}` (page uses underscore)

```json
{ "saucedemo": { "login_page": { "title": "Swag Labs" } } }
```

**Usage:** `getText('saucedemo', 'login_page', 'title')`

---

## Page Objects

**File:** `{page}.page.js` | **Class:** `{PageName}Page`

```javascript
export class LoginPage {
  elements = { usernameField: "[data-test='username']" };
  navigate(path = "") {
    cy.visit(`${Cypress.env("SAUCE_BASE_URL")}/${path}`);
  }
}
```

---

## Step Definitions

**Include project name in step description**

```javascript
import { Given, When } from "@badeball/cypress-cucumber-preprocessor";
Given("I navigate to the login page of Saucedemo", () => loginPage.navigate());
When("I log in with the {string} account on Saucedemo", (accountKey) => {
  const creds = getUserCredentials("saucedemo", accountKey);
  loginPage.doLogin(creds.username, creds.password);
});
```

---

## Credentials & Environment

**Structure:** `cypress/fixtures/credentials/{env}/{type}.json`

```json
{ "saucedemo": { "main": { "username": "...", "password": "***" } } }
```

**Usage:** `getUserCredentials(project, userKey)` → `{ username, password }`
**Env:** `CYPRESS_environment=staging` | Default: `staging`

---

## Key Helpers

`getText(project, page_name, key)` - Get localized text
`getUserCredentials(project, userKey)` - Get `{ username, password }`
`loadCredentials(credentialType)` - Load credentials into cache
`setLanguage(lang)` - Set language
`stateStore[key] = value` - Share data across sequential scenarios
`executeQuery(project, dbKey, sql, params)` - Execute SQL query

---

## Test Commands

`npm run cy:open` - UI mode (default) | `npm run cy:open-stag` - Staging | `npm run cy:open-prod` - Production

---

## Workflow

`.feature` → `.page.js` → `.step.js` → `npm run cy:open`

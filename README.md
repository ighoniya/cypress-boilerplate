# Cypress Test Automation Boilerplate

[![Cypress](https://img.shields.io/badge/Cypress-15.12-blue)](https://www.cypress.io)
[![BDD](https://img.shields.io/badge/BDD-Gherkin-orange)](https://cucumber.io/docs/gherkin/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org)

A standardized Cypress test automation framework for E2E testing using BDD with Page Object Model pattern.

---

## Recommended VSCode Extensions

Install these extensions for better productivity:

| Extension | Purpose | Install |
|-----------|---------|---------|
| `alexkrechik.cucumberautocomplete` | Gherkin syntax highlighting and autocomplete | [Link](https://marketplace.visualstudio.com/items?itemName=alexkrechik.cucumberautocomplete) |
| `dbaeumer.vscode-eslint` | ESLint for code quality (optional) | [Link](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) |

---

## Quick Start

```bash
# Install dependencies
npm install

# Run tests with UI mode (default environment)
npm run cy:open

# Run tests with staging environment
npm run cy:open-stag

# Run tests with production environment
npm run cy:open-prod
```

---

## Project Structure

```
cypress-boilerplate/
├── cypress/
│   ├── integration/{project}/           # BDD feature files
│   ├── support/
│   │   ├── pages/{project}/              # Page Object Models ({page}.page.js)
│   │   ├── step_definitions/{project}/   # Step definitions ({page}.step.js)
│   │   ├── language/{en,...}.json       # Translations
│   │   ├── helper/                       # Helper functions
│   │   ├── environment/.env              # Environment configuration
│   │   └── exclude/{env}/                # Environment-specific exclusions
│   └── fixtures/
│       └── credentials/{env}/             # Test data (gitignored)
```

---

## Test Commands

| Command | Description |
|---------|-------------|
| `npm run cy:open` | Open Cypress Test Runner (default environment) |
| `npm run cy:open-stag` | UI mode on staging |
| `npm run cy:open-prod` | UI mode on production |

---

## Workflow

1. **Write feature file** in `cypress/integration/{project}/{feature}.feature`
2. **Create page object** in `cypress/support/pages/{project}/{page}.page.js`
3. **Implement steps** in `cypress/support/step_definitions/{project}/{page}.step.js`
4. **Run tests:** `npm run cy:open` (default), `npm run cy:open-stag` (staging), or `npm run cy:open-prod` (production)

---

## Example Feature File

```gherkin
@sequence
Feature: Login with sequence

  Scenario: User logs in with valid credentials on Saucedemo
    Given I navigate to the login page of Saucedemo
    Then the login page of Saucedemo is displayed
    When I log in with the "main" account on Saucedemo
    Then I am redirected to the inventory page of Saucedemo

  Scenario: User adds product to cart on Saucedemo
    Given I am logged in to Saucedemo
    When I add the first product to cart
    Then the cart badge shows 1 item
```

---

## Excluding Tests by Environment

Exclude tests from running in specific environments by configuring exclusion patterns in `cypress/support/exclude/{env}/{project}.json`:

```json
{
  "exclude": [
    "cypress/integration/saucedemo/example-exclude/login.feature",
    "cypress/integration/practise/**"
  ]
}
```

### Patterns

| Pattern | Excludes |
|---------|----------|
| `cypress/integration/saucedemo/login.feature` | Specific file |
| `cypress/integration/saucedemo/example-exclude` | All files in folder |
| `cypress/integration/practise/**` | All files recursively |
| `cypress/integration/**` | All tests |

### Usage

```bash
npm run cy:open-stag  # Uses staging exclusions
npm run cy:open-prod  # Uses production exclusions
```

---

## @sequence Tag Behavior

The `@sequence` tag controls how scenarios in a feature file execute:

### With `@sequence`
- Scenarios run **sequentially** (one after another)
- If scenario 3 of 10 fails, scenarios 4-10 **will NOT run** (fail-fast)
- Failed scenarios show as "failed", skipped scenarios show as "pending"
- Use when scenarios depend on each other or share data via `stateStore`

### Without `@sequence`
- Scenarios run in **parallel** (multiple at same time)
- All scenarios run regardless of failures
- Better for independent, isolated test cases

### How It Works

1. Add `@sequence` tag to your feature file
2. The `make-serial.js` helper enforces sequential execution with fail-fast behavior
3. Share data across scenarios using `stateStore[key] = value`

---

## Database Integration

Execute SQL queries directly from tests using the database helper:

```javascript
import { executeQuery } from '../../helper/database';

// Execute query with parameters
executeQuery('saucedemo', 'test_db', 'SELECT * FROM users WHERE id = ?', [userId])
  .then((results) => {
    cy.log('User data:', results);
  });
```

Database credentials are configured in `cypress/fixtures/credentials/{env}/database.json`.

---

## Internationalization

Support multiple languages using the translation helper:

```javascript
import { getText, setLanguage } from '../../helper/locales';

// Set language
setLanguage('en');

// Get translated text
const title = getText('saucedemo', 'login_page', 'title');
```

Translation files are located in `cypress/support/language/{lang}.json`.

---

## Test Reports

Cypress generates comprehensive test reports including:

- **Screenshots** captured on failure
- **Videos** of test execution (configurable)
- **Test results** in the Cypress dashboard
- **Console logs** and error messages

Access reports via Cypress Test Runner or configure custom reporters.

---

## Documentation

For complete standardization guide, conventions, and examples, see **[CLAUDE.md](./CLAUDE.md)**

---

## License

ISC

# Cypress Test Automation Boilerplate

[![Cypress](https://img.shields.io/badge/Cypress-15.12-blue)](https://www.cypress.io)
[![BDD](https://img.shields.io/badge/BDD-Gherkin-orange)](https://cucumber.io/docs/gherkin/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org)

A standardized Cypress test automation framework for E2E testing using BDD with Page Object Model pattern.

---

## Recommended VSCode Extensions

Install these extensions for better productivity:

| Extension                          | Purpose                                      | Install                                                                                      |
| ---------------------------------- | -------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `alexkrechik.cucumberautocomplete` | Gherkin syntax highlighting and autocomplete | [Link](https://marketplace.visualstudio.com/items?itemName=alexkrechik.cucumberautocomplete) |

---

## Prerequisites

### System Requirements

- Node.js (v18 or higher)
- npm

### Installation

```bash
# Install npm dependencies
npm install
```

---

## Quick Start

```bash
# Open Cypress Test Runner (default environment)
npm run cy:open

# Run tests with staging environment
npm run cy:open-stag

# Run tests with production environment
npm run cy:open-prod
```

---

## Environment Configuration

Available environments:

- `staging` - For staging environment testing
- `production` - For production environment testing

```bash
# Use staging environment
npm run cy:open-stag

# Use production environment
npm run cy:open-prod
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

| Pattern                                         | Excludes              |
| ----------------------------------------------- | --------------------- |
| `cypress/integration/saucedemo/login.feature`   | Specific file         |
| `cypress/integration/saucedemo/example-exclude` | All files in folder   |
| `cypress/integration/practise/**`               | All tests recursively |

Supported files: `.feature`

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
- If scenario 3 of 10 fails, scenarios 4-10 **will NOT run**
- Failed scenarios show as "failed", skipped scenarios show as "pending"
- Team focuses on fixing failures before proceeding
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

## Test Reports

Cypress generates comprehensive test reports including:

- **Screenshots** captured on failure
- **Videos** of test execution
- **Test results** in the Cypress Test Runner
- **Console logs** and error messages

---

## Documentation

- [Cypress Documentation](https://docs.cypress.io)
- [Cucumber Gherkin Syntax](https://cucumber.io/docs/gherkin/)
- [Cypress Cucumber Preprocessor](https://github.com/badeball/cypress-cucumber-preprocessor)

---

## License

ISC

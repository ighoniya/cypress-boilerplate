import { defineConfig } from "cypress";
import setupNodeEvents from "./cypress/plugins/index.js";

export default defineConfig({
  e2e: {
    setupNodeEvents,
    specPattern: "cypress/integration/**",
    experimentalRunAllSpecs: true,
    supportFile: "cypress/support/commands.js",
    stepDefinitions: "cypress/support/step_definitions/**/*.js",
    excludeSpecPattern: ["cypress/integration/example/**"],
  },
  env: {
    environment: "",
  },
});

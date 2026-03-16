import { defineConfig } from "cypress";
import setupNodeEvents from "./cypress/plugins/index.js";

export default defineConfig({
  e2e: {
    setupNodeEvents,
    specPattern: "**/*.feature",
    stepDefinitions: "cypress/support/step_definitions/**/*.js",
  },
});

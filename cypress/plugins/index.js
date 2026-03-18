import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import createEsbuildPlugin from "@badeball/cypress-cucumber-preprocessor/esbuild";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import dotenv from "dotenv";
import { resolve } from "path";
import fs from "fs";
import mysql from "mysql";

// Global sequence state in plugin context
let sequenceState = {
  hasSequenceTag: false,
  sequenceFailed: false,
  currentFile: null,
  allScenarios: [],
  scenarioIndex: 0,
  failedScenarioIndex: -1,
};

export default async function (on, config) {
  // Load environment variables from .env file
  let envConfig;
  const specifiedEnv = config.env.environment;

  if (specifiedEnv) {
    // Try loading from .env.{environment} if specified
    const envPath = resolve(
      process.cwd(),
      `cypress/support/environment/.${specifiedEnv}.env`,
    );
    envConfig = dotenv.config({ path: envPath });
    if (envConfig.error) {
      console.warn(
        `Warning: Could not load .env.${specifiedEnv}, falling back to .env`,
      );
      envConfig = dotenv.config({
        path: resolve(process.cwd(), "cypress/support/environment/.env"),
      });
    }
  } else {
    // Load from default .env if no environment specified
    envConfig = dotenv.config({
      path: resolve(process.cwd(), "cypress/support/environment/.env"),
    });
  }

  if (!envConfig.error) {
    // Merge .env variables into config.env
    config.env = { ...config.env, ...envConfig.parsed };
  } else {
    console.warn(`Warning: Could not load any .env file`);
  }

  await addCucumberPreprocessorPlugin(on, config);

  on("file:preprocessor", (file) => {
    // Only apply Cucumber preprocessor to .feature files
    if (file.filePath.endsWith(".feature")) {
      return createBundler({
        external: ["@badeball/cypress-cucumber-preprocessor/steps"],
        plugins: [createEsbuildPlugin(config)],
      })(file);
    }
    // Use default bundler for non-feature files (.js, etc.)
    return createBundler()(file);
  });

  // Add Cypress tasks for sequence fail-fast
  on("task", {
    checkSequenceFile(filePath) {
      const fullPath = resolve(process.cwd(), filePath);
      if (!fs.existsSync(fullPath)) {
        return { hasSequenceTag: false, scenarios: [] };
      }

      const content = fs.readFileSync(fullPath, "utf8");
      const lines = content.split("\n");
      let hasSequenceTag = false;
      const scenarios = [];

      // Check if @sequence tag appears before the Feature line (can be with other tags)
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Check for @sequence tag (even if mixed with other tags)
        if (line.includes("@sequence")) {
          // Look for Feature line in the next few lines
          for (let j = i; j < Math.min(i + 10, lines.length); j++) {
            const nextLine = lines[j].trim();
            if (nextLine.startsWith("Feature:")) {
              hasSequenceTag = true;
              break;
            }
          }
        }

        // Collect all scenario names in the feature
        if (
          line.startsWith("Scenario:") ||
          line.startsWith("Scenario Outline:")
        ) {
          const scenarioName = line.replace(/^Scenario[^:]*:\s*/, "");
          scenarios.push(scenarioName);
        }
      }
      return { hasSequenceTag, scenarios };
    },

    setSequenceState(state) {
      Object.assign(sequenceState, state);
      return sequenceState;
    },

    getSequenceState() {
      return sequenceState;
    },
  });

  return config;
}

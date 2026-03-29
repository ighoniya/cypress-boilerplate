import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import createEsbuildPlugin from "@badeball/cypress-cucumber-preprocessor/esbuild";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import path from "path";
import fs from "fs";
import mysql from "mysql";
import { loadYamlConfig } from "../support/helper/env.js";

// Global sequence state in plugin context
let sequenceState = {
  hasSequenceTag: false,
  sequenceFailed: false,
  currentFile: null,
  allScenarios: [],
  scenarioIndex: 0,
  failedScenarioIndex: -1,
};

/**
 * Load exclude patterns from environment-specific exclude directory.
 * Reads all JSON files in cypress/support/exclude/{environment}/ and merges
 * their exclude arrays with the base patterns.
 *
 * @param {string} environment - The environment name (e.g., 'staging', 'production')
 * @param {Array<string>} basePatterns - Base exclude patterns from config
 * @returns {Array<string>} Merged array of exclude patterns
 */
function loadExcludePatterns(environment, basePatterns = []) {
  const excludeDir = path.resolve(
    process.cwd(),
    `cypress/support/exclude/${environment}`,
  );

  if (!fs.existsSync(excludeDir)) {
    console.log(`Exclude directory not found: ${excludeDir}`);
    return basePatterns;
  }

  const excludePatterns = [...basePatterns];

  const files = fs.readdirSync(excludeDir);
  for (const file of files) {
    if (file.endsWith(".json")) {
      const filePath = path.join(excludeDir, file);
      try {
        const content = JSON.parse(fs.readFileSync(filePath, "utf8"));
        if (content.exclude && Array.isArray(content.exclude)) {
          excludePatterns.push(...content.exclude);
          console.log(
            `Loaded ${content.exclude.length} exclude pattern(s) from ${file}`,
          );
        }
      } catch (error) {
        console.warn(`Warning: Failed to parse ${filePath}: ${error.message}`);
      }
    }
  }

  return excludePatterns;
}

export default async function (on, config) {
  // Load environment variables from YAML file using shared function
  const specifiedEnv = process.env.ENV;
  let yamlConfig = {};

  try {
    yamlConfig = loadYamlConfig(specifiedEnv);
  } catch (error) {
    console.warn(`Warning: Could not load YAML config: ${error.message}`);
  }

  if (Object.keys(yamlConfig).length > 0) {
    // Merge YAML variables into config.env
    config.env = { ...config.env, ...yamlConfig };
  } else {
    console.warn(`Warning: Could not load any YAML config file`);
  }

  // Load environment-specific exclude patterns and merge with base patterns
  const environment = specifiedEnv || "staging";
  config.excludeSpecPattern = loadExcludePatterns(
    environment,
    config.excludeSpecPattern,
  );

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
      const fullPath = path.resolve(process.cwd(), filePath);
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

    // Execute SQL query (wrapped in Promise for classic mysql callback)
    dbQuery({ project, dbKey, sql, params = [], environment = "staging" }) {
      return new Promise((resolve, reject) => {
        const credentialPath = path.resolve(
          process.cwd(),
          `cypress/fixtures/credentials/${environment}/database.json`,
        );

        if (!fs.existsSync(credentialPath)) {
          return reject(
            new Error(`Credential file not found: ${credentialPath}`),
          );
        }

        const credentials = JSON.parse(fs.readFileSync(credentialPath, "utf8"));
        const dbConfig = credentials[project]?.[dbKey];

        if (!dbConfig) {
          return reject(
            new Error(`Database config not found for ${project}.${dbKey}`),
          );
        }

        // Create new connection for each query (as per user requirement)
        const connection = mysql.createConnection(dbConfig);

        connection.connect((err) => {
          if (err) {
            return reject(err);
          }

          connection.query(sql, params, (error, results, _fields) => {
            connection.end(); // Always close connection
            if (error) {
              return reject(error);
            }
            resolve(results);
          });
        });
      });
    },

    // Test database connection
    dbTestConnection({ project, dbKey }) {
      return new Promise((resolve, reject) => {
        const environment = process.env.ENV || "staging";
        const credentialPath = path.resolve(
          process.cwd(),
          `cypress/fixtures/credentials/${environment}/database.json`,
        );
        const credentials = JSON.parse(fs.readFileSync(credentialPath, "utf8"));
        const dbConfig = credentials[project]?.[dbKey];

        if (!dbConfig) {
          return reject(
            new Error(`Database config not found for ${project}.${dbKey}`),
          );
        }

        const connection = mysql.createConnection(dbConfig);

        connection.connect((err) => {
          if (err) {
            return reject(err);
          }
          connection.end();
          resolve({ success: true, message: "Connection successful" });
        });
      });
    },
  });

  return config;
}

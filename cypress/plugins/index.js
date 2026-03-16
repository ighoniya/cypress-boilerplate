import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import createEsbuildPlugin from "@badeball/cypress-cucumber-preprocessor/esbuild";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import dotenv from "dotenv";
import { resolve } from "path";

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
      envConfig = dotenv.config({ path: resolve(process.cwd(), "cypress/support/environment/.env") });
    }
  } else {
    // Load from default .env if no environment specified
    envConfig = dotenv.config({ path: resolve(process.cwd(), "cypress/support/environment/.env") });
  }

  if (!envConfig.error) {
    // Merge .env variables into config.env
    config.env = { ...config.env, ...envConfig.parsed };
  } else {
    console.warn(`Warning: Could not load any .env file`);
  }

  await addCucumberPreprocessorPlugin(on, config);

  on(
    "file:preprocessor",
    (file) => {
      // Only apply Cucumber preprocessor to .feature files
      if (file.filePath.endsWith(".feature")) {
        return createBundler({
          external: ["@badeball/cypress-cucumber-preprocessor/steps"],
          plugins: [createEsbuildPlugin(config)],
        })(file);
      }
      // Use default bundler for non-feature files (.js, etc.)
      return createBundler()(file);
    },
  );

  return config;
}

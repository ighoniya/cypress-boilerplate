import { fileURLToPath } from "url";
import fs from "fs";
import path from "path";
import yaml from "js-yaml";

// Polyfill __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Load YAML config file for the specified environment.
 * This function is reused by both env.js (test code) and plugins/index.js (plugin code).
 *
 * @param {string|null} envOverride - Override environment (if null, uses process.env.ENV)
 * @returns {Object} Parsed YAML config
 */
export const loadYamlConfig = (envOverride = null) => {
  const env = envOverride ?? process.env.ENV;
  const envFile = env ? `.env.${env}.yaml` : ".env.yaml";
  const configPath = path.resolve(__dirname, "../environment", envFile);

  console.log(`[env.js] Loading config from: ${envFile}`);

  const content = fs.readFileSync(configPath, "utf8");
  return yaml.load(content);
};

// Load config from YAML file using the shared function
const config = loadYamlConfig();

import { getCredentials } from "./credentials.js";

// Get the environment from Cypress env
const getEnvironment = () => {
  return Cypress.env("environment") || "staging";
};

// Execute a SQL query using database credentials
export const executeQuery = (project, dbKey, sql, params = []) => {
  return cy.task('dbQuery', {
    project,
    dbKey,
    sql,
    params,
    environment: getEnvironment()
  });
};

// Get database configuration for a project and database key
export const getDbConfig = (project, dbKey) => {
  const credentials = getCredentials(project, "database");
  return credentials[dbKey] || {};
};

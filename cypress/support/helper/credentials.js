import { stateStore } from "./locales.js";

// Get the environment from Cypress env (staging or production)
const getEnvironment = () => {
  return Cypress.env("environment") || "staging";
};

// Load credentials from fixture (call this in before() or setup)
export const loadCredentials = (credentialType = "account") => {
  const environment = getEnvironment();
  const fixturePath = `credentials/${environment}/${credentialType}.json`;
  const cacheKey = `credentials_${environment}_${credentialType}`;

  return cy.fixture(fixturePath).then((data) => {
    stateStore[cacheKey] = data;
    return data;
  });
};

// Get all credentials for a project
export const getCredentials = (project, credentialType = "account") => {
  const environment = getEnvironment();
  const cacheKey = `credentials_${environment}_${credentialType}`;
  const credentials = stateStore[cacheKey] || {};
  return credentials[project] || {};
};

// Get specific user credentials by key
export const getUserCredentials = (
  project,
  userKey,
  credentialType = "account",
) => {
  const credentials = getCredentials(project, credentialType);
  return credentials[userKey] || {};
};

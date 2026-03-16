import enLang from "../language/en.json";

// State store - simple object to hold shared data across scenarios/steps
export const stateStore = {};

// Language constants
export const languages = {
  en: enLang,
};

// Dynamic language getter - always checks current state store
export const getCurrentLanguage = () => {
  return stateStore["language"] || "en";
};

// Dynamic language data getter
export const getLangData = () => {
  return languages[getCurrentLanguage()];
};

// Set language
export const setLanguage = (lang) => {
  stateStore["language"] = lang;
};

// Get translation text for a specific project, page, and key
export const getText = (project, page, key) => {
  const langData = getLangData();
  return langData?.[project]?.[page]?.[key] || "";
};

// Get all translations for a specific project and page
export const getPageTranslations = (project, page) => {
  const langData = getLangData();
  return langData?.[project]?.[page] || {};
};

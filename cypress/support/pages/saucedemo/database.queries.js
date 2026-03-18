import { executeQuery } from "../../helper/database.js";

// Saucedemo project database constants
const PROJECT = "saucedemo";
const DB_KEY = "test_db";

// Query functions for saucedemo database
export const saucedemoQueries = {
  // Get user by email
  getUserByEmail: (email) => {
    return executeQuery(
      PROJECT,
      DB_KEY,
      "SELECT * FROM users WHERE email = ?",
      [email],
    );
  },

  // Get user by similiar phone
  getUserBySimiliarPhone: (phone) => {
    return executeQuery(
      PROJECT,
      DB_KEY,
      "SELECT * FROM users WHERE phone like ?",
      [`%${phone}`],
    );
  },

  // Custom query execution
  execute: (sql, params = []) => {
    return executeQuery(PROJECT, DB_KEY, sql, params);
  },
};

/// <reference types="cypress" />

import { saucedemoQueries } from "../../../support/pages/saucedemo/database.queries.js";

describe("Saucedemo Database Connection", () => {
  it("should query user by email", () => {
    saucedemoQueries.getUserByEmail("xx").then((results) => {
      cy.log(`User by email: ${JSON.stringify(results, null, 2)}`);
      expect(results).to.be.an("array");
      if (results.length > 0) {
        expect(results[0]).to.have.property("email");
      }
    });
  });

  it("should query user by similar phone number", () => {
    saucedemoQueries.getUserBySimiliarPhone("00").then((results) => {
      cy.log(`User by similar phone: ${JSON.stringify(results, null, 2)}`);
      expect(results).to.be.an("array");
      if (results.length > 0) {
        expect(results[0]).to.have.property("username");
      }
    });
  });

  it("should execute custom query", () => {
    saucedemoQueries
      .execute("SELECT COUNT(*) as total FROM users where email = 'xx'")
      .then((results) => {
        cy.log(`Total users: ${JSON.stringify(results, null, 2)}`);
        expect(results).to.be.an("array");
        if (results.length > 0) {
          expect(results[0]).to.have.property("total");
        }
      });
  });
});

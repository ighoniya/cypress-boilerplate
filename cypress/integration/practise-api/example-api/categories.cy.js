import chaiJsonSchema from "chai-json-schema";
import { categoriesSchema } from "../../../support/schema/practise/categories.js";

chai.use(chaiJsonSchema);

describe("Biller Categories API", () => {
  const BASE_URL = Cypress.env("PRACTISE_BASE_URL");
  const API_KEY = Cypress.env("PRACTISE_API_KEY");

  it("GET /v1/billers/categories - validate response and JSON schema", () => {
    cy.request({
      method: "GET",
      url: `${BASE_URL}/v1/billers/categorie`,
      headers: {
        accept: "application/json",
        "X-API-Key": API_KEY,
        "X-Request-Id": "swagger-ftqyjkacx",
      },
    }).then((response) => {
      // Validate status code
      expect(response.status).to.equal(200);

      // Validate JSON schema
      expect(response.body).to.be.jsonSchema(categoriesSchema);
    });
  });

  it("GET /v1/billers/categories - validate response and JSON schema", () => {
    cy.request({
      method: "GET",
      url: `${BASE_URL}/v1/billers/categories`,
      headers: {
        accept: "application/json",
        "X-API-Key": API_KEY,
        "X-Request-Id": "swagger-ftqyjkacx",
      },
    }).then((response) => {
      // Validate status code
      expect(response.status).to.equal(200);

      // Validate JSON schema
      expect(response.body).to.be.jsonSchema(categoriesSchema);
    });
  });
});

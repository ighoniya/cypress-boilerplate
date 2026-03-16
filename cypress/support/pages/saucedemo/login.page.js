export class LoginPage {
  elements = {
    usernameField: "[data-test='username']",
    passwordField: "[data-test='password']",
  };

  navigate(path = "") {
    cy.visit(Cypress.env("SAUCE_BASE_URL") + "/" + path);
  }

  writeUsername(name) {
    cy.get(this.elements.usernameField).type(name);
  }

  writePassword(password) {
    cy.get(this.elements.passwordField).type(password);
  }
}

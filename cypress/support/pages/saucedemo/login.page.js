import { getText } from "../../helper/locales.js";

const project = "saucedemo";
const page = "login_page";

export class LoginPage {
  elements = {
    titlePage: ".login_logo",
    usernameField: "[data-test='username']",
    passwordField: "[data-test='password']",
    loginButton: "[data-test='login-button']",
  };

  navigate(path = "") {
    cy.visit(`${Cypress.env("SAUCE_BASE_URL")}/${path}`);
  }

  validateLoginPage() {
    const title = getText(project, page, "title");
    cy.get(this.elements.titlePage).contains(title).should("be.visible");
  }

  writeUsername(username) {
    cy.get(this.elements.usernameField).type(username);
  }

  writePassword(password) {
    cy.get(this.elements.passwordField).type(password);
  }

  doLogin(username, password) {
    this.writeUsername(username);
    this.writePassword(password);
    cy.get(this.elements.loginButton).click();
  }
}

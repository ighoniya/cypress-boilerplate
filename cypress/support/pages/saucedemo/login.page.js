const path = "";

export class LoginPage {
  navigate() {
    cy.visit("https://www.saucedemo.com/" + path);
  }
}

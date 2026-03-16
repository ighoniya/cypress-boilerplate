import { Given, When, Then, Before } from "@badeball/cypress-cucumber-preprocessor";
import { LoginPage } from "../../pages/saucedemo/login.page";
import { getUserCredentials, loadCredentials } from "../../helper/credentials";
import { stateStore } from "../../helper/locales";

const loginPage = new LoginPage();
const project = "saucedemo";

Before(() => {
  loadCredentials();
});

Given("I navigate to the login page of Saucedemo", () => {
  loginPage.navigate();
});

Then("the login page of Saucedemo is displayed", () => {
  loginPage.validateLoginPage();
});

When("I log in with the {string} account on Saucedemo", (accountKey) => {
  const creds = getUserCredentials(project, accountKey);
  loginPage.doLogin(creds.username, creds.password);
});

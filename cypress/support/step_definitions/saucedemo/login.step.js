import {
  Given,
  When,
  Then,
} from "@badeball/cypress-cucumber-preprocessor";
import { LoginPage } from "../../pages/saucedemo/login.page";

const loginPage = new LoginPage();

Given("I navigate to login page of saucedemo", () => {
  loginPage.navigate();
});

import { Then } from "@badeball/cypress-cucumber-preprocessor";
import { InventoryPage } from "../../pages/saucedemo/inventory.page";

const inventory = new InventoryPage();

Then("I am redirected to the inventory page of Saucedemo", () => {
  inventory.validateInventoryPage();
});

import { getText } from "../../helper/locales.js";

const project = "saucedemo";
const page = "inventory_page";

export class InventoryPage {
  elements = {
    titlePage: "[data-test='title']",
  };

  validateInventoryPage() {
    const title = getText(project, page, "title");
    cy.get(this.elements.titlePage).contains(title).should("be.visible");
  }
}

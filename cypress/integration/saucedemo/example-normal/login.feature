Feature: Login

  Scenario: User logs in with valid credentials on Saucedemo
    Given I navigate to the login page of Saucedemo
    Then the login page of Saucedemo is displayed
    When I log in with the "main1" account on Saucedemo
    Then I am redirected to the inventory page of Saucedemo

  Scenario: User logs in with valid credentials on Saucedemo 2
    Given I navigate to the login page of Saucedemo
    Then the login page of Saucedemo is displayed
    When I log in with the "main" account on Saucedemo
    Then I am redirected to the inventory page of Saucedemo
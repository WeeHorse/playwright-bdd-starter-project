Feature: Hot deal

  As a consumer I like a hot deal to I can feel rich

  Scenario: Locate the hot deal
    Given I am at the 'locators' page
    When I choose 'France' in the countrySelect dropdown
    Then I see the hot deal


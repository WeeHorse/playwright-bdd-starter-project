Feature: Inloggning och registrering

  Scenario: En användare kan registrera sig
    Given att jag öppnar registreringssidan
    When jag skriver ett unikt användarnamn i #username
    And jag skriver "Pass123!" i #password
    And jag skriver "Pass123!" i #confirmPassword
    And jag klickar på knappen "Register"
    Then ska jag se registreringsmeddelandet "Successfully registered, you can log in now."

  Scenario: En användare kan logga in med giltiga uppgifter
    Given att jag öppnar inloggningssidan
    When jag skriver "practice" i #username
    And jag skriver "SuperSecretPassword!" i #password
    And jag klickar på knappen "Login"
    Then ska jag se inloggningsmeddelandet "You logged into a secure area!"
    And ska jag se knappen Logout

  Scenario: En användare får felmeddelande vid ogiltiga uppgifter
    Given att jag öppnar inloggningssidan
    When jag skriver "wrongUser" i #username
    And jag skriver "WrongPassword" i #password
    And jag klickar på knappen "Login"
    Then ska jag se inloggningsfel "Your password is invalid!"

  Scenario: En användare får felmeddelande vid ogiltigt lösenord
    Given att jag öppnar inloggningssidan
    When jag skriver "practice" i #username
    And jag skriver "WrongPassword" i #password
    And jag klickar på knappen "Login"
    Then ska jag se inloggningsfel "Your password is invalid!"
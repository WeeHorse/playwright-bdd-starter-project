Feature: Inloggning och registrering

  Scenario: En användare kan registrera sig
    Given att jag öppnar registreringssidan
    When jag registrerar en ny användare
    Then ska jag se registreringsmeddelandet "Successfully registered, you can log in now."

  Scenario: En användare kan logga in med giltiga uppgifter
    Given att jag öppnar inloggningssidan
    When jag loggar in med användarnamn "practice" och lösenord "SuperSecretPassword!"
    Then ska jag se inloggningsmeddelandet "You logged into a secure area!"
    And ska jag se knappen Logout

  Scenario: En användare får felmeddelande vid ogiltiga uppgifter
    Given att jag öppnar inloggningssidan
    When jag loggar in med användarnamn "wrongUser" och lösenord "WrongPassword"
    Then ska jag se inloggningsfel "Your password is invalid!"

  Scenario: En användare får felmeddelande vid ogiltigt lösenord
    Given att jag öppnar inloggningssidan
    When jag loggar in med användarnamn "practice" och lösenord "WrongPassword"
    Then ska jag se inloggningsfel "Your password is invalid!"
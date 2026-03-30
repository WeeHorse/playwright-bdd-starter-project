Feature: Starta ett spel

    Scenario: En spelare registrerar sig
        Given att jag är på startsidan
        When jag registrerar mig som spelare med namnet "Benjamin"
        Then ska jag se Playing as: Benjamin
        And ser Create New Game

    Scenario: En registrerad spelare startar ett nytt spel
        Given att jag ser "Create New Game"
        When jag klickar på knappen Create Game
        Then ska jag se ett Game ID


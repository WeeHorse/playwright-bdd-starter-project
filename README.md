# Playwright BDD-testprojekt – Från scratch

Den här guiden beskriver steg för steg hur du skapar ett automatiserat testprojekt med [Playwright](https://playwright.dev/) och BDD (Behaviour-Driven Development) med hjälp av [playwright-bdd](https://vitalets.github.io/playwright-bdd/).

### Dokumentation

* [Playwright](https://playwright.dev/docs/intro)
* [Playwright BDD](https://vitalets.github.io/playwright-bdd/)

### Om testprojektet

Projektet testar ett webbgränssnitt och är strukturerat med:
- **Gherkin-scenarion** (`.feature`-filer) för läsbara testbeskrivningar
- **Page Object Model** för att kapsla in sidinteraktioner
- **Stegdefinitioner** som kopplar Gherkin till Playwright-kod

---

## Förutsättningar

Se till att följande är installerat:

- [Node.js](https://nodejs.org/) (version 18 eller senare)
- npm (följer med Node.js)

---

## Hur skapar man ett testprojekt precis som detta?

_Du kan självklart återanvända just det här testprojektet, men om du vill lära dig / ha en guide till hur man sätter upp ett sånt här projekt så följ steg 1–6 nedan._

Steg 7–10 beskriver hur du implementerar själva testerna, och det behöver du veta även om du kopierar detta testprojektet – det är själva testarbetet som beskrivs där.

## Steg 1 – Skapa projektmappen

```bash
mkdir mitt-testprojekt
cd mitt-testprojekt
```

---

## Steg 2 – Initiera npm-projektet

```bash
npm init -y
```

Öppna `package.json` och lägg till `"type": "module"` för att använda ES-moduler (import/export):

```json
{
  "name": "mitt-testprojekt",
  "private": true,
  "type": "module"
}
```

---

## Steg 3 – Installera beroenden

```bash
npm install --save-dev @playwright/test playwright-bdd
```

Installera sedan Playwright-webbläsarna (Chromium räcker för en start):

```bash
npx playwright install chromium
```

---

## Steg 4 – Skapa mappstrukturen

Skapa följande struktur manuellt eller med kommandon:

```
e2e/
  ui/
    features/      ← Gherkin-scenarion (.feature)
    pages/         ← Page Object-klasser
    steps/         ← Stegdefinitioner
```

```bash
mkdir -p e2e/ui/features e2e/ui/pages e2e/ui/steps
```

---

## Steg 5 – Konfigurera Playwright

Skapa filen `playwright.config.js` i projektets rot:

```js
import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const uiTestDir = defineBddConfig({
  features: 'e2e/ui/features/**/*.feature',
  steps: ['e2e/ui/steps/**/*.js', 'e2e/ui/pages/**/*.js'],
  outputDir: '.features-gen/ui'
});

export default defineConfig({
  timeout: 30_000,
  expect: {
    timeout: 10_000
  },
  reporter: [['list', { open: 'always' }],['html', { open: 'on-failure' }]],
  use: {
    baseURL: 'https://demo.playwright.dev/todomvc',  // Ändra till din applikations URL, t ex http://localhost:5010 
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'ui',
      testDir: uiTestDir,
      use: {
        ...devices['Desktop Chrome']
      }
    }
  ]
});
```

**Viktigt:** `defineBddConfig` pekar ut var dina `.feature`-filer och stegdefinitioner finns samt anger en mapp (`outputDir`) dit playwright-bdd genererar körbara testfiler.

---

## Steg 6 – Lägg till npm-skript

Uppdatera `scripts`-sektionen i `package.json`. 

_Du behöver sällan alla script som finns här - listan är ganska komplett för att visa vilka olika verktyg och möjligheter som finns runt playwright._

```json
"scripts": {
  "test": "npm run test:ui",
  "bdd:gen": "bddgen",
  "test:ui": "npm run bdd:gen && playwright test --project=ui",
  "test:ui-mode": "npm run bdd:gen && playwright test --project=ui --ui",
  "test:headed": "npm run bdd:gen && playwright test --project=ui --headed",
  "test:debug": "npm run bdd:gen && playwright test --project=ui --debug",
  "test:pwdebug": "npm run bdd:gen && PWDEBUG=1 playwright test --project=ui",
  "test:pwdebug:win": "npm run bdd:gen && cross-env PWDEBUG=1 playwright test --project=ui",
  "test:codegen": "playwright codegen",
  "report": "playwright show-report"
}
```

* `bdd:gen` – Genererar körbara testfiler utifrån dina `.feature`-filer.
* `test:ui` – Genererar och kör testerna i headless-läge.
* `test:ui-mode` – Startar Playwright UI Mode för visuell testkörning.
* `test:headed` – Kör testerna med synlig webbläsare (bra vid felsökning).
* `test:debug` – Kör tester i debug-läge med stegvis exekvering och Inspector.
* `test:pwdebug` – Öppnar Playwright Inspector för att stega och inspektera selectors.
* `test:pwdebug:win` – Om inte `test:pwdebug` fungerar på din windows kan du köra den här specialhanteringen av miljövariabeln.
* `test:codegen` – Startar kodgenerator för att klicka fram selectors och testkod.
* `report` – Öppnar HTML-rapport med resultat från senaste testkörningen.

---

## Steg 7 – Skriv ett Gherkin-scenario

Skapa filen `e2e/ui/features/smoke.feature`:

```gherkin
Feature: Smoke

    Scenario: Startsidan går att öppna
        Given att jag öppnar startsidan
        Then ska jag se sidans titel innehåller "MinApplikation"
```

Gherkin-scenarion skrivs med nyckelorden **Feature**, **Scenario**, **Given**, **When** och **Then**. De är tekniskt sett ekvivalenta – nyckelorden väljs för läsbarhetens skull.

---

## Steg 8 – Skriva stegdefinitioner

Stegdefinitioner kopplar Gherkin-meningar till faktisk Playwright-kod.

Skapa filen `e2e/ui/steps/smoke.steps.js`:

```js
import { createBdd } from 'playwright-bdd';
const { Given, When, Then } = createBdd();

Given('att jag öppnar startsidan', async ({ page }) => {
    await page.goto('/');
});

Then('ska jag se sidans titel innehåller {string}', async ({ page }, expected) => {
    const title = await page.title();
    if (!title.includes(expected)) {
        throw new Error(`Expected title to include "${expected}" but got "${title}"`);
    }
});
```

**Tips:** `{string}` i steg-mönstret matchar en sträng inom citattecken i `.feature`-filen och skickas in som ett argument till funktionen.

---

## Steg 9 – Kör testerna

Se till att din applikation körs på den `baseURL` du konfigurerade, kör sedan:

```bash
npm test
```

För att se webbläsaren i realtid (praktiskt vid felsökning):

```bash
npm run test:headed
```

---

## Projektstruktur – Sammanfattning

```
mitt-testprojekt/
├── package.json              ← Projektets beroenden och skript
├── playwright.config.js      ← Playwright- och BDD-konfiguration
└── e2e/
    └── ui/
        ├── features/
        │   └── smoke.feature ← Gherkin-scenarion
        └── steps/
            └── smoke.steps.js ← Stegdefinitioner
```

---

## Vanliga kommandon

| Kommando | Beskrivning |
|---|---|
| `npm test` | Kör alla UI-tester |
| `npm run test:headed` | Kör tester med synlig webbläsare |
| `npm run bdd:gen` | Genererar om testfiler från `.feature`-filer |
| `npx playwright show-report` | Öppnar HTML-rapporten efter en testkörning |

---

## Felsökning

- **Tester hittar inga steg:** Kontrollera att sökvägarna i `playwright.config.js` under `steps` matchar var dina filer faktiskt ligger.
- **`baseURL` kan inte nås:** Se till att applikationen du testar är igång innan du kör testerna.
- **Genererade filer saknas:** Kör `npm run bdd:gen` manuellt och kontrollera att mappen `.features-gen/` skapas.
- **Webbläsare saknas:** Kör `npx playwright install` för att installera alla webbläsare.

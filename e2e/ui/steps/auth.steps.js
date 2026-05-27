import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Given, When, Then } = createBdd();

Given('att jag öppnar registreringssidan', async ({ page }) => {
  await page.goto('/register');
});

Given('att jag öppnar inloggningssidan', async ({ page }) => {
  await page.goto('/login');
});

When(/^jag skriver "([^"]*)" i (#[A-Za-z0-9_-]+)$/, async ({ page }, value, selector) => {
  await page.locator(selector).fill(value);
});

When('jag skriver ett unikt användarnamn i #username', async ({ page }) => {
  const username = `bdduser${Date.now()}`;
  await page.locator('#username').fill(username);
});

When('jag klickar på knappen {string}', async ({ page }, buttonName) => {
  await page.getByRole('button', { name: buttonName }).click();
});

Then('ska jag se registreringsmeddelandet {string}', async ({ page }, expectedMessage) => {
  await expect(page.getByRole('alert')).toContainText(expectedMessage);
});

Then('ska jag se inloggningsmeddelandet {string}', async ({ page }, expectedMessage) => {
  await expect(page.getByRole('alert')).toContainText(expectedMessage);
});

Then('ska jag se knappen Logout', async ({ page }) => {
  await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();
});

Then('ska jag se inloggningsfel {string}', async ({ page }, expectedError) => {
  await expect(page.getByRole('alert')).toContainText(expectedError);
});
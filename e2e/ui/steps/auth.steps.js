import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Given, When, Then } = createBdd();

Given('att jag öppnar registreringssidan', async ({ page }) => {
  await page.goto('/register');
});

Given('att jag öppnar inloggningssidan', async ({ page }) => {
  await page.goto('/login');
});

When('jag registrerar en ny användare', async ({ page }) => {
  const username = `bdduser${Date.now()}`;

  await page.getByLabel('Username').fill(username);
  await page.getByLabel('Password', { exact: true }).fill('Pass123!');
  await page.getByLabel('Confirm Password').fill('Pass123!');
  await page.getByRole('button', { name: 'Register' }).click();
});

When('jag loggar in med användarnamn {string} och lösenord {string}', async ({ page }, username, password) => {
  await page.getByLabel('Username').fill(username);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
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
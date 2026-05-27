import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Given, When, Then } = createBdd();

Given('I am at the {string} page', async ({ page }, path) => {
  await page.goto('/' + path);
});

When('I choose {string} in the countrySelect dropdown', async ({ page }, country) => {
  await page.getByLabel('Choose a country').selectOption(country);
});

Then('I see the hot deal', async ({ page }) => {
  await expect(page.getByText('Hot Deal: Buy 1 Get 1 Free')).toBeVisible();
});
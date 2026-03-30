import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Given, When, Then } = createBdd();

Given('att jag är på startsidan', async ({ page }) => {
    await page.goto('/');
});

When('jag registrerar mig som spelare med namnet {string}', async ({ page }, playerName) => {
    await page.locator('[data-testid="player-name-input"]').fill(playerName);
    await page.getByRole('button', { name: /continue|register player/i }).click();
});

Given('att jag ser "Create New Game"', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-testid="player-name-input"]').fill('Benjamin');
    await page.getByRole('button', { name: /continue|register player/i }).click();
    await expect(page.getByText('Create New Game')).toBeVisible();
});

When('jag klickar på knappen Create Game', async ({ page }) => {
    await page.getByRole('button', { name: 'Create Game' }).click();
});

Then('ska jag se Playing as: Benjamin', async ({ page }) => {
    await expect(page.getByText('Playing as: Benjamin')).toBeVisible();
});

Then('ser Create New Game', async ({ page }) => {
    await expect(page.getByText('Create New Game')).toBeVisible();
});

Then('ska jag se ett Game ID', async ({ page }) => {
    await expect(page.getByText(/^Game ID$/)).toBeVisible();
});


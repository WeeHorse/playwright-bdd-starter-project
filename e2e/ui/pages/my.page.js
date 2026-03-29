import { expect } from "@playwright/test";

export default class MyPage {
    constructor(page) {
        this.page = page;
    }

    async goto() {
        await this.page.goto('/');
    }

    async expectTitle(expectedText) {
        await expect(this.page).toHaveTitle(new RegExp(expectedText));
    }
}
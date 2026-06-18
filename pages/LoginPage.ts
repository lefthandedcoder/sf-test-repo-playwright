import { Page, Locator, expect } from '@playwright/test';
import { ENV } from '../utils/env';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton   = page.locator('#Login');
    this.errorMessage  = page.locator('#error');
  }

  async goto() {
    await this.page.goto('https://login.salesforce.com');
  }

  async login(username = ENV.username, password = ENV.password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectLoggedIn() {
    await expect(
      this.page.locator('.appLauncher, [title="App Launcher"]')
    ).toBeVisible({ timeout: 30_000 });
  }

  async expectLoginError() {
    await expect(this.errorMessage).toBeVisible();
  }
}
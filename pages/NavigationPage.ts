import { Page, Locator, expect } from '@playwright/test';

export class NavigationPage {
  readonly page: Page;
  readonly appLauncher: Locator;
  readonly globalSearch: Locator;
  readonly userAvatar: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.appLauncher = page.getByRole('button', { name: 'App Launcher' });
    this.globalSearch = page.locator('.globalSearchInput input, input[placeholder*="Search"]');
    this.userAvatar   = page.locator('.userProfileTrigger, [title*="User"]').first();
    this.logoutLink   = page.locator('a[href*="logout"]');
  }

  async navigateToApp(appName: string) {
    await this.appLauncher.click();
    const searchBox = this.page.locator('input[placeholder="Search apps and items..."]');
    await searchBox.fill(appName);
    await this.page.locator(`one-app-launcher-menu-item [title="${appName}"]`).click();
  }

  async navigateViaUrl(objectApiName: string) {
    await this.page.goto(`/lightning/o/${objectApiName}/list`);
  }

  async logout() {
    await this.userAvatar.click();
    await this.logoutLink.click();
  }
}
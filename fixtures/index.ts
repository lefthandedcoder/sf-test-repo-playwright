import { test as base, Browser } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { NavigationPage } from '../pages/NavigationPage';
import { ContactsPage } from '../pages/ContactsPage';
import { ENV } from '../utils/env';

type SFFixtures = {
  loginPage: LoginPage;
  nav: NavigationPage;
  contactsPage: ContactsPage;
  authenticatedPage: void; 
};

export const test = base.extend<SFFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  nav: async ({ page }, use) => {
    await use(new NavigationPage(page));
  },
  contactsPage: async ({ page }, use) => {
    await use(new ContactsPage(page));
  },

  authenticatedPage: async ({ page, loginPage }, use) => {
    await loginPage.goto();
    await loginPage.login();
    await loginPage.expectLoggedIn();
    await use();
  },
});

export { expect } from '@playwright/test';
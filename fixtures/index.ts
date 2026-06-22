import { test as base, expect } from '@playwright/test';
import { NavigationPage } from '../pages/NavigationPage';
import { ContactsPage } from '../pages/ContactsPage';
import { getSalesforceToken } from '../utils/sfAuth';
import { ENV } from '../utils/env';

type SFFixtures = {
  nav: NavigationPage;
  contactsPage: ContactsPage;
  authenticatedPage: void;
};

export const test = base.extend<SFFixtures>({
  nav: async ({ page }, use) => {
    await use(new NavigationPage(page));
  },

  contactsPage: async ({ page }, use) => {
    await use(new ContactsPage(page));
  },

  // JWT-aware API request context
  request: async ({ playwright }, use) => {
    const { access_token } = await getSalesforceToken();

    const apiContext = await playwright.request.newContext({
      baseURL: ENV.baseUrl,
      extraHTTPHeaders: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    });

    await use(apiContext);
    await apiContext.dispose();
  },

  authenticatedPage: [async ({ page }, use) => {
    const { access_token, instance_url } = await getSalesforceToken();
    const frontdoorUrl =
      `${instance_url}/secur/frontdoor.jsp?sid=${access_token}` +
      `&retURL=/lightning/page/home`;
    await page.goto(frontdoorUrl);
    await page.getByRole('button', { name: 'App Launcher' });

    await use();
  }, { auto: true }],
});

export { expect } from '@playwright/test';
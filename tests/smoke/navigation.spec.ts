import { test, expect } from '../../fixtures';

test.describe('Navigation Smoke', () => {
  test.beforeEach(async ({ authenticatedPage }) => {});

  test('can navigate to Contacts list', async ({ nav, page }) => {
    await nav.navigateViaUrl('Contact');
    await expect(page).toHaveURL(/\/Contact\/list/);
    await expect(page.locator('h1')).toContainText('Contacts');
  });

  test('can navigate to Accounts list', async ({ nav, page }) => {
    await nav.navigateViaUrl('Account');
    await expect(page).toHaveURL(/\/Account\/list/);
  });

  test('can navigate to Opportunities list', async ({ nav, page }) => {
    await nav.navigateViaUrl('Opportunity');
    await expect(page).toHaveURL(/\/Opportunity\/list/);
  });
});
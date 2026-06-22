import { test, expect } from '../../fixtures';

test.describe('Navigation Smoke', () => {
  test.beforeEach(async ({ authenticatedPage }) => {});

  test('can navigate to Contacts list', async ({ nav, page }) => {
    await nav.navigateViaUrl('Contact');
    await expect(page).toHaveURL(/\/Contact\/list/);
    await expect(page.getByRole('heading', { name: 'Contacts', exact: true }));
    
  });

  test('can navigate to Accounts list', async ({ nav, page }) => {
    await nav.navigateViaUrl('Account');
    await expect(page).toHaveURL(/\/Account\/list/);
    await expect(page.getByRole('heading', { name: 'Accounts', exact: true }));
  });

  test('can navigate to Opportunities list', async ({ nav, page }) => {
    await nav.navigateViaUrl('Opportunity');
    await expect(page).toHaveURL(/\/Opportunity\/list/);
    await expect(page.getByRole('heading', { name: 'Opportunities', exact: true }));
  });

  test('app launcher is visible and interactive', async ({ nav, page }) => {
    await nav.appLauncher.click();
    await expect(
      page.getByRole('combobox', { name: 'Search apps and items...' })
    ).toBeVisible();
    await 
      page.getByRole('combobox', { name: 'Search apps and items...' }).press('Escape');
    await expect(
      page.getByRole('combobox', { name: 'Search apps and items...' })
    ).not.toBeVisible();
  });
});
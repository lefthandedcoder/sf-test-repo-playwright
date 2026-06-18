import { test, expect } from '../../fixtures';

test.describe('Contacts — CRUD', () => {
  test.use({ storageState: undefined });

  test.beforeEach(async ({ authenticatedPage }) => {});

  test('creates a new contact', async ({ contactsPage }) => {
    await contactsPage.goto();
    await contactsPage.createContact({
      firstName: 'Playwright',
      lastName: 'TestContact',
      phone: '555-867-5309',
      email: 'pw.test@example.com',
    });

    const name = await contactsPage.getFieldValue('Name');
    expect(name).toContain('TestContact');
  });

  test('inline edits a contact field', async ({ contactsPage, page }) => {
    await contactsPage.goto();

    const link = await contactsPage.searchContact('TestContact');
    await link.click();
    await page.waitForURL(/\/Contact\/.+\/view/);

    await contactsPage.inlineEditField('Phone', '555-999-0000');

    const updatedPhone = await contactsPage.getFieldValue('Phone');
    expect(updatedPhone).toBe('555-999-0000');
  });
});
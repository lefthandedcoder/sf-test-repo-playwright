import { Page, Locator, expect } from '@playwright/test';

export class ContactsPage {
  readonly page: Page;
  readonly newButton: Locator;
  readonly saveButton: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly phoneInput: Locator;
  readonly emailInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newButton      = page.getByRole('button', { name: 'New' });
    this.saveButton     = page.getByRole('button', { name: 'Save', exact: true });
    this.firstNameInput = page.getByRole('textbox', { name: 'First Name' });
    this.lastNameInput  = page.getByRole('textbox', { name: 'Last Name' });
    this.phoneInput     = page.getByRole('textbox', { name: 'Phone', exact: true });
    this.emailInput     = page.getByRole('textbox', { name: 'Email' });
  }

  async goto() {
    await this.page.goto('/lightning/app/standard__LightningSales/o/Contact/list', {
      waitUntil: 'domcontentloaded',
    });
    

  }

  async createContact(data: {
    firstName: string;
    lastName: string;
    phone?: string;
    email?: string;
  }) {
    await this.newButton.click();

    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    if (data.phone) await this.phoneInput.fill(data.phone);
    if (data.email) await this.emailInput.fill(data.email);

    await this.saveButton.click();
  }

  async verifyContactHeaderName(expectedFullName: string) {
    await expect(
      this.page.getByRole('heading', { name: expectedFullName, exact: false })
    ).toBeVisible({ timeout: 20_000 });
  }

  async getFieldValue(fieldLabel: string): Promise<string> {
    const field = this.page.locator('records-record-layout-item')
      .filter({ hasText: fieldLabel })
      .first();

    return field
      .locator('[class*="fieldValue"], .slds-form-element__static, lightning-formatted-text')
      .first()
      .innerText();
  }

  async inlineEditField(fieldLabel: string, newValue: string) {
    const field = this.page.locator('records-record-layout-item')
      .filter({ hasText: fieldLabel })
      .first();

    await field.hover();
    await field.locator('button[title*="Edit"]').waitFor({ state: 'visible' });
    await field.locator('button[title*="Edit"]').click();

    await field.locator('input, textarea').first().clear();
    await field.locator('input, textarea').first().fill(newValue);

    await this.page.locator('button[title="Save"]').click();
    await this.page.waitForLoadState('networkidle');
  }

  async searchContact(name: string): Promise<Locator> {
    return this.page.locator(`a[title="${name}"]`).first();
  }

  async deleteContact() {
    await this.page.locator('button[title="Show more actions"]').click();
    await this.page.locator('a[title="Delete"]').click();
    await this.page.locator('button[title="Delete"]').click();
    await this.page.waitForURL(/\/Contact\/list/);
  }
}
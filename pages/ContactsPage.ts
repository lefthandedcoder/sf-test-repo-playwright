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
    this.newButton  = page.locator('a[title="New"], button[title="New"]');
    this.saveButton = page.locator('button[name="SaveEdit"], button:has-text("Save")').first();

    this.firstNameInput = page.locator('lightning-input')
      .filter({ hasText: 'First Name' })
      .locator('input');

    this.lastNameInput = page.locator('lightning-input')
      .filter({ hasText: 'Last Name' })
      .locator('input');

    this.phoneInput = page.locator('lightning-input')
      .filter({ hasText: 'Phone' })
      .locator('input');

    this.emailInput = page.locator('lightning-input')
      .filter({ hasText: 'Email' })
      .locator('input');
  }

  async goto() {
    await this.page.goto('/lightning/o/Contact/list');
  }

  async createContact(data: {
    firstName: string;
    lastName: string;
    phone?: string;
    email?: string;
  }) {
    await this.newButton.click();

    await this.page.locator('[role="dialog"]').waitFor();

    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    if (data.phone) await this.phoneInput.fill(data.phone);
    if (data.email) await this.emailInput.fill(data.email);

    await this.saveButton.click();

    await this.page.waitForURL(/\/Contact\/[a-zA-Z0-9]{18}\/view/);
  }

  async getFieldValue(fieldLabel: string): Promise<string> {
    const field = this.page.locator('records-record-layout-item')
      .filter({ hasText: fieldLabel })
      .first();

    return field.locator('[class*="fieldValue"], .slds-form-element__static, lightning-formatted-text').first().innerText();
  }

  async clickEditPencil(fieldLabel: string) {
    const field = this.page.locator('records-record-layout-item')
      .filter({ hasText: fieldLabel })
      .first();

    await field.hover();

    const editButton = field.locator('button[title*="Edit"]');
    await editButton.waitFor({ state: 'visible' });
    await editButton.click();
  }

  async inlineEditField(fieldLabel: string, newValue: string) {
    await this.clickEditPencil(fieldLabel);

    const input = this.page.locator('records-record-layout-item')
      .filter({ hasText: fieldLabel })
      .locator('input, textarea')
      .first();

    await input.clear();
    await input.fill(newValue);

    await this.page.locator('button[title="Save"]').click();
    await this.page.waitForLoadState('networkidle');
  }

  async searchContact(name: string) {
    await this.page.goto(`/lightning/o/Contact/list?filterName=Recent`);
    return this.page.locator(`a[title="${name}"]`).first();
  }
}
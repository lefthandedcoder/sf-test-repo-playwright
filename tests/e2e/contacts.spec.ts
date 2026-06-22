import { test, expect } from '../../fixtures';
import { faker } from '@faker-js/faker';

const SF_API_VERSION = process.env.SF_API_VERSION || 'v64.0'; 
const BASE_API_PATH = `/services/data/${SF_API_VERSION}`;

test.describe('Salesforce Core UI Operations', () => {
  let createdContactId: string | null = null;

  // Cleanup block runs automatically after the test blocks finish execution
  test.afterEach(async ({ request }) => {
    if (createdContactId) {
      const deleteResponse = await request.delete(`${BASE_API_PATH}/sobjects/Contact/${createdContactId}`);
      
      // Asserts that the API data teardown was 100% successful
      expect(deleteResponse.status()).toBe(204); 
      
      // Reset the state tracking variable
      createdContactId = null;
    }
  });

  test('should authenticate via JWT and successfully create a new contact', async ({ contactsPage, page }) => {
    const fakeContact = {
      firstName: faker.person.firstName(),
      lastName: `PW-Test-${faker.person.lastName()}`, 
      phone: faker.phone.number({ style: 'national' }), 
      email: faker.internet.email(),
    };

    await contactsPage.goto();
    await contactsPage.createContact(fakeContact);

    const expectedFullName = `${fakeContact.firstName} ${fakeContact.lastName}`;
    await contactsPage.verifyContactHeaderName(expectedFullName);

    // Grab the actual URL string
    const currentUrl = page.url();
    
    // Regex matches and extracts the 18-character character ID string directly out of the URI path pattern
    const match = currentUrl.match(/\/Contact\/([a-zA-Z0-9]{18})\/view/);
    if (match) {
      createdContactId = match[1];
    }
  });

});
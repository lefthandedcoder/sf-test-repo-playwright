import { test, expect } from '../../fixtures'

test.describe('Salesforce Authentication', () => {
  test('login with valid credentials lands on Lightning home', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login();
    await loginPage.expectLoggedIn();
  });

  test('login with invalid password shows error', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(undefined, 'wrongpassword');
    await loginPage.expectLoginError();
  });
});
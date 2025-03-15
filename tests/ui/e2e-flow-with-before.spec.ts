import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { OrderNotFoundPage } from '../pages/order-not-found';
import { faker } from '@faker-js/faker/locale/ar';
import { PASSWORD, SERVICE_URL, USERNAME } from '../../config/env-data';
import { OrderPage } from '../pages/order-page';

let authPage: LoginPage;
let orderCreationPage: OrderPage;

test.describe('HW-18 Test Suite', () => {
  test.beforeEach(async ({ page }) => {
    authPage = new LoginPage(page);
    await authPage.open();
  });

  test.describe('Authorization Tests', () => {
    test('HW-18-1 Sign-in button disabled when incorrect data inserted', async () => {
      await authPage.usernameField.fill(faker.lorem.word(2));
      await authPage.passwordField.fill(faker.lorem.word(7));
      await authPage.signInButton.checkVisible();
      await authPage.signInButton.checkDisabled(true);
    });

    test('HW-18-2 Error message displayed when incorrect credentials used', async () => {
      await authPage.usernameField.fill(faker.lorem.word(1));
      await authPage.passwordField.fill(faker.lorem.word(7));
      await authPage.checkUsernameErrorMessage();
      await authPage.checkPasswordErrorMessage();
    });
  });

  test.describe('Tests requiring authentication', () => {
    test.beforeEach(async () => {
      orderCreationPage = await authPage.signIn(USERNAME, PASSWORD);
    });

    test('HM-18-3 Login and verify order creation page', async () => {
      await orderCreationPage.statusButton.checkDisabled(false);
      await orderCreationPage.nameField.checkVisible();
    });

    test('HW-18-4 Create order', async () => {
      await orderCreationPage.nameField.fill('qwertyyywefbfg');
      await orderCreationPage.phoneField.fill('fwerfwergwergwe');
      await orderCreationPage.commentField.fill('fwfqefqwefq');
      await orderCreationPage.creatOrderButton.checkDisabled(false);
    });

    test('HW-18-5 Create order with invalid data', async () => {
      await orderCreationPage.nameField.fill(faker.lorem.word(1));
      await orderCreationPage.phoneField.fill(faker.lorem.word(5));
      await orderCreationPage.checkNameFieldError();
      await orderCreationPage.checkPhoneFieldError();
      await orderCreationPage.creatOrderButton.checkDisabled(true);
    });

    test('HW-18-6 Check order status and logout', async () => {
      await orderCreationPage.statusButton.click();
      await orderCreationPage.orderNumberField.fill('6022');
      await orderCreationPage.trackButton.click();

      await expect(orderCreationPage.statusOpen).toBeVisible();
      await expect(orderCreationPage.statusAccepted).toBeVisible();
      await expect(orderCreationPage.statusInProgress).toBeVisible();
      await expect(orderCreationPage.statusDelivered).toBeVisible();
      await orderCreationPage.checkFooterAttached();
      await orderCreationPage.langButtonRu.checkVisible();
      await orderCreationPage.langButtonEn.checkVisible();
      await orderCreationPage.privacyPolicyLink.checkVisible();
      await orderCreationPage.cookiePolicyLink.checkVisible();
      await orderCreationPage.tosLink.checkVisible();

      await orderCreationPage.logoutButton.click();
      await expect(authPage.page).toHaveURL(`${SERVICE_URL}/signin`);
      await authPage.signInButton.checkVisible();
    });

    test('HW-18-7 Search for non-existent order', async () => {
      const notFoundPage = new OrderNotFoundPage(orderCreationPage.page);

      await orderCreationPage.statusButton.click();
      await orderCreationPage.orderNumberField.fill('326357');
      await orderCreationPage.trackButton.click();
      await expect(authPage.page).toHaveURL(`${SERVICE_URL}/order/326357`);
      await notFoundPage.checkNotFoundTitle();
    });
  });
});

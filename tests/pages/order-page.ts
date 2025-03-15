import { expect, Locator, Page } from '@playwright/test';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';
import { BasePage } from './base-page';

export class OrderPage extends BasePage {
  readonly statusButton: Button;
  readonly nameField: Input;
  readonly phoneField: Input;
  readonly commentField: Input;
  readonly statusModal: Locator;
  readonly orderNumberField: Input;
  readonly trackButton: Button;
  readonly creatOrderButton: Button;
  readonly notificationPopupText: Locator;
  readonly notificationPopupClose: Button;
  readonly searchOrderInput: Input;
  readonly trackingButton: Button;
  readonly statusOpen: Locator;
  readonly statusAccepted: Locator;
  readonly statusInProgress: Locator;
  readonly statusDelivered: Locator;
  readonly logoutButton: Button;
  readonly nameFieldError: Locator;
  readonly phoneFieldError: Locator;

  constructor(page: Page) {
    super(page);
    this.statusButton = new Button(page, '[data-name="openStatusPopup-button"]');
    this.nameField = new Input(page, '#name');
    this.phoneField = new Input(page, '#phone');
    this.commentField = new Input(page, '#comment');
    this.statusModal = page.getByTestId('searchOrder-popup');
    this.orderNumberField = new Input(page, '[data-name="searchOrder-popup"] input');
    this.trackButton = new Button(
      page,
      '[data-name="searchOrder-popup"] button.order-search-popup__button',
    );
    this.creatOrderButton = new Button(page, '.new-order__button');
    this.notificationPopupText = page.locator('span.notification-popup__text');
    this.notificationPopupClose = new Button(
      page,
      '[data-name="orderSuccessfullyCreated-popup-ok-button"]',
    );
    this.searchOrderInput = new Input(page, '[data-name="searchOrder-input"]');
    this.trackingButton = new Button(page, '[data-name="searchOrder-submitButton"]');
    this.statusOpen = page
      .locator('.status-list__status.status-list__status_active')
      .filter({ hasText: 'OPEN' });
    this.statusAccepted = page.locator('.status-list__status').filter({ hasText: 'ACCEPTED' });
    this.statusInProgress = page.locator('.status-list__status').filter({ hasText: 'INPROGRESS' });
    this.statusDelivered = page.locator('.status-list__status').filter({ hasText: 'DELIVERED' });
    this.logoutButton = new Button(page, '[data-name="logout-button"]');
    this.nameFieldError = page.locator('[data-name="username-input-error"]');
    this.phoneFieldError = page.locator('[data-name="phone-input-error"]');
  }

  async checkNameFieldError(): Promise<void> {
    await expect(this.nameFieldError).toBeVisible();
  }

  async checkPhoneFieldError(): Promise<void> {
    await expect(this.phoneFieldError).toBeVisible();
  }
}

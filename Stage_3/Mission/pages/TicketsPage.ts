import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage.js';

export class TicketsPage extends BasePage {
  // Bloque de localizadores:
  // Centraliza la pagina de destino, la tarjeta generada y el identificador
  // visible de la reserva.
  readonly pageHeading: Locator;
  readonly ticketCards: Locator;
  readonly firstTicketId: Locator;

  constructor(page: Page) {
    super(page);

    this.pageHeading = page.getByRole('heading', {
      name: 'Mis Entradas',
      exact: true,
    });
    this.ticketCards = page.locator('.ticket-card');
    this.firstTicketId = this.ticketCards.first().locator('.ticket-id');
  }

  // Bloque de verificaciones:
  // Confirma la redireccion final y valida el formato exigido para la reserva.
  async verifyUserWasRedirected(): Promise<void> {
    await expect(this.page).toHaveURL(/\/tickets\.html$/);
    await expect(this.pageHeading).toBeVisible();
  }

  async verifyBookingIdFormat(): Promise<void> {
    await expect(this.ticketCards.first()).toBeVisible();
    await expect(this.firstTicketId).toHaveText(/^TKT-\d{10}$/);
  }
}

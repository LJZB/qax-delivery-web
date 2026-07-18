import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage.js';

export class EventsPage extends BasePage {
  // Bloque de localizadores:
  // Centraliza los elementos estables de la pagina para evitar selectores
  // duplicados en las pruebas y mantener el POM como unica fuente de acceso.
  readonly eventCards: Locator;
  readonly pageHeading: Locator;

  constructor(page: Page) {
    super(page);

    this.eventCards = page.locator('.event-card');
    this.pageHeading = page.getByRole('heading', {
      name: 'Proximos Eventos',
      exact: true,
    });
  }

  // Bloque de localizadores dinamicos:
  // Construye elementos que dependen de los datos del escenario sin exponer
  // detalles del DOM fuera del Page Object.
  filterButton(category: string): Locator {
    return this.page.getByRole('button', { name: category, exact: true });
  }

  eventCardByTitle(title: string): Locator {
    return this.eventCards.filter({ hasText: title });
  }

  // Bloque de acciones:
  // Representa las interacciones de negocio que realiza un usuario al
  // explorar los eventos disponibles en QAXTickets.
  async openEvents(): Promise<void> {
    await this.open('index.html');
  }

  async filterBy(category: string): Promise<void> {
    await this.filterButton(category).click();
  }

  async buyTicketsFor(eventTitle: string): Promise<void> {
    const eventCard = this.eventCardByTitle(eventTitle);
    await eventCard
      .getByRole('button', { name: 'Comprar Entradas', exact: true })
      .click();
  }

  // Bloque de verificaciones:
  // Encapsula los criterios de aceptacion y mantiene los tests enfocados en
  // describir el flujo, no en los detalles tecnicos de cada asercion.
  async verifySixEventsWithRequiredInformation(): Promise<void> {
    await expect(this.pageHeading).toBeVisible();
    await expect(this.eventCards).toHaveCount(6);

    for (let index = 0; index < 6; index += 1) {
      const eventCard = this.eventCards.nth(index);

      await expect(eventCard.locator('.title')).toHaveText(/\S+/);
      await expect(eventCard.locator('.date')).toHaveText(/^📅\s.+/);
      await expect(eventCard.locator('.venue')).toHaveText(/^📍\s.+/);
      await expect(eventCard.locator('.price')).toHaveText(
        /^Desde \$[\d.]+ COP$/,
      );
    }
  }

  async verifyOnlyFootballEventsAreVisible(): Promise<void> {
    await expect(this.eventCards).toHaveCount(2);

    for (let index = 0; index < 2; index += 1) {
      await expect(this.eventCards.nth(index)).toHaveAttribute(
        'data-category',
        'futbol',
      );
    }
  }

  async verifyFilterIsVisuallyActive(category: string): Promise<void> {
    const activeFilter = this.filterButton(category);

    await expect(activeFilter).toHaveClass(/\bactive\b/);
    await expect(activeFilter).toHaveCSS(
      'background-color',
      'rgb(124, 62, 184)',
    );
    await expect(activeFilter).toHaveCSS('color', 'rgb(255, 215, 0)');
  }

  async verifySeatSelectionFor(eventTitle: string): Promise<void> {
    await expect(this.page).toHaveURL(/\/seats\.html$/);
    await expect(this.page.getByText(eventTitle, { exact: true })).toBeVisible();
    await expect(
      this.page.getByRole('heading', {
        name: 'Selecciona tus Asientos (Max. 4)',
        exact: true,
      }),
    ).toBeVisible();
  }
}

import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage.js';

export class SeatsPage extends BasePage {
  // Bloque de localizadores:
  // Centraliza el mapa, los estados de los asientos y los elementos del
  // resumen flotante para evitar selectores duplicados en las pruebas.
  readonly seatMap: Locator;
  readonly freeSeats: Locator;
  readonly occupiedSeats: Locator;
  readonly selectedSeats: Locator;
  readonly floatingSummary: Locator;
  readonly summaryRows: Locator;
  readonly summaryTotal: Locator;
  readonly maxSeatsWarning: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);

    this.seatMap = page.locator('#seatMap');
    this.freeSeats = this.seatMap.locator('.seat.free');
    this.occupiedSeats = this.seatMap.locator('.seat.occupied');
    this.selectedSeats = this.seatMap.locator('.seat.selected');
    this.floatingSummary = page.locator('#floatPanel');
    this.summaryRows = page.locator('#floatSeatsList .row');
    this.summaryTotal = page.locator('#floatTotal');
    this.maxSeatsWarning = page.locator('#maxWarning');
    this.continueButton = page.locator('#btnContinue');
  }

  // Bloque de localizadores dinamicos:
  // Permite encontrar asientos por zona o identificador sin exponer la
  // estructura del DOM fuera del Page Object.
  seatsInZone(zone: string): Locator {
    return this.seatMap.locator(`.seat[data-zone="${zone}"]`);
  }

  seatById(seatId: string): Locator {
    return this.seatMap.locator(`.seat[data-seat="${seatId}"]`);
  }

  // Bloque de preparacion:
  // Confirma que la navegacion termino y que el mapa ya contiene asientos
  // antes de iniciar las acciones o verificaciones del escenario.
  async waitUntilLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/seats\.html$/);
    await expect(this.seatMap).toBeVisible();
    await expect(this.seatMap.locator('.seat').first()).toBeVisible();
  }

  // Bloque de acciones:
  // Representa las interacciones del usuario al seleccionar asientos libres
  // o intentar seleccionar un asiento que ya se encuentra ocupado.
  async selectFirstFreeSeat(): Promise<string> {
    const seat = this.freeSeats.first();
    const seatId = await seat.getAttribute('data-seat');

    if (!seatId) {
      throw new Error('El asiento libre no tiene el atributo data-seat');
    }

    await seat.click();
    return seatId;
  }

  async selectFirstFreeSeats(quantity: number): Promise<string[]> {
    const seatIds: string[] = [];

    for (let index = 0; index < quantity; index += 1) {
      seatIds.push(await this.selectFirstFreeSeat());
    }

    return seatIds;
  }

  async tryToSelectOccupiedSeat(seatId: string): Promise<void> {
    await this.seatById(seatId).click();
  }

  async continueToCheckout(): Promise<void> {
    await this.continueButton.click();
  }

  // Bloque de preparacion de datos:
  // Crea una reserva controlada en localStorage para disponer de un asiento
  // ocupado reproducible sin depender del estado dejado por otras pruebas.
  async bookSeatForTest(seatId: string, zone: string, price: number): Promise<void> {
    await this.page.evaluate(
      ({ id, bookedZone, bookedPrice }) => {
        localStorage.setItem(
          'qaxtickets_bookings',
          JSON.stringify([
            {
              seats: [{ id, zone: bookedZone, price: bookedPrice }],
            },
          ]),
        );
      },
      { id: seatId, bookedZone: zone, bookedPrice: price },
    );
    await this.page.reload();
    await this.waitUntilLoaded();
  }

  // Bloque de verificaciones:
  // Encapsula los criterios funcionales y visuales de la HU-02 para mantener
  // los tests enfocados en la orquestacion del flujo de negocio.
  async verifyThreeZones(): Promise<void> {
    for (const zone of ['VIP', 'Platea', 'General']) {
      const zoneSeats = this.seatsInZone(zone);
      await expect(zoneSeats.first()).toBeVisible();
      await expect(zoneSeats.first()).toHaveAttribute('data-zone', zone);
      await expect(
        this.page.locator('.zone-divider').filter({ hasText: zone }),
      ).toBeVisible();
    }
  }

  async verifyFreeSeatColor(): Promise<void> {
    await expect(this.freeSeats.first()).toHaveCSS(
      'background-color',
      'rgb(63, 185, 80)',
    );
  }

  async verifyOccupiedSeatState(seatId: string): Promise<void> {
    const seat = this.seatById(seatId);
    await expect(seat).toHaveClass(/\boccupied\b/);
    await expect(seat).toHaveCSS('background-color', 'rgb(248, 81, 73)');
    await expect(seat).toHaveCSS('cursor', 'not-allowed');
  }

  async verifyOccupiedSeatWasNotSelected(seatId: string): Promise<void> {
    await expect(this.seatById(seatId)).not.toHaveClass(/\bselected\b/);
    await expect(this.selectedSeats).toHaveCount(0);
    await expect(this.floatingSummary).toBeHidden();
  }

  async verifySeatIsSelected(seatId: string): Promise<void> {
    const seat = this.seatById(seatId);
    await expect(seat).toHaveClass(/\bselected\b/);
    await expect(seat).toHaveCSS('background-color', 'rgb(255, 215, 0)');
  }

  async verifyMaximumSelectionWarning(): Promise<void> {
    await expect(this.selectedSeats).toHaveCount(4);
    await expect(this.maxSeatsWarning).toBeVisible();
    await expect(this.maxSeatsWarning).toContainText('Maximo 4 asientos');
  }

  async verifySummaryForSelectedSeats(expectedCount: number): Promise<void> {
    await expect(this.floatingSummary).toBeVisible();
    await expect(this.summaryRows).toHaveCount(expectedCount);

    const selected = this.selectedSeats;
    let expectedTotal = 0;

    for (let index = 0; index < expectedCount; index += 1) {
      const seat = selected.nth(index);
      const seatId = await seat.getAttribute('data-seat');
      const zone = await seat.getAttribute('data-zone');
      const price = Number(await seat.getAttribute('data-price'));

      if (!seatId || !zone || !Number.isFinite(price)) {
        throw new Error('El asiento seleccionado no contiene datos validos');
      }

      expectedTotal += price;
      const summaryRow = this.summaryRows.nth(index);
      await expect(summaryRow).toContainText(`${zone} - ${seatId}`);
      await expect(summaryRow).toContainText(
        `$${price.toLocaleString('es-CO')}`,
      );
    }

    await expect(this.summaryTotal).toHaveText(
      `$${expectedTotal.toLocaleString('es-CO')}`,
    );
  }

  async verifyContinueButtonIsDisabledWithoutSeats(): Promise<void> {
    await expect(this.selectedSeats).toHaveCount(0);
    await expect(this.floatingSummary).toBeHidden();
    await expect(this.continueButton).toBeDisabled();
  }

  async verifyContinueButtonIsEnabled(): Promise<void> {
    await expect(this.continueButton).toBeVisible();
    await expect(this.continueButton).toBeEnabled();
  }
}

import { expect, type Page, test } from '@playwright/test';

// Datos esperados despues de comprar COP 500,000 en Bitcoin.
const initialBalanceCop = 10_000_000;
const btcPriceCop = 280_500_000;
const purchaseAmountCop = 500_000;
const commissionRate = 0.005;
const expectedCommissionCop = purchaseAmountCop * commissionRate;
const expectedFinalBalanceCop = initialBalanceCop - purchaseAmountCop - expectedCommissionCop;
const expectedBtcAmount = (purchaseAmountCop / btcPriceCop).toFixed(8);

async function prepareCleanCryptoState(page: Page) {
  await page.goto('index.html');

  // Se limpia el estado persistido para que cada prueba empiece con las mismas condiciones.
  await page.evaluate((balanceCop) => {
    localStorage.setItem('qaxcrypto_balance', JSON.stringify({ cop: balanceCop }));
    localStorage.setItem('qaxcrypto_portfolio', JSON.stringify([]));
    localStorage.setItem('qaxcrypto_transactions', JSON.stringify([]));
  }, initialBalanceCop);
}

async function purchaseBitcoin(page: Page) {
  // Se realiza la compra desde la interfaz para comprobar la integracion entre compra y portafolio.
  await page.goto('trade.html');
  await page.getByLabel('Criptomoneda').selectOption('BTC');
  await page.getByLabel('Cantidad en COP').fill(String(purchaseAmountCop));

  const tradeButton = page.locator('#btnTrade');
  await expect(tradeButton).toBeEnabled();
  await tradeButton.click();

  // La operacion solo se registra cuando el usuario confirma los detalles del modal.
  const confirmModal = page.locator('#confirmModal');
  await expect(confirmModal).toBeVisible();
  await confirmModal.getByRole('button', { name: 'Confirmar' }).click();
  await expect(page.locator('#successModal')).toBeVisible();
}

test.describe('HU-02: Portafolio de inversion', () => {
  test('muestra el estado correspondiente cuando el portafolio esta vacio', async ({ page }) => {
    await test.step('Given el inversionista no tiene criptomonedas', async () => {
      // Precondicion: saldo inicial y portafolio sin activos.
      await prepareCleanCryptoState(page);
      await page.goto('portfolio.html');
    });

    await test.step('Then las tarjetas muestran los valores iniciales', async () => {
      // Sin compras, todo el saldo sigue disponible y no existe dinero invertido.
      await expect(page.locator('#cardBalance')).toHaveText('$10.000.000');
      await expect(page.locator('#cardInvested')).toHaveText('$0');
      await expect(page.locator('#cardCount')).toHaveText('0');
    });

    await test.step('Then se muestra el estado de portafolio vacio', async () => {
      // Se valida el mensaje de la tabla y el estado alternativo del grafico dona.
      await expect(
        page.locator('#holdingsBody').getByText('Aún no tienes criptomonedas en tu portafolio', {
          exact: true,
        }),
      ).toBeVisible();
      await expect(page.locator('#donutContainer')).toHaveText('Sin datos para mostrar');
      await expect(page.locator('#donutContainer svg')).toHaveCount(0);
    });
  });

  test('actualiza holdings, resumen y grafico dona despues de comprar BTC', async ({ page }) => {
    await test.step('Given el inversionista compra Bitcoin con saldo suficiente', async () => {
      // La compra real desde la pantalla de trade alimenta el portafolio que se validara.
      await prepareCleanCryptoState(page);
      await purchaseBitcoin(page);
    });

    await test.step('When abre su portafolio', async () => {
      await page.goto('portfolio.html');
      await expect(page.getByRole('heading', { name: 'Mi Portafolio' })).toBeVisible();
    });

    await test.step('Then la tabla muestra BTC con cantidad e invertido correctos', async () => {
      // La primera tenencia debe corresponder exactamente a la compra realizada.
      const holdingRow = page.locator('#holdingsBody tr').first();

      await expect(holdingRow).toContainText('Bitcoin (BTC)');
      await expect(holdingRow).toContainText(expectedBtcAmount);
      await expect(holdingRow).toContainText('$500.000');
    });

    await test.step('Then las tarjetas muestran el resumen actualizado', async () => {
      // La comision se descuenta del balance, pero el total invertido conserva el monto de compra.
      await expect(page.locator('#cardBalance')).toHaveText('$9.497.500');
      await expect(page.locator('#cardInvested')).toHaveText('$500.000');
      await expect(page.locator('#cardCount')).toHaveText('1');
      expect(expectedFinalBalanceCop).toBe(9_497_500);
    });

    await test.step('Then el grafico dona muestra un segmento de color y su porcentaje', async () => {
      // Con un unico activo, BTC ocupa el 100% de la distribucion del portafolio.
      const donutContainer = page.locator('#donutContainer');
      const donutSvg = donutContainer.locator('svg');
      const btcSegment = donutSvg.locator('circle');

      await expect(donutSvg).toBeVisible();
      await expect(btcSegment).toHaveCount(1);
      await expect(btcSegment).toHaveAttribute('stroke', '#00d4ff');
      await expect(btcSegment).toHaveAttribute('stroke-dasharray', /\d/);
      await expect(donutContainer.locator('.donut-legend')).toContainText('BTC (100.0%)');
    });
  });
});

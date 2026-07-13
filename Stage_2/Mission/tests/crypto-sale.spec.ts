import { expect, type Page, test } from '@playwright/test';

// Datos de negocio usados para crear una tenencia y vender una parte de ella.
const initialBalanceCop = 10_000_000;
const btcPriceCop = 280_500_000;
const purchaseAmountCop = 500_000;
const saleAmountCop = 200_000;
const excessiveSaleAmountCop = 600_000;
const commissionRate = 0.005;

// Resultados esperados despues de comprar y vender Bitcoin.
const purchaseCommissionCop = purchaseAmountCop * commissionRate;
const saleCommissionCop = saleAmountCop * commissionRate;
const expectedBalanceAfterPurchase = initialBalanceCop - purchaseAmountCop - purchaseCommissionCop;
const expectedFinalBalanceCop = expectedBalanceAfterPurchase + saleAmountCop - saleCommissionCop;
const purchasedBtcAmount = purchaseAmountCop / btcPriceCop;
const soldBtcAmount = saleAmountCop / btcPriceCop;
const expectedRemainingBtc = (purchasedBtcAmount - soldBtcAmount).toFixed(8);

async function prepareCleanCryptoState(page: Page) {
  await page.goto('index.html');

  // Se reinicia localStorage para evitar dependencia de operaciones anteriores.
  await page.evaluate((balanceCop) => {
    localStorage.setItem('qaxcrypto_balance', JSON.stringify({ cop: balanceCop }));
    localStorage.setItem('qaxcrypto_portfolio', JSON.stringify([]));
    localStorage.setItem('qaxcrypto_transactions', JSON.stringify([]));
  }, initialBalanceCop);
}

async function purchaseBitcoinAsPrecondition(page: Page) {
  // La compra desde la interfaz crea la tenencia necesaria para probar una venta real.
  await page.goto('trade.html');
  await page.getByLabel('Criptomoneda').selectOption('BTC');
  await page.getByLabel('Cantidad en COP').fill(String(purchaseAmountCop));
  await page.locator('#btnTrade').click();

  const confirmModal = page.locator('#confirmModal');
  await expect(confirmModal).toBeVisible();
  await confirmModal.getByRole('button', { name: 'Confirmar' }).click();
  await expect(page.locator('#successModal')).toBeVisible();
}

test.describe('HU-04: Venta de criptomoneda con validaciones', () => {
  test('vende parte de BTC y actualiza saldo, tenencia e historial', async ({ page }) => {
    await test.step('Given el inversionista tiene Bitcoin disponible para vender', async () => {
      // Precondicion: compra de COP 500,000 en BTC con saldo inicial limpio.
      await prepareCleanCryptoState(page);
      await purchaseBitcoinAsPrecondition(page);
      await page.goto('trade.html');
    });

    await test.step('When cambia al modo Vender Then el boton cambia a rojo y muestra Vender', async () => {
      await page.locator('#btnSellMode').click();

      const tradeButton = page.locator('#btnTrade');

      // Se valida tanto el estado funcional como el color visual definido para ventas.
      await expect(tradeButton).toHaveText('Vender');
      await expect(tradeButton).toHaveClass(/btn-sell/);
      await expect(tradeButton).toHaveCSS('background-color', 'rgb(255, 71, 87)');
    });

    await test.step('Then Vender se deshabilita si el monto supera la tenencia disponible', async () => {
      // COP 600,000 representa mas BTC del comprado en la precondicion.
      await page.getByLabel('Cantidad en COP').fill(String(excessiveSaleAmountCop));

      await expect(page.locator('#cryptoAmount')).toHaveText('0.00213904');
      await expect(page.locator('#btnTrade')).toBeDisabled();
    });

    await test.step('When vende un monto valido de BTC', async () => {
      // COP 200,000 equivale a una venta parcial y deja BTC restante en el portafolio.
      await page.getByLabel('Cantidad en COP').fill(String(saleAmountCop));

      const tradeButton = page.locator('#btnTrade');
      await expect(page.locator('#cryptoAmount')).toHaveText(soldBtcAmount.toFixed(8));
      await expect(page.locator('#commission')).toHaveText('$1.000 COP');
      await expect(page.locator('#totalValue')).toHaveText('$199.000 COP');
      await expect(tradeButton).toBeEnabled();
      await tradeButton.click();

      // La venta se registra solamente despues de confirmar sus detalles.
      const confirmModal = page.locator('#confirmModal');
      await expect(confirmModal.getByRole('heading', { name: 'Confirmar Venta' })).toBeVisible();
      await confirmModal.getByRole('button', { name: 'Confirmar' }).click();
    });

    await test.step('Then el saldo COP aumenta y la tenencia BTC se reduce', async () => {
      const successModal = page.locator('#successModal');

      // El saldo recibe el monto vendido menos la comision del 0.5%.
      await expect(successModal).toBeVisible();
      await expect(successModal.locator('#successMsg')).toContainText(
        `Vendiste ${soldBtcAmount.toFixed(8)} BTC por $199.000 COP`,
      );
      await expect(page.locator('#balanceBadge')).toHaveText('COP 9.696.500');
      expect(expectedFinalBalanceCop).toBe(9_696_500);

      // La cantidad mostrada en el portafolio debe ser menor a la tenencia comprada.
      await page.goto('portfolio.html');
      const holdingRow = page.locator('#holdingsBody tr').first();
      await expect(holdingRow).toContainText('Bitcoin (BTC)');
      await expect(holdingRow).toContainText(expectedRemainingBtc);
    });

    await test.step('Then el historial registra la transaccion con tipo Venta', async () => {
      await page.goto('history.html');

      // La venta mas reciente aparece en la primera fila con todos sus datos principales.
      const saleRow = page.locator('#txBody tr').first();
      await expect(saleRow.locator('.type-badge')).toHaveText('Venta');
      await expect(saleRow).toContainText('BTC');
      await expect(saleRow).toContainText(soldBtcAmount.toFixed(8));
      await expect(saleRow).toContainText('$200.000');
      await expect(saleRow).toContainText('$1.000');
    });
  });
});

import { expect, type Page, test } from '@playwright/test';

const initialBalanceCop = 10_000_000;
const btcPriceCop = 280_500_000;
const purchaseAmountCop = 500_000;
const commissionRate = 0.005;
const expectedCommissionCop = purchaseAmountCop * commissionRate;
const expectedTotalCop = purchaseAmountCop + expectedCommissionCop;
const expectedFinalBalanceCop = initialBalanceCop - expectedTotalCop;
const expectedBtcAmount = (purchaseAmountCop / btcPriceCop).toFixed(8);

async function prepareCleanCryptoState(page: Page) {
  await page.goto('index.html');

  await page.evaluate((balanceCop) => {
    localStorage.setItem('qaxcrypto_balance', JSON.stringify({ cop: balanceCop }));
    localStorage.setItem('qaxcrypto_portfolio', JSON.stringify([]));
    localStorage.setItem('qaxcrypto_transactions', JSON.stringify([]));
  }, initialBalanceCop);
}

test.describe('Challenge 3: QAX Crypto Exchange', () => {
  test('HU-01: Compra exitosa de Bitcoin con saldo suficiente', async ({ page }) => {
    await test.step('Given el inversionista tiene saldo inicial y abre Comprar/Vender', async () => {
      await prepareCleanCryptoState(page);
      await page.goto('trade.html');

      await expect(page.locator('#balanceBadge')).toHaveText('COP 10.000.000');
      await expect(page.getByRole('heading', { name: 'Comprar / Vender Criptomonedas' })).toBeVisible();
    });

    await test.step('When selecciona Bitcoin BTC Then se muestra su precio actual en COP', async () => {
      await page.getByLabel('Criptomoneda').selectOption('BTC');

      await expect(page.locator('#currentPrice')).toHaveText('$280.500.000 COP');
    });

    await test.step('Then Comprar se deshabilita cuando el total supera el saldo', async () => {
      const amountInput = page.getByLabel('Cantidad en COP');
      const tradeButton = page.locator('#btnTrade');

      await amountInput.fill('10000000');

      await expect(page.locator('#commission')).toHaveText('$50.000 COP');
      await expect(page.locator('#totalValue')).toHaveText('$10.050.000 COP');
      await expect(tradeButton).toBeDisabled();
    });

    await test.step('When ingresa COP 500000 Then calcula BTC, comision y total', async () => {
      const amountInput = page.getByLabel('Cantidad en COP');

      await amountInput.fill(String(purchaseAmountCop));

      await expect(page.locator('#cryptoAmount')).toHaveText(expectedBtcAmount);
      await expect(page.locator('#commission')).toHaveText('$2.500 COP');
      await expect(page.locator('#totalValue')).toHaveText('$502.500 COP');
    });

    await test.step('Then el boton Comprar queda habilitado porque el total no supera el saldo', async () => {
      await expect(page.locator('#btnTrade')).toHaveText('Comprar');
      await expect(page.locator('#btnTrade')).toBeEnabled();
    });

    await test.step('When abre el modal de confirmacion Then muestra los detalles de la compra', async () => {
      await page.locator('#btnTrade').click();

      const confirmModal = page.locator('#confirmModal');

      await expect(confirmModal).toBeVisible();
      await expect(confirmModal.getByRole('heading', { name: 'Confirmar Compra' })).toBeVisible();
      await expect(confirmModal.locator('#modalAmount')).toContainText(`${expectedBtcAmount} BTC`);
      await expect(confirmModal.locator('#modalAmount')).toContainText('$500.000 COP');
      await expect(confirmModal.locator('#modalCommission')).toHaveText('$2.500 COP');
    });

    await test.step('When confirma la compra Then se muestra el modal de exito y el saldo se descuenta', async () => {
      const confirmModal = page.locator('#confirmModal');
      const successModal = page.locator('#successModal');

      await confirmModal.getByRole('button', { name: 'Confirmar' }).click();

      await expect(confirmModal).toBeHidden();
      await expect(successModal).toBeVisible();
      await expect(successModal.getByRole('heading', { name: /Operaci.n Exitosa/ })).toBeVisible();
      await expect(successModal.locator('#successMsg')).toContainText(`Compraste ${expectedBtcAmount} BTC`);
      await expect(page.locator('#balanceBadge')).toHaveText('COP 9.497.500');
    });

    await test.step('Then BTC se agrega al portafolio con cantidad e invertido correctos', async () => {
      await page.goto('portfolio.html');

      await expect(page.locator('#cardBalance')).toHaveText('$9.497.500');
      await expect(page.locator('#cardInvested')).toHaveText('$500.000');
      await expect(page.locator('#cardCount')).toHaveText('1');

      const holdingRow = page.locator('#holdingsBody tr').first();

      await expect(holdingRow).toContainText('Bitcoin (BTC)');
      await expect(holdingRow).toContainText(expectedBtcAmount);
      await expect(holdingRow).toContainText('$500.000');
    });

    await test.step('Then la compra aparece en el historial con todos sus datos', async () => {
      await page.goto('history.html');

      const transactionRow = page.locator('#txBody tr').first();

      await expect(transactionRow).toContainText('Compra');
      await expect(transactionRow).toContainText('BTC');
      await expect(transactionRow).toContainText(expectedBtcAmount);
      await expect(transactionRow).toContainText('$280.500.000');
      await expect(transactionRow).toContainText('$500.000');
      await expect(transactionRow).toContainText('$2.500');
    });

    expect(expectedCommissionCop).toBe(2_500);
    expect(expectedTotalCop).toBe(502_500);
    expect(expectedFinalBalanceCop).toBe(9_497_500);
  });
});

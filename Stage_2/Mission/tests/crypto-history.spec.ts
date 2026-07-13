import { expect, type Page, test } from '@playwright/test';

// Historial controlado con compras y ventas de distintos simbolos y montos.
const transactionHistory = [
  {
    id: 'tx-btc-buy',
    type: 'Compra',
    symbol: 'BTC',
    cryptoAmount: 0.00178253,
    copAmount: 500_000,
    commission: 2_500,
    price: 280_500_000,
    fecha: '2026-07-10T15:00:00.000Z',
  },
  {
    id: 'tx-btc-sale',
    type: 'Venta',
    symbol: 'BTC',
    cryptoAmount: 0.00071301,
    copAmount: 200_000,
    commission: 1_000,
    price: 280_500_000,
    fecha: '2026-07-11T15:00:00.000Z',
  },
  {
    id: 'tx-eth-buy',
    type: 'Compra',
    symbol: 'ETH',
    cryptoAmount: 0.096,
    copAmount: 1_200_000,
    commission: 6_000,
    price: 12_500_000,
    fecha: '2026-07-12T15:00:00.000Z',
  },
  {
    id: 'tx-eth-sale',
    type: 'Venta',
    symbol: 'ETH',
    cryptoAmount: 0.024,
    copAmount: 300_000,
    commission: 1_500,
    price: 12_500_000,
    fecha: '2026-07-13T15:00:00.000Z',
  },
];

async function openHistoryWithTransactions(page: Page) {
  await page.goto('index.html');

  // Se cargan operaciones conocidas para validar resultados exactos y repetibles.
  await page.evaluate((transactions) => {
    localStorage.setItem('qaxcrypto_transactions', JSON.stringify(transactions));
  }, transactionHistory);

  await page.goto('history.html');
  await expect(page.getByRole('heading', { name: 'Historial de Transacciones' })).toBeVisible();
  await expect(page.locator('#txBody tr')).toHaveCount(4);
}

test.describe('HU-05: Historial de transacciones', () => {
  test('filtra el historial para mostrar solamente compras', async ({ page }) => {
    await test.step('Given existen compras y ventas en el historial', async () => {
      await openHistoryWithTransactions(page);
    });

    await test.step('When filtra por tipo Compras', async () => {
      // El valor interno Compra corresponde a la opcion visible Compras.
      await page.locator('#filterType').selectOption('Compra');
    });

    await test.step('Then solo se muestran transacciones de compra', async () => {
      const visibleRows = page.locator('#txBody tr');

      await expect(visibleRows).toHaveCount(2);
      await expect(visibleRows.locator('.type-badge')).toHaveText(['Compra', 'Compra']);
    });
  });

  test('busca por BTC y muestra solamente transacciones de Bitcoin', async ({ page }) => {
    await test.step('Given existen transacciones de BTC y ETH', async () => {
      await openHistoryWithTransactions(page);
    });

    await test.step('When busca por el simbolo BTC', async () => {
      await page.getByPlaceholder('Buscar por símbolo (BTC, ETH...)').fill('BTC');
    });

    await test.step('Then solo se muestran las transacciones de Bitcoin', async () => {
      const visibleRows = page.locator('#txBody tr');

      await expect(visibleRows).toHaveCount(2);
      await expect(visibleRows.nth(0)).toContainText('BTC');
      await expect(visibleRows.nth(1)).toContainText('BTC');
      await expect(page.locator('#txBody').getByText('ETH', { exact: true })).toHaveCount(0);
    });
  });

  test('ordena el historial ubicando primero la transaccion de mayor monto', async ({ page }) => {
    await test.step('Given existen transacciones con diferentes montos', async () => {
      await openHistoryWithTransactions(page);
    });

    await test.step('When ordena por Mayor monto', async () => {
      await page.locator('#filterSort').selectOption('monto-desc');
    });

    await test.step('Then la transaccion mas cara aparece primero', async () => {
      // La compra de ETH por COP 1,200,000 es la operacion de mayor valor.
      const firstRow = page.locator('#txBody tr').first();

      await expect(firstRow).toContainText('ETH');
      await expect(firstRow).toContainText('$1.200.000');
    });
  });

  test('combina el filtro Compras con la busqueda BTC', async ({ page }) => {
    await test.step('Given existen operaciones de distintos tipos y simbolos', async () => {
      await openHistoryWithTransactions(page);
    });

    await test.step('When filtra por Compras y busca BTC', async () => {
      // Ambos controles deben aplicarse simultaneamente sobre el mismo historial.
      await page.locator('#filterType').selectOption('Compra');
      await page.getByPlaceholder('Buscar por símbolo (BTC, ETH...)').fill('BTC');
    });

    await test.step('Then solo se muestra la compra de Bitcoin', async () => {
      const visibleRows = page.locator('#txBody tr');

      await expect(visibleRows).toHaveCount(1);
      await expect(visibleRows.first().locator('.type-badge')).toHaveText('Compra');
      await expect(visibleRows.first()).toContainText('BTC');
      await expect(visibleRows.first()).toContainText('$500.000');
    });
  });
});

import { expect, test } from '@playwright/test';

test.describe('HU-03: Widget BTC en iframe', () => {
  test('muestra precio, grafico, estadisticas e indicador en vivo', async ({ page }) => {
    await test.step('Given el inversionista abre la pagina de mercado', async () => {
      await page.goto('index.html');
      await expect(page.getByRole('heading', { name: /Mercado en Tiempo Real/ })).toBeVisible();
    });

    await test.step('Then el iframe del widget BTC carga correctamente', async () => {
      // El atributo title identifica el iframe sin depender de su clase CSS.
      const widgetIframe = page.getByTitle('BTC Widget');

      await expect(widgetIframe).toBeVisible();
      await expect(widgetIframe).toHaveAttribute('src', 'widget-iframe.html');

      // Un elemento interno visible confirma que el documento del iframe termino de cargar.
      const widget = page.frameLocator('iframe[title="BTC Widget"]');
      await expect(widget.getByText('BTC / COP', { exact: true })).toBeVisible();
    });

    await test.step('Then dentro del iframe se muestra el precio actual de BTC', async () => {
      const widget = page.frameLocator('iframe[title="BTC Widget"]');

      // El precio es dinamico; se valida su formato monetario en lugar de un valor fijo.
      await expect(widget.locator('#btcPrice')).toBeVisible();
      await expect(widget.locator('#btcPrice')).toHaveText(/^\$[\d,.]+$/);
      await expect(widget.getByText('Pesos Colombianos', { exact: true })).toBeVisible();
    });

    await test.step('Then el grafico de barras tiene 20 barras renderizadas', async () => {
      const widget = page.frameLocator('iframe[title="BTC Widget"]');
      const chartBars = widget.locator('#chart .chart-bar');

      // El widget conserva exactamente los ultimos 20 intervalos de precio.
      await expect(chartBars).toHaveCount(20);
      await expect(chartBars.first()).toBeVisible();
      await expect(chartBars.last()).toBeVisible();
    });

    await test.step('Then las estadisticas de las ultimas 24 horas estan visibles', async () => {
      const widget = page.frameLocator('iframe[title="BTC Widget"]');

      // Se validan las cuatro etiquetas y el formato de sus valores dinamicos.
      await expect(widget.getByText('Cambio 24h', { exact: true })).toBeVisible();
      await expect(widget.getByText('Volumen 24h', { exact: true })).toBeVisible();
      await expect(widget.getByText(/ximo 24h/, { exact: true })).toBeVisible();
      await expect(widget.getByText(/nimo 24h/, { exact: true })).toBeVisible();

      await expect(widget.locator('#change24')).toHaveText(/^[+-]\d+(?:\.\d+)?%$/);
      await expect(widget.locator('#volume24')).toHaveText(/^\$\d+(?:\.\d+)?B$/);
      await expect(widget.locator('#high24')).toHaveText(/^\$[\d,.]+$/);
      await expect(widget.locator('#low24')).toHaveText(/^\$[\d,.]+$/);
    });

    await test.step('Then el indicador En vivo esta presente', async () => {
      const widget = page.frameLocator('iframe[title="BTC Widget"]');

      // El indicador informa que los datos del widget se actualizan automaticamente.
      await expect(widget.getByText('En vivo', { exact: false })).toBeVisible();
    });
  });
});

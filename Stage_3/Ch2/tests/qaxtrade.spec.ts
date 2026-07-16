import { test } from "@playwright/test";
import { AlertsPage } from "../pages/AlertsPage";
import { DashboardPage } from "../pages/DashboardPage";
import { PortfolioPage } from "../pages/PortfolioPage";
import { TradePage } from "../pages/TradePage";

/*
 * Portafolio base controlado para que cada test empiece desde el mismo estado.
 * Los escenarios que requieren portafolio vacio o P&L deterministico reemplazan
 * estos datos dentro de su propia preparacion.
 */
const INITIAL_PORTFOLIO = [
  { symbol: "AAPL", name: "Apple Inc.", qty: 10, avgPrice: 175.5 },
  { symbol: "BTC", name: "Bitcoin", qty: 0.15, avgPrice: 62_800 },
  { symbol: "GOOGL", name: "Alphabet Inc.", qty: 8, avgPrice: 142.3 },
  { symbol: "MSFT", name: "Microsoft Corp.", qty: 12, avgPrice: 378.9 },
  { symbol: "TSLA", name: "Tesla Inc.", qty: 20, avgPrice: 245.6 },
];

test.describe("QAXTrade - Challenge 2 Stage 3", () => {
  test.beforeEach(async ({ page }) => {
    /*
     * Se abre primero una pagina del dominio para habilitar localStorage. Luego
     * se restablecen todas las claves usadas por QAXTrade. Cada test navega de
     * nuevo a su pagina y recibe un estado aislado y repetible.
     */
    await page.goto("index.html");
    await page.evaluate((portfolio) => {
      localStorage.setItem("qaxtrade_portfolio", JSON.stringify(portfolio));
      localStorage.setItem("qaxtrade_orders", "[]");
      localStorage.setItem("qaxtrade_alerts", "[]");
      localStorage.setItem("qaxtrade_cash", "25000");
      localStorage.removeItem("qaxtrade_selected_symbol");
    }, INITIAL_PORTFOLIO);
  });

  test.describe("HU-01: Dashboard en vivo", () => {
    test("muestra resumen, watchlist, colores y veinte velas", async ({ page }) => {
      test.info().annotations.push({
        type: "business-rule",
        description:
          "Los cambios positivos deben mostrarse en verde y los negativos en rojo.",
      });

      const dashboard = new DashboardPage(page);

      await test.step("Given que el trader abre el dashboard", async () => {
        await dashboard.navigate("index.html");
      });

      await test.step("Then se muestra el resumen del portafolio", async () => {
        await dashboard.verifyPortfolioSummary();
      });

      await test.step("And la watchlist muestra diez activos con sus datos", async () => {
        await dashboard.verifyWatchlistAssets();
      });

      await test.step("And los cambios usan colores segun su signo", async () => {
        await dashboard.verifyChangeColors();
      });

      await test.step("And el mini-chart renderiza veinte velas", async () => {
        await dashboard.verifyCandlestickChart();
      });
    });

    test("actualiza los precios de la watchlist cada cinco segundos", async ({ page }) => {
      test.info().annotations.push({
        type: "business-rule",
        description: "Los precios del dashboard se actualizan cada 5 segundos.",
      });

      const dashboard = new DashboardPage(page);
      let initialAaplPrice = "";

      await test.step("Given que el trader observa el precio de AAPL", async () => {
        await dashboard.navigate("index.html");
        initialAaplPrice = await dashboard.getAssetPrice("AAPL");
      });

      await test.step("Then el precio cambia en el siguiente ciclo de actualizacion", async () => {
        await dashboard.verifyPriceUpdates("AAPL", initialAaplPrice);
      });
    });
  });

  test.describe("HU-02: Orden de compra", () => {
    test("controla campos y estados para ordenes Market y Limit", async ({ page }) => {
      test.info().annotations.push(
        {
          type: "business-rule",
          description: "Market no requiere precio limite; Limit si lo requiere.",
        },
        {
          type: "business-rule",
          description: "Una orden incompleta no puede enviarse.",
        },
      );

      const trade = new TradePage(page);

      await test.step("Given que el trader selecciona AAPL", async () => {
        await trade.navigate("orders.html");
        await trade.selectAsset("AAPL");
        await trade.verifySelectedAssetPrice();
        await trade.verifySubmitDisabled();
      });

      await test.step("When elige Market, solo usa cantidad y lado", async () => {
        await trade.selectOrderType("market");
        await trade.verifyMarketFields();
        await trade.verifySubmitDisabled();
        await trade.fillQuantity("1");
        await trade.verifySubmitEnabled();
      });

      await test.step("When cambia a Limit, aparece el precio limite obligatorio", async () => {
        await trade.selectOrderType("limit");
        await trade.verifyLimitFieldIsVisible();
        await trade.verifySubmitDisabled();
        await trade.fillLimitPrice("170");
        await trade.verifySubmitEnabled();
      });
    });

    test("compra AAPL y actualiza efectivo y portafolio", async ({ page }) => {
      test.info().annotations.push({
        type: "business-rule",
        description:
          "Una compra ejecutada descuenta efectivo y agrega el activo al portafolio.",
      });

      const trade = new TradePage(page);
      const portfolio = new PortfolioPage(page);
      let cashBeforePurchase = 0;
      let cashAfterPurchase = 0;

      await test.step("Given que el trader no tiene holdings y dispone de 25,000 USD", async () => {
        await page.evaluate(() => {
          localStorage.setItem("qaxtrade_portfolio", "[]");
          localStorage.setItem("qaxtrade_cash", "25000");
        });
        await trade.navigate("orders.html");
        cashBeforePurchase = await trade.getAvailableCash();
      });

      await test.step("When completa una compra Market de una accion AAPL", async () => {
        await trade.selectAsset("AAPL");
        await trade.selectOrderType("market");
        await trade.selectSide("buy");
        await trade.fillQuantity("1");
        await trade.verifySubmitEnabled();
        await trade.submitOrder();
      });

      await test.step("Then se muestra un ID de orden valido", async () => {
        await trade.verifyOrderConfirmation();
      });

      await test.step("And el efectivo disminuye y AAPL queda persistido", async () => {
        await trade.verifyPurchaseResult("AAPL", cashBeforePurchase, 1);
        cashAfterPurchase = await trade.getAvailableCash();
      });

      await test.step("And AAPL y el nuevo efectivo aparecen en el portafolio", async () => {
        await portfolio.navigate("portfolio.html");
        await portfolio.verifyHoldingSymbol("AAPL");
        await portfolio.verifyAvailableCash(cashAfterPurchase);
      });
    });
  });

  test.describe("HU-03: Portafolio y P&L", () => {
    test("muestra holdings, P&L positivo y negativo, y grafico pie", async ({ page }) => {
      test.info().annotations.push({
        type: "business-rule",
        description: "Ganancias usan verde y perdidas usan rojo.",
      });

      const portfolio = new PortfolioPage(page);

      await test.step("Given que existen una posicion ganadora y una perdedora", async () => {
        await page.evaluate(() => {
          localStorage.setItem(
            "qaxtrade_portfolio",
            JSON.stringify([
              { symbol: "AAPL", name: "Apple Inc.", qty: 2, avgPrice: 100 },
              { symbol: "GOOGL", name: "Alphabet Inc.", qty: 1, avgPrice: 300 },
            ]),
          );
          localStorage.setItem("qaxtrade_cash", "0");
        });
        await portfolio.navigate("portfolio.html");
      });

      await test.step("Then la tabla muestra cantidad, precio promedio y valor total", async () => {
        await portfolio.verifyHoldingDetails(2);
      });

      await test.step("And P&L usa verde para ganancia y rojo para perdida", async () => {
        await portfolio.verifyProfitAndLossColors();
      });

      await test.step("And el grafico pie muestra segmentos de colores", async () => {
        await portfolio.verifyPieChart();
      });
    });

    test("muestra el estado vacio cuando no existen holdings", async ({ page }) => {
      test.info().annotations.push({
        type: "business-rule",
        description: "Sin posiciones debe mostrarse una orientacion de estado vacio.",
      });

      const portfolio = new PortfolioPage(page);

      await test.step("Given que el trader no tiene holdings", async () => {
        await page.evaluate(() =>
          localStorage.setItem("qaxtrade_portfolio", "[]"),
        );
        await portfolio.navigate("portfolio.html");
      });

      await test.step("Then se muestra el estado vacio y se ocultan tabla y grafico", async () => {
        await portfolio.verifyEmptyPortfolio();
      });
    });
  });

  test.describe("HU-04: Alertas de precio", () => {
    test("crea, desactiva y elimina una alerta de BTC", async ({ page }) => {
      test.info().annotations.push({
        type: "business-rule",
        description:
          "Una alerta inactiva permanece registrada con opacidad reducida.",
      });

      const alerts = new AlertsPage(page);

      await test.step("Given que el trader abre el formulario de alertas", async () => {
        await alerts.navigate("alerts.html");
      });

      await test.step("When crea una alerta BTC por encima de 100,000 USD", async () => {
        await alerts.createAlert("BTC", "above", "100000");
      });

      await test.step("Then la alerta aparece activa en la lista", async () => {
        await alerts.verifyCreatedAlert("BTC", "Por encima de", "100000.00");
      });

      await test.step("When desactiva la alerta", async () => {
        await alerts.toggleFirstAlert();
      });

      await test.step("Then cambia a OFF y reduce su opacidad", async () => {
        await alerts.verifyAlertIsInactive();
      });

      await test.step("When elimina la alerta", async () => {
        await alerts.deleteFirstAlert();
      });

      await test.step("Then desaparece y se muestra el estado vacio", async () => {
        await alerts.verifyAlertWasDeleted();
      });
    });
  });
});

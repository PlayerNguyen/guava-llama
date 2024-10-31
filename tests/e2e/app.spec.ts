import test, {
  _electron,
  ElectronApplication,
  expect,
  Page,
} from "@playwright/test";

test.describe(`[app]`, () => {
  let app: ElectronApplication;
  let mainWindow: Page;
  test.beforeAll(async () => {
    app = await _electron.launch({ args: [".", "--no-sandbox"] });
    mainWindow = await app.firstWindow();
  });

  /** */
  test.describe(`[window]`, () => {
    test("should have the right title", async () => {
      const title = await mainWindow.title();
      expect(title).toBe("Guavallama");
      await mainWindow.waitForTimeout(1000);

      /**
       * Capture screen shot
       */
      await mainWindow.screenshot({ path: "screenshots/app-window.png" });
    });
  });
});

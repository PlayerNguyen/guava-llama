import { _electron as electron, ElectronApplication, expect, test } from "@playwright/test";
let app: ElectronApplication
test("homepage has title and links to intro page", async () => {
  app = await electron.launch({ args: [".", "--no-sandbox"] });
  const page = await app.firstWindow();
  expect(await page.title()).toBe("Guavallama");

  await page.screenshot({ path: "tests/e2e/screenshots/example.png" });
});


test("[ui] can create a new session", async(  ) => {
  if (app === undefined) {
    app = await electron.launch({ args: [".", "--no-sandbox"] });
  }

  const page = await app.firstWindow()
  page.click("")
})

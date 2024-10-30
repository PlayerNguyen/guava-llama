import { _electron as electron, expect, test } from "@playwright/test";

test("homepage has title and links to intro page", async () => {
  const app = await electron.launch({ args: [".", "--no-sandbox"] });
  const page = await app.firstWindow();
  expect(await page.title()).toBe("Guavallama");

  await page.screenshot({ path: "tests/e2e/screenshots/example.png" });
});

import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import path from "path";
import { pathToFileURL } from "url";

const pageUrl = pathToFileURL(path.resolve(__dirname, "..", "index.html")).href;

test("homepage has no automated accessibility violations", async ({ page }) => {
  await page.goto(pageUrl);
  const results = await new AxeBuilder({ page }).analyze();

  expect(results.violations).toEqual([]);
});

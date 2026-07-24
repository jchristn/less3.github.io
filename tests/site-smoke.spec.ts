import { expect, test } from "@playwright/test";
import path from "path";
import { pathToFileURL } from "url";

const pageUrl = pathToFileURL(path.resolve(__dirname, "..", "index.html")).href;

const viewports = [
  { width: 375, height: 812 },
  { width: 768, height: 1024 },
  { width: 1280, height: 800 },
  { width: 1440, height: 900 }
];

test("homepage renders without horizontal overflow at required viewports", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto(pageUrl);
    await expect(page.locator("#hero-title span")).toHaveText([
      "Your S3 endpoint.",
      "Your infrastructure.",
      "Your data."
    ]);
    await expect(page.getByRole("heading", { name: "Compatibility you can verify." })).toBeVisible();

    const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    expect(hasOverflow, `${viewport.width}x${viewport.height} should not overflow horizontally`).toBe(false);

    const heroLinesAreSingleLine = await page.evaluate(() =>
      Array.from(document.querySelectorAll("#hero-title span")).every((line) => line.getClientRects().length === 1)
    );
    expect(heroLinesAreSingleLine, `${viewport.width}x${viewport.height} hero lines should not wrap`).toBe(true);
  }

  expect(consoleErrors).toEqual([]);
});

test("mobile menu opens, closes, and respects Escape", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(pageUrl);

  const menuButton = page.getByRole("button", { name: "Menu" });
  await expect(menuButton).toHaveAttribute("aria-expanded", "false");
  await menuButton.click();
  await expect(menuButton).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("navigation", { name: "Primary" }).getByText("Use Cases")).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(menuButton).toHaveAttribute("aria-expanded", "false");
});

test("theme toggle switches the page theme", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto(pageUrl);

  const toggle = page.getByRole("button", { name: "Switch to dark theme" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await toggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.getByRole("button", { name: "Switch to light theme" })).toHaveAttribute("aria-pressed", "true");
});

test("quick-start tabs are keyboard operable", async ({ page }) => {
  await page.goto(pageUrl);
  await page.getByRole("tab", { name: "Docker" }).focus();
  await page.keyboard.press("ArrowRight");

  const sourceTab = page.getByRole("tab", { name: "From Source" });
  await expect(sourceTab).toBeFocused();
  await expect(sourceTab).toHaveAttribute("aria-selected", "true");
  await expect(page.getByText("dotnet build src/Less3.sln")).toBeVisible();

  await page.keyboard.press("ArrowLeft");
  await expect(page.getByRole("tab", { name: "Docker" })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByText("docker compose up -d").last()).toBeVisible();
});

test("copy buttons announce a result from a local file", async ({ page }) => {
  await page.goto(pageUrl);
  await page.getByRole("button", { name: "Copy" }).first().click();
  await expect(page.locator(".copy-status").first()).toContainText(/Copied|Copy failed/);
});

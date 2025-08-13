import { test, expect } from "@playwright/test";
import { dragAndDropElement } from "../utils/dragAndDrop";

const calculatorElements = [
  `[data-cy="display-clone-drag-item"]`,
  `[data-cy="operations-clone-drag-item"]`,
  `[data-cy="digits-clone-drag-item"]`,
  `[data-cy="equals-clone-drag-item"]`,
];

const calculatorElementsInDropZone = [
  `[data-cy="display-drag-item"]`,
  `[data-cy="operations-drag-item"]`,
  `[data-cy="digits-drag-item"]`,
  `[data-cy="equals-drag-item"]`,
];

const runtimeBtn = `[data-cy="mode-toggler-runtime"]`;
const sidebar = `[data-cy="sidebar"]`;
const display = `[data-cy="display"]`;

const digit2 = `[data-cy="digit-2"]`;
const plusBtn = `[data-cy="operation-addition"]`;
const submitBtn = `[data-cy="submit-box"]`;

test.describe("User steps basic path", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should load with all calculator elements available in the sidebar", async ({
    page,
  }) => {
    for (const element of calculatorElements) {
      const elementLocator = page.locator(element);
      await expect(elementLocator).toBeVisible();
    }
  });

  test("should load with an empty constructor zone", async ({ page }) => {
    const constructorZone = page.locator('[data-cy="empty-canvas"]');
    await expect(constructorZone).toBeVisible();
  });

  test("build & test calculator", async ({ page }) => {
    for (const item of calculatorElements) {
      if (calculatorElements.indexOf(item) == 0)
        await dragAndDropElement(page, item, '[data-cy="empty-canvas"]');
      else await dragAndDropElement(page, item, '[data-cy="canvas"]');
    }

    const notEmptyCanvas = page.locator('[data-cy="canvas"]');
    for (const item of calculatorElementsInDropZone) {
      await expect(notEmptyCanvas.locator(item)).toBeVisible();
    }

    await page.locator(runtimeBtn).click();
    await expect(page.locator(sidebar)).toBeHidden();

    await page.locator(digit2).click();
    await page.locator(plusBtn).click();
    await page.locator(digit2).click();
    await page.locator(submitBtn).click();
    await expect(page.locator(display)).toHaveText("4");
  });
});

import { Page, Locator, expect } from '@playwright/test';

export async function dragAndDropElement(
  page: Page,
  dragSelector: string | Locator,
  dropSelector: string | Locator,
  options?: {
    steps?: number;
    delay?: number;
  }
) {
  // Получаем локаторы (если переданы селекторы)
  const draggable = typeof dragSelector === 'string' 
    ? page.locator(dragSelector) 
    : dragSelector;
  const dropZone = typeof dropSelector === 'string' 
    ? page.locator(dropSelector) 
    : dropSelector;

  // Проверяем видимость
  await expect(draggable).toBeVisible();
  await expect(dropZone).toBeVisible();

  // Получаем координаты
  const draggableBox = await draggable.boundingBox();
  const dropZoneBox = await dropZone.boundingBox();

  if (!draggableBox || !dropZoneBox) throw new Error('Element not found');

  // Настройки
  const steps = options?.steps || 5;
  const delay = options?.delay || 100;

  // Наводим и зажимаем
  await page.mouse.move(
    draggableBox.x + draggableBox.width / 2,
    draggableBox.y + draggableBox.height / 2
  );
  await page.mouse.down();

  // Перемещаем чем больше шагов тем выше плавность перемещения
  for (let i = 0; i < steps; i++) {
    await page.mouse.move(
      draggableBox.x + (dropZoneBox.x - draggableBox.x) * (i / steps),
      draggableBox.y + (dropZoneBox.y - draggableBox.y) * (i / steps)
    );
    await page.waitForTimeout(delay);
  }

  // Отпускаем
  await page.mouse.up();
}
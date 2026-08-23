import { test, expect } from '@playwright/test';

test('boots the simulation shell without a module error', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.locator('#sim-canvas')).toBeVisible();
  await expect.poll(() => page.evaluate(() => Boolean(window.__VEPA_DEBUG__?._active))).toBe(true);
  expect(errors).toEqual([]);
});

test('runs worker ticks asynchronously when SharedArrayBuffer is available', async ({ page }) => {
  await page.goto('/');
  await expect.poll(() => page.evaluate(() => document.querySelector('#hud-tick')?.textContent || '')).toContain('Tick');
  const result = await page.evaluate(async () => {
    const started = performance.now();
    await new Promise((resolve) => setTimeout(resolve, 1200));
    const text = document.querySelector('#hud-tick')?.textContent || '';
    return { elapsed: performance.now() - started, text, isolated: crossOriginIsolated };
  });
  expect(result.text).toContain('Tick');
  expect(result.elapsed).toBeGreaterThanOrEqual(1000);
});

test('GPU opt-in remains safe when WebGPU is unavailable', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'gpu', { configurable: true, value: undefined });
  });
  await page.goto('/');
  await expect(page.locator('#sim-canvas')).toBeVisible();
  const fallback = await page.evaluate(async () => {
    const module = await import('/src/physics/gpuCompute.js');
    return await module.createGPUContext();
  });
  expect(fallback).toBeNull();
});

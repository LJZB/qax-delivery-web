import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const environment = process.env.ENV ?? 'qa';

const urls: Record<string, string> = {
  qa: 'https://qaxpert.com/lab/sites/stage-4/marketplace',
  prod: 'https://qaxpert.com/lab/sites/stage-4/marketplace',
};

if (!urls[environment]) {
  throw new Error(
    `Unsupported ENV "${environment}". Use one of: ${Object.keys(urls).join(', ')}`,
  );
}

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: urls[environment],
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
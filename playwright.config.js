import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';

export default defineConfig({
  testDir: './tests',
  outputDir: './reports/artifacts',

  // Stop after first failure in CI — remove for full run
  // fullyParallel: true,

  retries: parseInt(process.env.RETRY_COUNT || '1', 10),
  timeout: parseInt(process.env.DEFAULT_TIMEOUT || '30000', 10),

  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/html', open: 'never' }],
    ['json', { outputFile: 'reports/results.json' }],
    ['./utils/reporter.js'],
  ],

  use: {
    baseURL: process.env.BASE_URL,
    headless: process.env.HEADED !== 'true',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Uncomment to test on other browsers:
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
});

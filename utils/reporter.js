/**
 * Custom Playwright Reporter — calls Asana on test failure.
 *
 * Registered in playwright.config.js under `reporter`.
 * Runs automatically after each failed test.
 */

import { createAsanaTask } from './asana.js';

export default class AsanaReporter {
  onBegin(config, suite) {
    const total = suite.allTests().length;
    console.log(`\n[Reporter] Starting ${total} test(s)\n`);
  }

  async onTestEnd(test, result) {
    if (result.status !== 'failed') return;

    const testTitle = test.titlePath().join(' › ');
    const error = result.error?.message || result.error?.toString() || 'Unknown error';

    // Find screenshot attachment if available
    const screenshot = result.attachments.find(
      (a) => a.name === 'screenshot' && a.path
    );

    await createAsanaTask({
      testTitle,
      error,
      screenshotPath: screenshot?.path || null,
      environment: process.env.ENVIRONMENT,
    });
  }

  onEnd(result) {
    console.log(`\n[Reporter] Test run finished with status: ${result.status}`);
  }
}

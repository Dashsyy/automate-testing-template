/**
 * Asana Integration — Auto-create bug tasks on test failure.
 *
 * Usage from test reporter: createAsanaTask({ testTitle, error, screenshotPath })
 * Usage from CLI to verify connection: node utils/asana.js --test
 */

import 'dotenv/config';

const ASANA_API = 'https://app.asana.com/api/1.0';

const token = process.env.ASANA_TOKEN;
const projectId = process.env.ASANA_PROJECT_ID;
const assigneeGid = process.env.ASANA_ASSIGNEE_GID || null;

/**
 * Create a bug task in Asana for a failed test.
 *
 * @param {object} opts
 * @param {string} opts.testTitle   - Full test title (e.g. "TC-LOGIN-001 — Successful login")
 * @param {string} opts.error       - Error message or stack trace
 * @param {string} [opts.screenshotPath] - Path to screenshot file (for reference in notes)
 * @param {string} [opts.environment]    - Environment where failure occurred
 * @returns {Promise<{ taskId: string, taskUrl: string } | null>}
 */
export async function createAsanaTask({ testTitle, error, screenshotPath = null, environment = null }) {
  if (!token || !projectId) {
    console.warn('[Asana] Skipping task creation — ASANA_TOKEN or ASANA_PROJECT_ID not set in .env');
    return null;
  }

  const env = environment || process.env.ENVIRONMENT || 'unknown';
  const date = new Date().toISOString().split('T')[0];

  const taskName = `[BUG] ${testTitle}`;

  const notes = [
    `Environment: ${env}`,
    `Date: ${date}`,
    ``,
    `Error:`,
    error,
    screenshotPath ? `\nScreenshot saved at: ${screenshotPath}` : '',
    ``,
    `---`,
    `Auto-created by QA Automation`,
  ].join('\n');

  const body = {
    data: {
      name: taskName,
      notes,
      projects: [projectId],
      ...(assigneeGid ? { assignee: assigneeGid } : {}),
    },
  };

  try {
    const response = await fetch(`${ASANA_API}/tasks`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(`[Asana] Failed to create task (HTTP ${response.status}): ${text}`);
      return null;
    }

    const json = await response.json();
    const taskId = json.data.gid;
    const taskUrl = `https://app.asana.com/0/${projectId}/${taskId}`;

    console.log(`[Asana] Bug task created: ${taskUrl}`);
    return { taskId, taskUrl };

  } catch (err) {
    console.error('[Asana] Network error creating task:', err.message);
    return null;
  }
}

// CLI: node utils/asana.js --test
// Creates one test task to verify the Asana connection is working.
if (process.argv.includes('--test')) {
  console.log('[Asana] Running connection test...');
  createAsanaTask({
    testTitle: 'CONNECTION TEST — Please delete this task',
    error: 'This is a test task created to verify Asana integration.',
    environment: 'test',
  }).then((result) => {
    if (result) {
      console.log('[Asana] Connection test PASSED.');
      console.log(`Task URL: ${result.taskUrl}`);
    } else {
      console.error('[Asana] Connection test FAILED. Check your ASANA_TOKEN and ASANA_PROJECT_ID in .env');
    }
  });
}

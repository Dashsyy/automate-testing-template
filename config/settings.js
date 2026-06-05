import 'dotenv/config';

function require_env(key) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}\nMake sure you have copied .env.example to .env and filled in the value.`);
  }
  return value;
}

function optional_env(key, fallback = '') {
  return process.env[key] || fallback;
}

export const config = {
  environment: optional_env('ENVIRONMENT', 'staging'),

  urls: {
    base: require_env('BASE_URL'),
    api: optional_env('API_BASE_URL', `${process.env.BASE_URL}/api/v1`),
  },

  credentials: {
    user: {
      email: optional_env('TEST_USER_EMAIL'),
      password: optional_env('TEST_USER_PASSWORD'),
    },
    admin: {
      email: optional_env('TEST_ADMIN_EMAIL'),
      password: optional_env('TEST_ADMIN_PASSWORD'),
    },
    apiToken: optional_env('API_AUTH_TOKEN'),
  },

  asana: {
    token: optional_env('ASANA_TOKEN'),
    projectId: optional_env('ASANA_PROJECT_ID'),
    assigneeGid: optional_env('ASANA_ASSIGNEE_GID'),
    enabled: !!(process.env.ASANA_TOKEN && process.env.ASANA_PROJECT_ID),
  },

  test: {
    timeout: parseInt(optional_env('DEFAULT_TIMEOUT', '30000'), 10),
    retries: parseInt(optional_env('RETRY_COUNT', '1'), 10),
    headed: optional_env('HEADED', 'false') === 'true',
  },
};

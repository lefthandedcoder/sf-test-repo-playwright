function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}\n` +
      `Copy .env.example to .env and fill in your values.`
    );
  }
  return value;
}

export const ENV = {
  baseUrl:        requireEnv('SF_BASE_URL'),
  username:       requireEnv('SF_USERNAME'),
  consumerKey:    requireEnv('SF_CONSUMER_KEY'),
  privateKeyPath: requireEnv('SF_PRIVATE_KEY_PATH'),
};
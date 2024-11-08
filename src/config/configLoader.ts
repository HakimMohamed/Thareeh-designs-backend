import dotenv from 'dotenv';
import path from 'path';

const loadConfig = () => {
  dotenv.config();

  const env: { [key: string]: string } = {
    production: '.env.prod',
    development: '.env.dev',
    local: '.env.local',
  };
  const envFile = env[process.env.NODE_ENV!] || env.local;

  const envFilePath = path.join(__dirname, '../environment', envFile);

  let result = dotenv.config({ path: envFilePath });

  if (result.error) {
    console.warn(`Could not load ${envFilePath}. Falling back to .local.`);

    result = dotenv.config({
      path: path.join(__dirname, '../environment', '.local'),
    });

    if (result.error) {
      throw new Error(`Could not load .local file: ${result.error}`);
    }
  }

  console.log(`Loaded ${process.env.NODE_ENV} configuration.`);
};

export default loadConfig;

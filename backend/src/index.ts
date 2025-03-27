// index.ts
import { App } from './app'; // Import your App class
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

async function main() {
  const app = new App();
  await app.start();
}

main().catch((error) => {
  console.error('Failed to start the application:', error);
  process.exit(1); // Exit with an error code
});
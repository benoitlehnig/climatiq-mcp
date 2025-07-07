import { ClimatiqMCPServer } from './server/ClimatiqMCPServer.js';

async function main() {
  const server = new ClimatiqMCPServer();
  await server.run();
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
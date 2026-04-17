import prisma from '@/db/prisma-client';
import { runSeed } from './index';

async function main() {
  const totalClients = await prisma.client.count();
  if (totalClients > 0) {
    console.log(`Skipping seed: database already has ${totalClients} clients.`);
    return;
  }

  console.log('Database is empty. Running seed...');
  await runSeed();
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

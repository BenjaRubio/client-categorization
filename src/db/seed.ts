import prisma from '@/db/prisma';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { CsvRow, processRow } from '@/services/seed.service';

async function main() {
  console.log('Starting seed process...\n');

  const csvFilePath = path.join(process.cwd(), 'src/data/vambe_clients.csv');

  if (!fs.existsSync(csvFilePath)) {
    console.warn(`Seed file not found at ${csvFilePath}. Skipping...`);
    return;
  }

  const fileContent = fs.readFileSync(csvFilePath, 'utf8');
  const { data, errors } = Papa.parse<CsvRow>(fileContent, {
    header: true,
    skipEmptyLines: true,
  });

  if (errors.length > 0) {
    console.error('CSV parse errors:', errors);
    return;
  }

  console.log(`Parsed ${data.length} rows from CSV.`);

  for (let i = 0; i < data.length; i++) {
    await processRow(data[i], i);
    await new Promise((resolve) => setTimeout(resolve, 10000));
  }

  console.log('\n✓ Seed process finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

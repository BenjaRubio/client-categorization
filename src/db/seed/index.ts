import prisma from '@/db/prisma-client';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { pathToFileURL } from 'url';
import { CsvRow, processRow } from './seed.service';

export async function runSeed() {
  console.log('Starting seed process...\n');

  const csvFilePath = path.join(process.cwd(), 'src/db/data/vambe_clients.csv');

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
  }

  console.log('\nSeed process finished.');
}

async function main() {
  try {
    await runSeed();
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

const isMainModule = process.argv[1]
  ? import.meta.url === pathToFileURL(process.argv[1]).href
  : false;

if (isMainModule) {
  void main();
}

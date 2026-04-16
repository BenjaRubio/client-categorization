import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import Papa from 'papaparse'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed process...')

  const csvFilePath = path.join(process.cwd(), 'src/data/vambe_clients.csv')

  if (!fs.existsSync(csvFilePath)) {
    console.warn(`Seed file not found at ${csvFilePath}. Skipping...`)
    return
  }

  const fileContent = fs.readFileSync(csvFilePath, 'utf8')

  Papa.parse(fileContent, {
    header: true,
    skipEmptyLines: true,
    complete: async (results) => {
      console.log(`Parsed ${results.data.length} rows from CSV.`)

      // Bulk insert/upsert logic will go here once tables are defined
      // For now, logging the data
      console.log('CSV Data sample:', results.data.slice(0, 2))

      console.log('Seed process finished successfully.')
    },
    error: (error: any) => {
      console.error('Error parsing CSV:', error)
    }
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

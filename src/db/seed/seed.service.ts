import {
  clientRepository,
  salesmanRepository,
  salesMeetingRepository,
} from '@/db/repositories';

export interface CsvRow {
  Nombre: string;
  'Correo Electronico': string;
  'Numero de Telefono': string;
  'Fecha de la Reunion': string;
  'Vendedor asignado': string;
  closed: string;
  Transcripcion: string;
}

export async function processRow(row: CsvRow, index: number) {
  const label = `[${index + 1}] ${row.Nombre}`;
  console.log(`\n${label}`);

  const email = row['Correo Electronico'];
  let client = await clientRepository.findByName(row.Nombre);

  if (client) {
    console.log(`  -> Client already exists (${row.Nombre})`);
  } else {
    client = await clientRepository.create({
      name: row.Nombre,
      email,
      phoneNumber: row['Numero de Telefono'],
    });
    console.log('  + Client created');
  }

  const salesmanName = row['Vendedor asignado'];
  let salesman = await salesmanRepository.findByName(salesmanName);

  if (salesman) {
    console.log(`  -> Salesman "${salesmanName}" already exists`);
  } else {
    salesman = await salesmanRepository.create({ name: salesmanName });
    console.log(`  + Salesman "${salesmanName}" created`);
  }

  const meeting = await salesMeetingRepository.create({
    clientId: client.id,
    salesmanId: salesman.id,
    date: new Date(row['Fecha de la Reunion']),
    closed: row.closed === '1',
    transcription: row.Transcripcion,
  });
  console.log(`  + SalesMeeting created (${meeting.id})`);
}

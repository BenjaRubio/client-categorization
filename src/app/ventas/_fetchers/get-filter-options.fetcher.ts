import { clientRepository, salesmanRepository } from '@/db/repositories';

export async function getFilterOptions() {
  const [clients, salesmen] = await Promise.all([
    clientRepository.findAll(),
    salesmanRepository.findAll(),
  ]);

  return {
    clients: clients
      .map((client) => ({
        value: client.id,
        label: client.name,
      }))
      .sort((a, b) => a.label.localeCompare(b.label, 'es')),
    salesmen: salesmen
      .map((salesman) => ({
        value: salesman.id,
        label: salesman.name,
      }))
      .sort((a, b) => a.label.localeCompare(b.label, 'es')),
  };
}

import prisma from '@/db/prisma-client';
import { Client } from '@prisma/client';

export async function findByEmail(email: string): Promise<Client | null> {
  return prisma.client.findFirst({ where: { email } });
}

export async function findByName(name: string): Promise<Client | null> {
  return prisma.client.findFirst({ where: { name } });
}

export async function create(data: {
  name: string;
  email: string;
  phoneNumber: string;
}): Promise<Client> {
  return prisma.client.create({ data });
}

export async function findAll(): Promise<Client[]> {
  return prisma.client.findMany();
}

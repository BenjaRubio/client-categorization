import prisma from '@/db/prisma-client';
import { Salesman } from '@prisma/client';

export async function findByName(name: string): Promise<Salesman | null> {
  return prisma.salesman.findFirst({ where: { name } });
}

export async function create(data: { name: string }): Promise<Salesman> {
  return prisma.salesman.create({ data });
}

export async function findAll(): Promise<Salesman[]> {
  return prisma.salesman.findMany();
}

import prisma from '@/db/prisma-client';
import { SalesMeeting } from '@prisma/client';

export async function create(data: {
  clientId: string;
  salesmanId: string;
  date: Date;
  closed: boolean;
  transcription: string;
}): Promise<SalesMeeting> {
  return prisma.salesMeeting.create({ data });
}

export async function findAll(): Promise<SalesMeeting[]> {
  return prisma.salesMeeting.findMany();
}

export async function findById(id: string): Promise<SalesMeeting | null> {
  return prisma.salesMeeting.findUnique({ where: { id } });
}

export async function findWithCategory(id: string) {
  return prisma.salesMeeting.findUnique({
    where: { id },
    include: { meetingCategory: true, client: true, salesman: true },
  });
}

export async function findUnclassified() {
  return prisma.salesMeeting.findMany({
    where: { meetingCategory: null },
    include: { client: true },
  });
}

export async function findAllWithDetails() {
  return prisma.salesMeeting.findMany({
    include: {
      client: true,
      salesman: true,
      meetingCategory: true,
    },
    orderBy: { date: 'desc' },
  });
}

export async function countAll(): Promise<number> {
  return prisma.salesMeeting.count();
}

export async function countClosed(): Promise<number> {
  return prisma.salesMeeting.count({ where: { closed: true } });
}

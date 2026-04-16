import prisma from '@/db/prisma';
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
    include: { meetingCategory: true },
  });
}

export async function findUnclassified() {
  return prisma.salesMeeting.findMany({
    where: { meetingCategory: null },
    include: { client: true },
  });
}

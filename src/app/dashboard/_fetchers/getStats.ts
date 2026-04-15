import prisma from "@/db/prisma";

export async function getDashboardStats() {
  // This is a server-side fetcher using Prisma
  // For the PoC, we might return some mock data if DB is empty
  try {
    const clientCount = await prisma.client.count();
    const recentLogs = await prisma.log.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    });

    return {
      clientCount,
      recentLogs,
      processingTime: '1.2s', // Hardcoded for now
      categorizedRate: '87.2%' // Hardcoded for now
    };
  } catch (error) {
    console.warn('Database not initialized yet, returning mock data.');
    return {
      clientCount: 1284,
      recentLogs: [],
      processingTime: '1.2s',
      categorizedRate: '87.2%'
    };
  }
}

"use server";

import prisma from "@/db/prisma";
import { revalidatePath } from "next/cache";

export async function clearLogs() {
  await prisma.log.deleteMany();
  revalidatePath("/dashboard");
}

export async function addLog(message: string) {
  await prisma.log.create({
    data: { message, level: "INFO" }
  });
  revalidatePath("/dashboard");
}

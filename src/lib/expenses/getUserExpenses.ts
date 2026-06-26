"use server";

import { prisma } from "@/lib/prisma";

export async function getUserExpenses(userId: string) {
  const expenses = await prisma.expense.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      description: true,
      amount: true,
      spentAt: true,
      createdAt: true,
      category: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      spentAt: "desc",
    },
  });

  return expenses.map((expense) => ({
    id: expense.id,
    category: expense.category?.name ?? "Uncategorized",
    description: expense.description,
    amount: Number(expense.amount),
    spentAt: expense.spentAt,
    createdAt: expense.createdAt,
  }));
}

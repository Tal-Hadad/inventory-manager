"use server";

import { prisma } from "@/lib/prisma";

export async function getDemoExpenses() {
  const expenses = await prisma.demoExpense.findMany({
    select: {
      id: true,
      category: true,
      description: true,
      amount: true,
      spentAt: true,
      createdAt: true,
    },
    orderBy: {
      spentAt: "desc",
    },
  });

  return expenses.map((expense) => ({
    id: expense.id,
    category: expense.category,
    description: expense.description,
    amount: Number(expense.amount),
    spentAt: expense.spentAt,
    createdAt: expense.createdAt,
  }));
}

"use server";

import { prisma } from "@/lib/prisma";

type GetExpensePieDataParams = {
  userId: string;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
};

export async function getExpensePieData({
  userId,
  categoryId,
  startDate,
  endDate,
}: GetExpensePieDataParams) {
  const expenses = await prisma.expense.findMany({
    where: {
      userId,
      ...(categoryId ? { categoryId } : {}),
      ...(startDate || endDate
        ? {
            spentAt: {
              ...(startDate ? { gte: new Date(startDate) } : {}),
              ...(endDate ? { lte: new Date(endDate) } : {}),
            },
          }
        : {}),
    },
    select: {
      amount: true,
      category: {
        select: {
          name: true,
        },
      },
    },
  });

  const grouped = expenses.reduce<Record<string, number>>((acc, expense) => {
    const category = expense.category?.name ?? "Uncategorized";
    acc[category] = (acc[category] ?? 0) + Number(expense.amount);
    return acc;
  }, {});

  return Object.entries(grouped).map(([category, total]) => ({
    category,
    total,
  }));
}

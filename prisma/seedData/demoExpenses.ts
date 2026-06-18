import {
  createSeededRandom,
  pickOne,
  randomInt,
  roundToTwo,
} from "./seedUtils";

export type DemoExpenseSeed = {
  category: string;
  description: string;
  amount: number;
  spentAt: Date;
};

const demoExpenseTemplates = [
  {
    category: "Rent",
    descriptions: ["Monthly store rent"],
    minAmount: 2800,
    maxAmount: 3200,
    monthly: true,
  },
  {
    category: "Utilities",
    descriptions: [
      "Electricity and water",
      "Extra cooling costs",
      "Power usage adjustment",
    ],
    minAmount: 150,
    maxAmount: 700,
    monthly: false,
  },
  {
    category: "Marketing",
    descriptions: [
      "Instagram and local ads",
      "Weekend promotion campaign",
      "Flyers and local promotion",
    ],
    minAmount: 120,
    maxAmount: 550,
    monthly: false,
  },
  {
    category: "Supplies",
    descriptions: [
      "Cleaning products and bags",
      "Receipt rolls and labels",
      "Store consumables restock",
    ],
    minAmount: 70,
    maxAmount: 260,
    monthly: false,
  },
  {
    category: "Transport",
    descriptions: [
      "Supplier delivery fees",
      "Urgent stock pickup",
      "Regional delivery charge",
    ],
    minAmount: 90,
    maxAmount: 340,
    monthly: false,
  },
  {
    category: "Maintenance",
    descriptions: [
      "Shelf repair and upkeep",
      "Equipment servicing",
      "Small store repairs",
    ],
    minAmount: 120,
    maxAmount: 420,
    monthly: false,
  },
  {
    category: "Internet",
    descriptions: ["Store internet bill"],
    minAmount: 90,
    maxAmount: 140,
    monthly: true,
  },
  {
    category: "Packaging",
    descriptions: [
      "Boxes and wrapping",
      "Takeaway packaging",
      "Label and packaging refill",
    ],
    minAmount: 80,
    maxAmount: 220,
    monthly: false,
  },
  {
    category: "Cleaning",
    descriptions: [
      "Deep cleaning service",
      "Cleaning contractor visit",
      "Floor and storage cleaning",
    ],
    minAmount: 110,
    maxAmount: 260,
    monthly: false,
  },
] as const;

function generateDemoExpenses(): DemoExpenseSeed[] {
  const rand = createSeededRandom(20260620);
  const expenses: DemoExpenseSeed[] = [];
  const startMonth = new Date(Date.UTC(2025, 5, 1));
  const endMonth = new Date(Date.UTC(2026, 5, 1));

  for (
    let currentMonth = new Date(startMonth);
    currentMonth <= endMonth;
    currentMonth.setUTCMonth(currentMonth.getUTCMonth() + 1)
  ) {
    for (const template of demoExpenseTemplates) {
      if (template.monthly) {
        const spentAt = new Date(currentMonth);
        spentAt.setUTCDate(template.category === "Rent" ? 1 : 3);
        spentAt.setUTCHours(9, randomInt(rand, 0, 59), 0, 0);

        expenses.push({
          category: template.category,
          description: pickOne(rand, template.descriptions),
          amount: roundToTwo(
            randomInt(rand, template.minAmount, template.maxAmount),
          ),
          spentAt,
        });

        continue;
      }

      const occurrences = rand() > 0.75 ? 2 : 1;

      for (let index = 0; index < occurrences; index += 1) {
        const spentAt = new Date(currentMonth);
        spentAt.setUTCDate(randomInt(rand, 4, 27));
        spentAt.setUTCHours(
          randomInt(rand, 8, 17),
          randomInt(rand, 0, 59),
          0,
          0,
        );

        expenses.push({
          category: template.category,
          description: pickOne(rand, template.descriptions),
          amount: roundToTwo(
            randomInt(rand, template.minAmount, template.maxAmount),
          ),
          spentAt,
        });
      }
    }
  }

  return expenses.sort((a, b) => a.spentAt.getTime() - b.spentAt.getTime());
}

export const demoExpenses: DemoExpenseSeed[] = generateDemoExpenses();

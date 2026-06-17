export type DemoExpenseSeed = {
  category: string;
  description: string;
  amount: number;
  spentAt: Date;
};

export const demoExpenses: DemoExpenseSeed[] = [
  {
    category: "Rent",
    description: "Monthly store rent",
    amount: 3000.0,
    spentAt: new Date("2026-05-27T08:00:00.000Z"),
  },
  {
    category: "Utilities",
    description: "Electricity and water",
    amount: 650.0,
    spentAt: new Date("2026-05-29T10:15:00.000Z"),
  },
  {
    category: "Marketing",
    description: "Instagram and local ads",
    amount: 450.0,
    spentAt: new Date("2026-05-31T12:30:00.000Z"),
  },
  {
    category: "Supplies",
    description: "Cleaning products and bags",
    amount: 220.0,
    spentAt: new Date("2026-06-02T09:20:00.000Z"),
  },
  {
    category: "Transport",
    description: "Supplier delivery fees",
    amount: 310.0,
    spentAt: new Date("2026-06-04T11:00:00.000Z"),
  },
  {
    category: "Maintenance",
    description: "Shelf repair and upkeep",
    amount: 180.0,
    spentAt: new Date("2026-06-05T14:40:00.000Z"),
  },
  {
    category: "Internet",
    description: "Store internet bill",
    amount: 120.0,
    spentAt: new Date("2026-06-06T08:45:00.000Z"),
  },
  {
    category: "Packaging",
    description: "Boxes and wrapping",
    amount: 140.0,
    spentAt: new Date("2026-06-08T13:10:00.000Z"),
  },
  {
    category: "Marketing",
    description: "Weekend promotion campaign",
    amount: 260.0,
    spentAt: new Date("2026-06-10T15:25:00.000Z"),
  },
  {
    category: "Supplies",
    description: "Receipt rolls and labels",
    amount: 95.0,
    spentAt: new Date("2026-06-12T10:35:00.000Z"),
  },
  {
    category: "Utilities",
    description: "Extra cooling costs",
    amount: 180.0,
    spentAt: new Date("2026-06-14T16:00:00.000Z"),
  },
  {
    category: "Cleaning",
    description: "Deep cleaning service",
    amount: 210.0,
    spentAt: new Date("2026-06-15T09:50:00.000Z"),
  },
];

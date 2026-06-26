import { auth } from "@/auth";
import PageHeader from "@/components/PageHeader";
import { getDemoExpenses } from "@/lib/expenses/getDemoExpenses";
import { getUserExpenses } from "@/lib/expenses/getUserExpenses";
import ExpensesContent from "./ExpensesContent";

type Props = {};

export default async function ExpensesPage({}: Props) {
  const session = await auth();
  const expenses = session?.user?.id
    ? await getUserExpenses(session.user.id)
    : await getDemoExpenses();

  const isDemo = !session?.user?.id;

  const errorMessage = "Failed to load expenses";
  if (!expenses) {
    throw new Error(errorMessage);
  }
  return (
    <div>
      <PageHeader name="Expenses" isDemo={isDemo} />
      <ExpensesContent expenses={expenses} />
    </div>
  );
}

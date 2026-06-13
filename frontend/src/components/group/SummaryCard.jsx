import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Receipt, HandCoins, IndianRupee, CheckCircle2 } from "lucide-react";

function SummaryCard({ summary }) {
  if (!summary) return null;

  const formatAmount = (amount) => {
    if (amount === null || amount === undefined) return "₹0.00";
    const num = Number(amount);
    return `₹${num.toFixed(2)}`;
  };

  const stats = [
    {
      label: "Members",
      value: summary.memberCount,
      icon: Users,
    },
    {
      label: "Expenses",
      value: summary.expenseCount,
      icon: Receipt,
    },
    {
      label: "Settlements",
      value: summary.settlementCount,
      icon: HandCoins,
    },
    {
      label: "Total Expenses",
      value: formatAmount(summary.totalExpenses),
      icon: IndianRupee,
    },
    {
      label: "Total Settled",
      value: formatAmount(summary.totalSettlements),
      icon: CheckCircle2,
    },
  ];

  return (
    <Card className="border-stone-200 shadow-none bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium text-stone-900">
          Group Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-stone-50 border border-stone-100 rounded-xl p-3 md:p-4 hover:border-stone-200 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className="w-4 h-4 text-stone-400 flex-shrink-0" />
                <p className="text-xs text-stone-500 font-light truncate">
                  {stat.label}
                </p>
              </div>
              <p className="text-lg md:text-xl font-medium text-stone-900 tracking-tight truncate">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default SummaryCard;
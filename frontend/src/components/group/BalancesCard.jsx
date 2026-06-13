import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDownRight, ArrowUpRight, Minus, HandCoins, PartyPopper, Loader2 } from "lucide-react";

function formatAmount(amount) {
  if (amount === null || amount === undefined) return "0.00";
  return Number(amount).toFixed(2);
}

// Net Balances - to be placed beside Summary
function NetBalancesCard({ netBalances }) {
  const getBalanceDisplay = (amount) => {
    if (amount > 0) {
      return {
        text: `Gets ₹${formatAmount(amount)}`,
        color: "text-emerald-600",
        icon: ArrowDownRight,
      };
    }
    if (amount < 0) {
      return {
        text: `Owes ₹${formatAmount(Math.abs(amount))}`,
        color: "text-rose-600",
        icon: ArrowUpRight,
      };
    }
    return {
      text: "Settled",
      color: "text-stone-500",
      icon: Minus,
    };
  };

  return (
    <Card className="border-stone-200 shadow-none bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium text-stone-900">
          Net Balances
        </CardTitle>
      </CardHeader>
      <CardContent>
        {netBalances.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm text-stone-500 font-light">No balances to show</p>
          </div>
        ) : (
          <div className="space-y-2">
            {netBalances.map((balance) => {
              const display = getBalanceDisplay(balance.amount);
              return (
                <div
                  key={balance.user.id}
                  className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-stone-50 transition-colors"
                >
                  <span className="text-sm font-medium text-stone-900 truncate mr-3">
                    {balance.user.name}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 text-sm font-medium flex-shrink-0 ${display.color}`}
                  >
                    <display.icon className="w-3.5 h-3.5" />
                    {display.text}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Suggested Settlements - full width below
function SettlementsCard({ balances, onQuickSettle, settlingBalance }) {
  return (
    <Card className="border-stone-200 shadow-none bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium text-stone-900 flex items-center gap-2">
          <HandCoins className="w-5 h-5 text-stone-400" />
          Suggested Settlements
        </CardTitle>
      </CardHeader>
      <CardContent>
        {balances.length === 0 ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <PartyPopper className="w-6 h-6 text-emerald-500" />
            </div>
            <p className="text-sm font-medium text-stone-900">Everyone is settled!</p>
            <p className="text-xs text-stone-500 font-light mt-1">No pending balances to clear</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {balances.map((balance, index) => (
              <div
                key={index}
                className="flex flex-col gap-3 p-3 bg-stone-50 border border-stone-100 rounded-xl hover:border-stone-200 transition-colors"
              >
                <div className="text-sm min-w-0">
                  <span className="font-medium text-stone-900">
                    {balance.from.name}
                  </span>
                  <span className="text-stone-400 mx-1.5">owes</span>
                  <span className="font-medium text-stone-900">
                    {balance.to.name}
                  </span>
                  <div className="text-stone-600 font-medium mt-1">
                    ₹{formatAmount(balance.amount)}
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => onQuickSettle(balance)}
                  disabled={settlingBalance === `${balance.from.id}-${balance.to.id}`}
                  className="bg-stone-900 hover:bg-stone-800 text-stone-50 font-normal text-xs h-8 px-3 rounded-lg w-full mt-auto"
                >
                  {settlingBalance === `${balance.from.id}-${balance.to.id}` ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                      Settling...
                    </>
                  ) : (
                    "Settle Up"
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Combined export for backward compatibility
function BalancesCard({ netBalances, balances, onQuickSettle, settlingBalance }) {
  return (
    <div className="space-y-4">
      <NetBalancesCard netBalances={netBalances} />
      <SettlementsCard 
        balances={balances} 
        onQuickSettle={onQuickSettle} 
        settlingBalance={settlingBalance} 
      />
    </div>
  );
}

export { NetBalancesCard, SettlementsCard };
export default BalancesCard;
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { Button }
from "@/components/ui/button";
  
  function BalancesCard({
    netBalances,
    balances,
    onQuickSettle, settlingBalance
  }) {
  
    return (
      <>
        <Card>
  
          <CardHeader>
            <CardTitle>
              Net Balances
            </CardTitle>
          </CardHeader>
  
          <CardContent>
  
            <div className="space-y-3">
  
              {netBalances.map(
                (balance) => (
  
                  <div
                    key={balance.user.id}
                    className="
                      flex
                      justify-between
                    "
                  >
  
                    <span>
                      {balance.user.name}
                    </span>
  
                    <span>
  
                      {balance.amount > 0
                        ? `Gets ₹${balance.amount}`
                        : balance.amount < 0
                        ? `Owes ₹${Math.abs(balance.amount)}`
                        : "Settled"}
  
                    </span>
  
                  </div>
  
                )
              )}
  
            </div>
  
          </CardContent>
  
        </Card>
  
        <Card>
  
          <CardHeader>
            <CardTitle>
              Suggested Settlements
            </CardTitle>
          </CardHeader>
  
          <CardContent>

  {balances.length === 0 ? (

    <p>
      Everyone is settled 🎉
    </p>

  ) : (

    <div className="space-y-3">

      {balances.map(
        (
          balance,
          index
        ) => (

          <div
            key={index}
            className="
              flex
              justify-between
              items-center
            "
          >

            <div>

              <strong>
                {balance.from.name}
              </strong>

              {" owes "}

              <strong>
                {balance.to.name}
              </strong>

              {" ₹"}

              {balance.amount}

            </div>

            <Button
  size="sm"
  disabled={
    settlingBalance ===
    `${balance.from.id}-${balance.to.id}`
  }
  onClick={() =>
    onQuickSettle(balance)
  }
>
  {settlingBalance ===
  balance.from.id
    ? "Settling..."
    : "Settle Up"}
</Button>

          </div>

        )
      )}

    </div>

  )}

</CardContent>
  
        </Card>
      </>
    );
  }
  
  export default BalancesCard;
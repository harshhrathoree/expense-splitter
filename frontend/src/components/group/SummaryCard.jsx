import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  
  function SummaryCard({ summary }) {
  
    if (!summary) return null;
  
    return (
      <Card>
  
        <CardHeader>
          <CardTitle>
            Group Summary
          </CardTitle>
        </CardHeader>
  
        <CardContent>
  
          <div className="grid grid-cols-2 gap-4">
  
            <div>
              <p className="text-sm text-muted-foreground">
                Members
              </p>
              <p className="text-xl font-bold">
                {summary.memberCount}
              </p>
            </div>
  
            <div>
              <p className="text-sm text-muted-foreground">
                Expenses
              </p>
              <p className="text-xl font-bold">
                {summary.expenseCount}
              </p>
            </div>
  
            <div>
              <p className="text-sm text-muted-foreground">
                Settlements
              </p>
              <p className="text-xl font-bold">
                {summary.settlementCount}
              </p>
            </div>
  
            <div>
              <p className="text-sm text-muted-foreground">
                Total Expenses
              </p>
              <p className="text-xl font-bold">
                ₹{summary.totalExpenses}
              </p>
            </div>
  
            <div>
              <p className="text-sm text-muted-foreground">
                Total Settled
              </p>
              <p className="text-xl font-bold">
                ₹{summary.totalSettlements}
              </p>
            </div>
  
          </div>
  
        </CardContent>
  
      </Card>
    );
  }
  
  export default SummaryCard;
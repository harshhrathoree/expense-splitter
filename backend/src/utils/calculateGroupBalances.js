export const calculateGroupBalances = (
    group,
    expenses,
    settlements
  ) => {
  
    const netMap = new Map();
  
    group.members.forEach((member) => {
      netMap.set(
        member.user._id.toString(),
        0
      );
    });
  
    // Expenses
  
    for (const expense of expenses) {
  
      const paidBy =
        expense.paidBy.toString();
  
      netMap.set(
        paidBy,
        netMap.get(paidBy) +
          expense.amount
      );
  
      for (
        const participant
        of expense.participants
      ) {
  
        const userId =
          participant.user.toString();
  
        netMap.set(
          userId,
          netMap.get(userId) -
            participant.shareAmount
        );
      }
    }
  
    // Settlements
  
    for (
      const settlement
      of settlements
    ) {
  
      const fromUser =
        settlement.fromUser.toString();
  
      const toUser =
        settlement.toUser.toString();
  
      netMap.set(
        fromUser,
        netMap.get(fromUser) +
          settlement.amount
      );
  
      netMap.set(
        toUser,
        netMap.get(toUser) -
          settlement.amount
      );
    }
  
    const netBalances =
      group.members.map(
        (member) => ({
          user: {
            id:
              member.user._id,
            name:
              member.user.name,
          },
          amount:
            Number(
              netMap
                .get(
                  member.user._id.toString()
                )
                .toFixed(2)
            ),
        })
      );
  
    const debtors = [];
    const creditors = [];
  
    for (
      const member
      of group.members
    ) {
  
      const userId =
        member.user._id.toString();
  
      const amount =
        netMap.get(userId);
  
      if (amount < 0) {
  
        debtors.push({
          user: member.user,
          amount:
            Math.abs(amount),
        });
  
      } else if (
        amount > 0
      ) {
  
        creditors.push({
          user: member.user,
          amount,
        });
  
      }
    }
  
    const balances = [];
  
    let i = 0;
    let j = 0;
  
    while (
      i < debtors.length &&
      j < creditors.length
    ) {
  
      const debtor =
        debtors[i];
  
      const creditor =
        creditors[j];
  
      const settleAmount =
        Math.min(
          debtor.amount,
          creditor.amount
        );
  
      balances.push({
        from: {
          id:
            debtor.user._id,
          name:
            debtor.user.name,
        },
        to: {
          id:
            creditor.user._id,
          name:
            creditor.user.name,
        },
        amount:
          Number(
            settleAmount.toFixed(
              2
            )
          ),
      });
  
      debtor.amount -=
        settleAmount;
  
      creditor.amount -=
        settleAmount;
  
      if (
        debtor.amount <
        0.01
      )
        i++;
  
      if (
        creditor.amount <
        0.01
      )
        j++;
    }
  
    return {
      netBalances,
      balances,
    };
  };
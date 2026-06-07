import {
  useEffect,
  useState,
  useCallback,
} from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Checkbox,
} from "@/components/ui/checkbox";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  createExpense,
  deleteExpense,
  updateExpense,
} from "@/services/expense.service";


import {
  useParams,
} from "react-router-dom";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import {
  searchUserByMobile,
} from "@/services/user.service";
import useAuth from "@/hooks/useAuth";

import {
  getGroupById,
} from "@/services/group.service";
import {
  getGroupExpenses,
} from "@/services/expense.service";

import {
  getGroupSummary,
} from "@/services/summary.service";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { addMember } from "@/services/group.service";
import {
  getGroupBalances,
} from "@/services/balance.service";

import {
  getSettlements,
  createSettlement,
  deleteSettlement,
  updateSettlement,
} from "@/services/settlement.service";

function GroupDetails() {

  const { groupId } =
    useParams();

  const { accessToken } =
    useAuth();

  const [group, setGroup] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [open, setOpen] =
    useState(false);
  
  const [mobileNumber,
    setMobileNumber] =
    useState("");
  
  const [searchedUser,
    setSearchedUser] =
    useState(null);
  
  const [searching,
    setSearching] =
    useState(false);

  const [expenses, setExpenses] =
    useState([]);

  const [expenseOpen,
    setExpenseOpen] =
    useState(false);
  
  const [title,
    setTitle] =
    useState("");
  
  const [expenseDescription,
    setExpenseDescription] =
    useState("");
  
  const [amount,
    setAmount] =
    useState("");
  
  const [paidBy,
    setPaidBy] =
    useState("");
  
  const [
    selectedParticipants,
    setSelectedParticipants,
  ] = useState([]);

  const [summary, setSummary] =
    useState(null);

  const [balances, setBalances] =
    useState([]);

  const [
    netBalances,
    setNetBalances,
  ] = useState([]);

  const [settlements,
    setSettlements] =
    useState([]);

  const [
    settlementOpen,
    setSettlementOpen,
  ] = useState(false);

  const [fromUser,
    setFromUser] =
    useState("");

  const [toUser,
    setToUser] =
    useState("");

  const [settlementAmount,
    setSettlementAmount] =
    useState("");

  // ── Edit settlement state ──
  const [editSettlementOpen,
    setEditSettlementOpen] =
    useState(false);

  const [editingSettlement,
    setEditingSettlement] =
    useState(null);

  const [editFromUser,
    setEditFromUser] =
    useState("");

  const [editToUser,
    setEditToUser] =
    useState("");

  const [editSettlementAmount,
    setEditSettlementAmount] =
    useState("");

  // ── Edit expense state ──
  const [editExpenseOpen,
    setEditExpenseOpen] =
    useState(false);

  const [editingExpense,
    setEditingExpense] =
    useState(null);

  const [editTitle,
    setEditTitle] =
    useState("");

  const [editDescription,
    setEditDescription] =
    useState("");

  const [editAmount,
    setEditAmount] =
    useState("");

  const [editPaidBy,
    setEditPaidBy] =
    useState("");

  const [
    editSelectedParticipants,
    setEditSelectedParticipants,
  ] = useState([]);

  // ── Moved outside useEffect so all handlers can call them ──

  const fetchBalances =
    useCallback(async () => {
      const balanceData =
        await getGroupBalances(
          groupId,
          accessToken
        );

      setBalances(
        balanceData.balances
      );

      setNetBalances(
        balanceData.netBalances
      );
    }, [groupId, accessToken]);

  const fetchSummary =
    useCallback(async () => {
      const summaryData =
        await getGroupSummary(
          groupId,
          accessToken
        );

      setSummary(
        summaryData.summary
      );
    }, [groupId, accessToken]);

  const fetchSettlements =
    useCallback(async () => {
      const settlementData =
        await getSettlements(
          groupId,
          accessToken
        );

      setSettlements(
        settlementData.settlements
      );
    }, [groupId, accessToken]);

  // ────────────────────────────────────────────────────────────

  const handleSearchUser =
    async () => {

      try {

        setSearching(true);

        const data =
          await searchUserByMobile(
            mobileNumber,
            accessToken
          );

        setSearchedUser(
          data.user
        );

      } catch (error) {

        console.error(error);

        setSearchedUser(
          null
        );

      } finally {

        setSearching(false);

      }
    };

  const handleAddMember =
    async () => {
      try {

        if (!searchedUser) {
          return;
        }

        const data =
          await addMember(
            groupId,
            mobileNumber,
            accessToken
          );

        setGroup(data.group);

        setMobileNumber("");

        setSearchedUser(null);

        setOpen(false);

      } catch (error) {
        console.error(error);
      }
    };

  const handleParticipantChange =
    (userId) => {

      setSelectedParticipants(
        (prev) => {

          if (
            prev.includes(userId)
          ) {
            return prev.filter(
              (id) =>
                id !== userId
            );
          }

          return [
            ...prev,
            userId,
          ];
        }
      );
    };

  const handleCreateExpense =
    async () => {
      try {

        if (Number(amount) <= 0) {
          alert(
            "Amount must be greater than 0"
          );
        
          return;
        }

        const payload = {
          title,
          description:
            expenseDescription,
          amount:
            Number(amount),
          paidBy,
          splitType:
            "equal",
          participants:
            selectedParticipants,
        };

        const data =
          await createExpense(
            groupId,
            payload,
            accessToken
          );

        setExpenses(
          (prev) => [
            data.expense,
            ...prev,
          ]
        );

        // Refresh balances and summary after a new expense
        await Promise.all([
          fetchBalances(),
          fetchSummary(),
        ]);

        setTitle("");
        setExpenseDescription("");
        setAmount("");
        setPaidBy("");

        setSelectedParticipants(
          []
        );

        setExpenseOpen(
          false
        );

      } catch (error) {
        console.error(error);
      }
    };

  const handleDeleteExpense =
    async (expenseId) => {
      if (
        !window.confirm(
          "Delete this expense? Balances will be recalculated."
        )
      ) {
        return;
      }

      try {

        await deleteExpense(
          expenseId,
          accessToken
        );

        setExpenses(
          (prev) =>
            prev.filter(
              (e) => e._id !== expenseId
            )
        );

        await Promise.all([
          fetchBalances(),
          fetchSummary(),
        ]);

      } catch (error) {
        console.error(error);
      }
    };

  const handleOpenEditExpense =
    (expense) => {
      setEditingExpense(expense);
      setEditTitle(expense.title);
      setEditDescription(
        expense.description || ""
      );
      setEditAmount(
        String(expense.amount)
      );

      // paidBy may be a populated object {_id, name} or a raw string ID
      setEditPaidBy(
        typeof expense.paidBy === "object"
          ? expense.paidBy._id
          : expense.paidBy
      );

      // participants are stored as {user: {_id, name}, shareAmount}
      // after population, or {user: ObjectId, shareAmount} unpopulated
      setEditSelectedParticipants(
        expense.participants.map((p) => {
          if (typeof p.user === "object") {
            return p.user._id;
          }
          if (typeof p.user === "string") {
            return p.user;
          }
          // fallback: participant is a plain user id string
          return typeof p === "object" ? p._id : p;
        })
      );

      setEditExpenseOpen(true);
    };

  const handleEditParticipantChange =
    (userId) => {
      setEditSelectedParticipants(
        (prev) => {
          if (prev.includes(userId)) {
            return prev.filter(
              (id) => id !== userId
            );
          }
          return [...prev, userId];
        }
      );
    };

  const handleUpdateExpense =
    async () => {
      try {

        if (Number(editAmount) <= 0) {
          alert(
            "Amount must be greater than 0"
          );
          return;
        }

        const payload = {
          title: editTitle,
          description: editDescription,
          amount: Number(editAmount),
          paidBy: editPaidBy,
          participants:
            editSelectedParticipants,
        };

        await updateExpense(
            editingExpense._id,
            payload,
            accessToken
          );

        // Re-fetch expenses so the list always reflects
        // the server's response regardless of response shape
        const expenseData =
          await getGroupExpenses(
            groupId,
            accessToken
          );

        setExpenses(
          expenseData.expenses
        );

        await Promise.all([
          fetchBalances(),
          fetchSummary(),
        ]);

        setEditExpenseOpen(false);
        setEditingExpense(null);

      } catch (error) {
        console.error(
          "Update expense failed:",
          error?.response?.data?.message || error.message
        );
        alert(
          error?.response?.data?.message ||
          "Failed to update expense"
        );
      }
    };

  const handleCreateSettlement =
    async () => {

      try {

        if (
          Number(
            settlementAmount
          ) <= 0
        ) {
          return;
        }

        if (
          fromUser === toUser
        ) {
          alert(
            "From and To user cannot be same"
          );
        
          return;
        }

        const payload = {
          fromUser,
          toUser,
          amount: Number(
            settlementAmount
          ),
        };

        const data =
          await createSettlement(
            groupId,
            payload,
            accessToken
          );

        setSettlements(
          (prev) => [
            data.settlement,
            ...prev,
          ]
        );

        // Refresh balances and summary after settlement
        await Promise.all([
          fetchBalances(),
          fetchSummary(),
        ]);

        setFromUser("");
        setToUser("");
        setSettlementAmount("");

        setSettlementOpen(
          false
        );

      } catch (error) {
        console.error(error);
      }
    };

  const handleDeleteSettlement =
    async (settlementId) => {
      if (
        !window.confirm(
          "Delete this settlement? Balances will be recalculated."
        )
      ) {
        return;
      }

      try {

        await deleteSettlement(
          settlementId,
          accessToken
        );

        setSettlements(
          (prev) =>
            prev.filter(
              (s) =>
                s._id !== settlementId
            )
        );

        await Promise.all([
          fetchBalances(),
          fetchSummary(),
        ]);

      } catch (error) {
        console.error(error);
      }
    };

  const handleOpenEditSettlement =
    (settlement) => {
      setEditingSettlement(
        settlement
      );
      setEditFromUser(
        settlement.fromUser._id
      );
      setEditToUser(
        settlement.toUser._id
      );
      setEditSettlementAmount(
        String(settlement.amount)
      );
      setEditSettlementOpen(true);
    };

  const handleUpdateSettlement =
    async () => {
      try {

        if (
          Number(editSettlementAmount) <= 0
        ) {
          alert(
            "Amount must be greater than 0"
          );
          return;
        }

        if (editFromUser === editToUser) {
          alert(
            "From and To user cannot be same"
          );
          return;
        }

        const payload = {
          fromUser: editFromUser,
          toUser: editToUser,
          amount: Number(
            editSettlementAmount
          ),
        };

        const data =
          await updateSettlement(
            editingSettlement._id,
            payload,
            accessToken
          );

        setSettlements(
          (prev) =>
            prev.map((s) =>
              s._id === editingSettlement._id
                ? data.settlement
                : s
            )
        );

        await Promise.all([
          fetchBalances(),
          fetchSummary(),
        ]);

        setEditSettlementOpen(false);
        setEditingSettlement(null);
        setEditFromUser("");
        setEditToUser("");
        setEditSettlementAmount("");

      } catch (error) {
        console.error(error);
      }
    };

  useEffect(() => {

    if (!accessToken) return;

    const fetchGroup =
      async () => {
        try {

          const data =
            await getGroupById(
              groupId,
              accessToken
            );

          setGroup(
            data.group
          );

          const expenseData =
            await getGroupExpenses(
              groupId,
              accessToken
            );

          setExpenses(
            expenseData.expenses
          );

          // Use the stable callbacks defined above
          await Promise.all([
            fetchBalances(),
            fetchSummary(),
            fetchSettlements(),
          ]);

        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

    fetchGroup();

  }, [
    groupId,
    accessToken,
    fetchBalances,
    fetchSummary,
    fetchSettlements,
  ]);

  if (loading) {
    return (
      <DashboardLayout>
        Loading...
      </DashboardLayout>
    );
  }

  if (!group) {
    return (
      <DashboardLayout>
        Group not found
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
  
      <div className="mb-8">
  
        <h1 className="text-3xl font-bold">
          {group.name}
        </h1>
  
        <p className="text-muted-foreground mt-2">
          {group.description}
        </p>
  
      </div>
  
      <div className="grid gap-6">

      {summary && (

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

)}

{/* net balance */}
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
          key={
            balance.user.id
          }
          className="
            flex
            justify-between
          "
        >

          <span>
            {
              balance.user
                .name
            }
          </span>

          <span>

            {balance.amount > 0
              ? `Gets ₹${balance.amount}`
              : balance.amount < 0
              ? `Owes ₹${Math.abs(
                  balance.amount
                )}`
              : "Settled"}

          </span>

        </div>

      )
    )}

  </div>

</CardContent>

</Card>

{/* balance suggestion card */} 
<Card>

  <CardHeader>

    <CardTitle>
      Suggested Settlements
    </CardTitle>

  </CardHeader>

  <CardContent>

    <div className="space-y-3">

      {balances.map(
        (
          balance,
          index
        ) => (

          <div
            key={index}
          >

            <strong>
              {
                balance.from
                  .name
              }
            </strong>

            {" owes "}

            <strong>
              {
                balance.to
                  .name
              }
            </strong>

            {" ₹"}

            {balance.amount}

          </div>

        )
      )}

    </div>

  </CardContent>

</Card>
  
        <Card>
          <CardHeader>
            <CardTitle>
              Created By
            </CardTitle>
          </CardHeader>
  
          <CardContent>
            {group.createdBy.name}
          </CardContent>
        </Card>


        <div className="flex justify-end">
        <Dialog
  open={open}
  onOpenChange={(value) => {

    setOpen(value);

    if (!value) {
      setMobileNumber("");
      setSearchedUser(null);
    }

  }}
>

    <DialogTrigger asChild>
      <Button>
        Add Member
      </Button>
    </DialogTrigger>

    <DialogContent>

      <DialogHeader>
        <DialogTitle>
          Add Member
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4">

  <div>
    <Label>
      Mobile Number
    </Label>

    <Input
      value={mobileNumber}
      onChange={(e) =>
        setMobileNumber(
          e.target.value
        )
      }
      placeholder="8849037874"
    />
  </div>

  <Button
    variant="outline"
    className="w-full"
    onClick={
      handleSearchUser
    }
    disabled={
      searching ||
      !mobileNumber
    }
  >
    {searching
      ? "Searching..."
      : "Search User"}
  </Button>

  {searchedUser && (

    <Card>

      <CardContent className="pt-6">

        <p className="font-medium">
          {searchedUser.name}
        </p>

        <p className="text-sm text-muted-foreground">
          {searchedUser.email}
        </p>

        <p className="text-sm text-muted-foreground">
          {searchedUser.mobileNumber}
        </p>

        <Button
          className="w-full mt-4"
          onClick={
            handleAddMember
          }
        >
          Add To Group
        </Button>

      </CardContent>

    </Card>

  )}

</div>

    </DialogContent>

  </Dialog>

</div>
  
        <Card>
          <CardHeader>
            <CardTitle>
              Members (
              {group.members.length}
              )
            </CardTitle>
          </CardHeader>
  
          <CardContent>
  
            <div className="space-y-4">
  
              {group.members.map(
                (member) => (
                  <div
                    key={member._id}
                    className="
                      flex
                      justify-between
                      items-center
                      border-b
                      pb-2
                    "
                  >
                    <div>
                      <p className="font-medium">
                        {
                          member.user
                            .name
                        }
                      </p>
  
                      <p className="text-sm text-muted-foreground">
                        {
                          member.user
                            .email
                        }
                      </p>
                    </div>
  
                    <span className="text-sm">
                      {member.role}
                    </span>
                  </div>
                )
              )}
  
            </div>
  
          </CardContent>
        </Card>


{/* expenses card */}
        <Card>

  <CardHeader>

    <div className="flex justify-between items-center">

      <CardTitle>
        Expenses (
        {expenses.length}
        )
      </CardTitle>

      

      <Dialog
  open={expenseOpen}
  onOpenChange={
    setExpenseOpen
  }
>

  <DialogTrigger asChild>

    <Button>
      Add Expense
    </Button>

  </DialogTrigger>

  <DialogContent>

    <DialogHeader>

      <DialogTitle>
        Add Expense
      </DialogTitle>

    </DialogHeader>

    <div className="space-y-4">

      <Input
        placeholder="Title"
        value={title}
        onChange={(e) =>
          setTitle(
            e.target.value
          )
        }
      />

      <Input
        placeholder="Description"
        value={
          expenseDescription
        }
        onChange={(e) =>
          setExpenseDescription(
            e.target.value
          )
        }
      />

      <Input
        type="number"
        min="1"
        placeholder="Amount"
        value={amount}
        onChange={(e) =>
          setAmount(
            e.target.value
          )
        }
      />

      <div>

        <Label>
          Paid By
        </Label>

        <Select
          value={paidBy}
          onValueChange={
            setPaidBy
          }
        >

          <SelectTrigger>
            <SelectValue placeholder="Select Member" />
          </SelectTrigger>

          <SelectContent>

            {group.members.map(
              (member) => (
                <SelectItem
                  key={
                    member.user
                      ._id
                  }
                  value={
                    member.user
                      ._id
                  }
                >
                  {
                    member.user
                      .name
                  }
                </SelectItem>
              )
            )}

          </SelectContent>

        </Select>

      </div>

      <div>

        <Label>
          Participants
        </Label>

        <div className="space-y-2 mt-2">

          {group.members.map(
            (member) => (
              <div
                key={
                  member.user
                    ._id
                }
                className="
                  flex
                  items-center
                  gap-2
                "
              >

                <Checkbox
                  checked={selectedParticipants.includes(
                    member.user
                      ._id
                  )}
                  onCheckedChange={() =>
                    handleParticipantChange(
                      member.user
                        ._id
                    )
                  }
                />

                <span>
                  {
                    member.user
                      .name
                  }
                </span>

              </div>
            )
          )}

        </div>

      </div>

      <Button
        className="w-full"
        onClick={
          handleCreateExpense
        }
      >
        Create Expense
      </Button>

    </div>

  </DialogContent>

</Dialog>

    </div>

  </CardHeader>

  <CardContent>

    {expenses.length === 0 ? (

      <p>
        No expenses yet
      </p>

    ) : (

      <div className="space-y-4">

        {expenses.map(
          (expense) => (

            <div
              key={expense._id}
              className="
                border-b
                pb-4
              "
            >

              <div className="flex justify-between items-start">

                <h3 className="font-medium">
                  {expense.title}
                </h3>

                <div className="flex gap-2">

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleOpenEditExpense(
                        expense
                      )
                    }
                  >
                    Edit
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      handleDeleteExpense(
                        expense._id
                      )
                    }
                  >
                    Delete
                  </Button>

                </div>

              </div>

              <p className="text-sm text-muted-foreground">
                ₹{expense.amount}
              </p>

              <p className="text-sm">
                Paid by{" "}
                {
                  expense
                    .paidBy
                    .name
                }
              </p>

              <p className="text-sm">
                Participants:{" "}
                {
                  expense
                    .participants
                    .length
                }
              </p>

              <p className="text-sm">
                Split Type:{" "}
                {
                  expense
                    .splitType
                }
              </p>

            </div>

          )
        )}

      </div>

    )}

  </CardContent>

</Card>

{/* Edit Expense Dialog */}
<Dialog
  open={editExpenseOpen}
  onOpenChange={(val) => {
    setEditExpenseOpen(val);
    if (!val) setEditingExpense(null);
  }}
>

  <DialogContent>

    <DialogHeader>
      <DialogTitle>
        Edit Expense
      </DialogTitle>
    </DialogHeader>

    <div className="space-y-4">

      <Input
        placeholder="Title"
        value={editTitle}
        onChange={(e) =>
          setEditTitle(
            e.target.value
          )
        }
      />

      <Input
        placeholder="Description"
        value={editDescription}
        onChange={(e) =>
          setEditDescription(
            e.target.value
          )
        }
      />

      <Input
        type="number"
        min="1"
        placeholder="Amount"
        value={editAmount}
        onChange={(e) =>
          setEditAmount(
            e.target.value
          )
        }
      />

      <div>

        <Label>
          Paid By
        </Label>

        <Select
          value={editPaidBy}
          onValueChange={
            setEditPaidBy
          }
        >

          <SelectTrigger>
            <SelectValue placeholder="Select Member" />
          </SelectTrigger>

          <SelectContent>

            {group.members.map(
              (member) => (
                <SelectItem
                  key={member.user._id}
                  value={member.user._id}
                >
                  {member.user.name}
                </SelectItem>
              )
            )}

          </SelectContent>

        </Select>

      </div>

      <div>

        <Label>
          Participants
        </Label>

        <div className="space-y-2 mt-2">

          {group.members.map(
            (member) => (
              <div
                key={member.user._id}
                className="
                  flex
                  items-center
                  gap-2
                "
              >

                <Checkbox
                  checked={editSelectedParticipants.includes(
                    member.user._id
                  )}
                  onCheckedChange={() =>
                    handleEditParticipantChange(
                      member.user._id
                    )
                  }
                />

                <span>
                  {member.user.name}
                </span>

              </div>
            )
          )}

        </div>

      </div>

      <Button
        className="w-full"
        onClick={handleUpdateExpense}
      >
        Update Expense
      </Button>

    </div>

  </DialogContent>

</Dialog>


{/* settlements card */}
<Card>

  <CardHeader>

    <div className="flex justify-between items-center">

      <CardTitle>
        Settlements (
        {settlements.length}
        )
      </CardTitle>

      <Dialog
  open={settlementOpen}
  onOpenChange={
    setSettlementOpen
  }
>

  <DialogTrigger asChild>

    <Button>
      Create Settlement
    </Button>

  </DialogTrigger>

  <DialogContent>

    <DialogHeader>

      <DialogTitle>
        Create Settlement
      </DialogTitle>

    </DialogHeader>

    <div className="space-y-4">

      <div>

        <Label>
          From User
        </Label>

        <Select
          value={fromUser}
          onValueChange={
            setFromUser
          }
        >

          <SelectTrigger>
            <SelectValue placeholder="Select User" />
          </SelectTrigger>

          <SelectContent>

            {group.members.map(
              (member) => (
                <SelectItem
                  key={
                    member.user
                      ._id
                  }
                  value={
                    member.user
                      ._id
                  }
                >
                  {
                    member.user
                      .name
                  }
                </SelectItem>
              )
            )}

          </SelectContent>

        </Select>

      </div>

      <div>

        <Label>
          To User
        </Label>

        <Select
          value={toUser}
          onValueChange={
            setToUser
          }
        >

          <SelectTrigger>
            <SelectValue placeholder="Select User" />
          </SelectTrigger>

          <SelectContent>

            {group.members.map(
              (member) => (
                <SelectItem
                  key={
                    member.user
                      ._id
                  }
                  value={
                    member.user
                      ._id
                  }
                >
                  {
                    member.user
                      .name
                  }
                </SelectItem>
              )
            )}

          </SelectContent>

        </Select>

      </div>

      <Input
        type="number"
        min="1"
        placeholder="Amount"
        value={
          settlementAmount
        }
        onChange={(e) =>
          setSettlementAmount(
            e.target.value
          )
        }
      />

      <Button
        className="w-full"
        onClick={
          handleCreateSettlement
        }
      >
        Create Settlement
      </Button>

    </div>

  </DialogContent>

</Dialog>

    </div>

  </CardHeader>

  <CardContent>

    {settlements.length === 0 ? (

      <p>
        No settlements yet
      </p>

    ) : (

      <div className="space-y-4">

        {settlements.map(
          (
            settlement
          ) => (

            <div
              key={
                settlement._id
              }
              className="
                border-b
                pb-4
              "
            >

              <div className="flex justify-between items-start">

                <p>

                  <strong>
                    {
                      settlement
                        .fromUser
                        .name
                    }
                  </strong>

                  {" paid "}

                  <strong>
                    {
                      settlement
                        .toUser
                        .name
                    }
                  </strong>

                </p>

                <div className="flex gap-2">

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleOpenEditSettlement(
                        settlement
                      )
                    }
                  >
                    Edit
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      handleDeleteSettlement(
                        settlement._id
                      )
                    }
                  >
                    Delete
                  </Button>

                </div>

              </div>

              <p className="text-sm text-muted-foreground">

                ₹
                {
                  settlement
                    .amount
                }

              </p>

            </div>

          )
        )}

      </div>

    )}

  </CardContent>

</Card>

{/* Edit Settlement Dialog */}
<Dialog
  open={editSettlementOpen}
  onOpenChange={(val) => {
    setEditSettlementOpen(val);
    if (!val) {
      setEditingSettlement(null);
      setEditFromUser("");
      setEditToUser("");
      setEditSettlementAmount("");
    }
  }}
>

  <DialogContent>

    <DialogHeader>
      <DialogTitle>
        Edit Settlement
      </DialogTitle>
    </DialogHeader>

    <div className="space-y-4">

      <div>

        <Label>
          From User
        </Label>

        <Select
          value={editFromUser}
          onValueChange={
            setEditFromUser
          }
        >

          <SelectTrigger>
            <SelectValue placeholder="Select User" />
          </SelectTrigger>

          <SelectContent>

            {group.members.map(
              (member) => (
                <SelectItem
                  key={member.user._id}
                  value={member.user._id}
                >
                  {member.user.name}
                </SelectItem>
              )
            )}

          </SelectContent>

        </Select>

      </div>

      <div>

        <Label>
          To User
        </Label>

        <Select
          value={editToUser}
          onValueChange={
            setEditToUser
          }
        >

          <SelectTrigger>
            <SelectValue placeholder="Select User" />
          </SelectTrigger>

          <SelectContent>

            {group.members.map(
              (member) => (
                <SelectItem
                  key={member.user._id}
                  value={member.user._id}
                >
                  {member.user.name}
                </SelectItem>
              )
            )}

          </SelectContent>

        </Select>

      </div>

      <Input
        type="number"
        min="1"
        placeholder="Amount"
        value={editSettlementAmount}
        onChange={(e) =>
          setEditSettlementAmount(
            e.target.value
          )
        }
      />

      <Button
        className="w-full"
        onClick={handleUpdateSettlement}
      >
        Update Settlement
      </Button>

    </div>

  </DialogContent>

</Dialog>

      </div>
  
    </DashboardLayout>
  );
}

export default GroupDetails;
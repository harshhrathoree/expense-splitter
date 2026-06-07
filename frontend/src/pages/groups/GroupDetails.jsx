import { useEffect, useState, useCallback } from "react";
import SummaryCard from "@/components/group/SummaryCard";

import BalancesCard from "@/components/group/BalancesCard";

import MembersCard from "@/components/group/MembersCard";
// import ExpensesCard
// from "@/components/group/ExpensesCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

import { toast } from "sonner";
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

import { useParams } from "react-router-dom";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import { searchUserByMobile } from "@/services/user.service";
import useAuth from "@/hooks/useAuth";

import { getGroupById } from "@/services/group.service";
import { getGroupExpenses } from "@/services/expense.service";

import { getGroupSummary } from "@/services/summary.service";
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
import { getGroupBalances } from "@/services/balance.service";

import {
  getSettlements,
  createSettlement,
  deleteSettlement,
  updateSettlement,
} from "@/services/settlement.service";

function GroupDetails() {
  const { groupId } = useParams();

  const { accessToken } = useAuth();

  const [group, setGroup] = useState(null);

  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);

  const [mobileNumber, setMobileNumber] = useState("");

  const [searchedUser, setSearchedUser] = useState(null);

  const [searching, setSearching] = useState(false);

  const [addingMember, setAddingMember] = useState(false);

  const [expenses, setExpenses] = useState([]);

  const [expenseOpen, setExpenseOpen] = useState(false);

  const [title, setTitle] = useState("");

  const [expenseDescription, setExpenseDescription] = useState("");

  const [amount, setAmount] = useState("");

  const [paidBy, setPaidBy] = useState("");

  const [selectedParticipants, setSelectedParticipants] = useState([]);

  const [creatingExpense, setCreatingExpense] = useState(false);

  const [deletingExpenseId, setDeletingExpenseId] = useState(null);

  const [updatingExpense, setUpdatingExpense] = useState(false);

  const [summary, setSummary] = useState(null);

  const [balances, setBalances] = useState([]);

  const [netBalances, setNetBalances] = useState([]);

  const [settlements, setSettlements] = useState([]);

  const [settlementOpen, setSettlementOpen] = useState(false);

  const [fromUser, setFromUser] = useState("");

  const [toUser, setToUser] = useState("");

  const [settlementAmount, setSettlementAmount] = useState("");

  const [creatingSettlement, setCreatingSettlement] = useState(false);

  const [deletingSettlementId, setDeletingSettlementId] = useState(null);

  const [updatingSettlement, setUpdatingSettlement] = useState(false);

  const [settlingBalance, setSettlingBalance] = useState(null);

  // ── Edit settlement state ──
  const [editSettlementOpen, setEditSettlementOpen] = useState(false);

  const [editingSettlement, setEditingSettlement] = useState(null);

  const [editFromUser, setEditFromUser] = useState("");

  const [editToUser, setEditToUser] = useState("");

  const [editSettlementAmount, setEditSettlementAmount] = useState("");

  // ── Edit expense state ──
  const [editExpenseOpen, setEditExpenseOpen] = useState(false);

  const [editingExpense, setEditingExpense] = useState(null);

  const [editTitle, setEditTitle] = useState("");

  const [editDescription, setEditDescription] = useState("");

  const [editAmount, setEditAmount] = useState("");

  const [editPaidBy, setEditPaidBy] = useState("");

  const [editSelectedParticipants, setEditSelectedParticipants] = useState([]);

  // ── Moved outside useEffect so all handlers can call them ──

  const fetchBalances = useCallback(async () => {
    const balanceData = await getGroupBalances(groupId, accessToken);

    setBalances(balanceData.balances);

    setNetBalances(balanceData.netBalances);
  }, [groupId, accessToken]);

  const fetchSummary = useCallback(async () => {
    const summaryData = await getGroupSummary(groupId, accessToken);

    setSummary(summaryData.summary);
  }, [groupId, accessToken]);

  const fetchSettlements = useCallback(async () => {
    const settlementData = await getSettlements(groupId, accessToken);

    setSettlements(settlementData.settlements);
  }, [groupId, accessToken]);

  // ────────────────────────────────────────────────────────────

  const handleSearchUser = async () => {
    try {
      setSearching(true);

      const data = await searchUserByMobile(mobileNumber, accessToken);

      setSearchedUser(data.user);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong");

      setSearchedUser(null);
    } finally {
      setSearching(false);
    }
  };

  const handleAddMember = async () => {
    try {
      if (!searchedUser) {
        return;
      }

      setAddingMember(true);

      const data = await addMember(groupId, mobileNumber, accessToken);

      setGroup(data.group);

      setMobileNumber("");

      setSearchedUser(null);

      setOpen(false);

      toast.success("Member added successfully");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setAddingMember(false);
    }
  };

  const handleParticipantChange = (userId) => {
    setSelectedParticipants((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      }

      return [...prev, userId];
    });
  };

  const handleCreateExpense = async () => {
    try {
      if (Number(amount) <= 0) {
        toast.error("Amount must be greater than 0");

        return;
      }

      setCreatingExpense(true);

      const payload = {
        title,
        description: expenseDescription,
        amount: Number(amount),
        paidBy,
        splitType: "equal",
        participants: selectedParticipants,
      };

      const data = await createExpense(groupId, payload, accessToken);

      setExpenses((prev) => [data.expense, ...prev]);

      await Promise.all([fetchBalances(), fetchSummary()]);

      setTitle("");
      setExpenseDescription("");
      setAmount("");
      setPaidBy("");

      setSelectedParticipants([]);

      setExpenseOpen(false);

      toast.success("Expense created successfully");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setCreatingExpense(false);
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (
      !window.confirm("Delete this expense? Balances will be recalculated.")
    ) {
      return;
    }

    try {
      setDeletingExpenseId(expenseId);

      await deleteExpense(expenseId, accessToken);

      setExpenses((prev) => prev.filter((e) => e._id !== expenseId));

      await Promise.all([fetchBalances(), fetchSummary()]);

      toast.success("Expense deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setDeletingExpenseId(null);
    }
  };

  const handleOpenEditExpense = (expense) => {
    setEditingExpense(expense);
    setEditTitle(expense.title);
    setEditDescription(expense.description || "");
    setEditAmount(String(expense.amount));

    setEditPaidBy(
      typeof expense.paidBy === "object" ? expense.paidBy._id : expense.paidBy,
    );

    setEditSelectedParticipants(
      expense.participants.map((p) => {
        if (typeof p.user === "object") {
          return p.user._id;
        }
        if (typeof p.user === "string") {
          return p.user;
        }
        return typeof p === "object" ? p._id : p;
      }),
    );

    setEditExpenseOpen(true);
  };

  const handleEditParticipantChange = (userId) => {
    setEditSelectedParticipants((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      }
      return [...prev, userId];
    });
  };

  const handleUpdateExpense = async () => {
    try {
      if (Number(editAmount) <= 0) {
        toast.error("Amount must be greater than 0");
        return;
      }

      setUpdatingExpense(true);

      const payload = {
        title: editTitle,
        description: editDescription,
        amount: Number(editAmount),
        paidBy: editPaidBy,
        participants: editSelectedParticipants,
      };

      await updateExpense(editingExpense._id, payload, accessToken);

      const expenseData = await getGroupExpenses(groupId, accessToken);

      setExpenses(expenseData.expenses);

      await Promise.all([fetchBalances(), fetchSummary()]);

      setEditExpenseOpen(false);
      setEditingExpense(null);

      toast.success("Expense updated successfully");
    } catch (error) {
      console.error(
        "Update expense failed:",
        error?.response?.data?.message || error.message,
      );
      toast.error(error?.response?.data?.message || "Failed to update expense");
    } finally {
      setUpdatingExpense(false);
    }
  };

  const handleCreateSettlement = async () => {
    try {
      if (Number(settlementAmount) <= 0) {
        return;
      }

      if (fromUser === toUser) {
        toast.error("From and To user cannot be same");

        return;
      }

      setCreatingSettlement(true);

      const payload = {
        fromUser,
        toUser,
        amount: Number(settlementAmount),
      };

      const data = await createSettlement(groupId, payload, accessToken);

      setSettlements((prev) => [data.settlement, ...prev]);

      await Promise.all([fetchBalances(), fetchSummary()]);

      setFromUser("");
      setToUser("");
      setSettlementAmount("");

      setSettlementOpen(false);

      toast.success("Settlement created successfully");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setCreatingSettlement(false);
    }
  };

  const handleDeleteSettlement = async (settlementId) => {
    if (
      !window.confirm("Delete this settlement? Balances will be recalculated.")
    ) {
      return;
    }

    try {
      setDeletingSettlementId(settlementId);

      await deleteSettlement(settlementId, accessToken);

      setSettlements((prev) => prev.filter((s) => s._id !== settlementId));

      await Promise.all([fetchBalances(), fetchSummary()]);

      toast.success("Settlement deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setDeletingSettlementId(null);
    }
  };

  const handleOpenEditSettlement = (settlement) => {
    setEditingSettlement(settlement);
    setEditFromUser(settlement.fromUser._id);
    setEditToUser(settlement.toUser._id);
    setEditSettlementAmount(String(settlement.amount));
    setEditSettlementOpen(true);
  };

  const handleUpdateSettlement = async () => {
    try {
      if (Number(editSettlementAmount) <= 0) {
        toast.error("Amount must be greater than 0");
        return;
      }

      if (editFromUser === editToUser) {
        toast.error("From and To user cannot be same");
        return;
      }

      setUpdatingSettlement(true);

      const payload = {
        fromUser: editFromUser,
        toUser: editToUser,
        amount: Number(editSettlementAmount),
      };

      const data = await updateSettlement(
        editingSettlement._id,
        payload,
        accessToken,
      );

      setSettlements((prev) =>
        prev.map((s) =>
          s._id === editingSettlement._id ? data.settlement : s,
        ),
      );

      await Promise.all([fetchBalances(), fetchSummary()]);

      setEditSettlementOpen(false);
      setEditingSettlement(null);
      setEditFromUser("");
      setEditToUser("");
      setEditSettlementAmount("");

      toast.success("Settlement updated successfully");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setUpdatingSettlement(false);
    }
  };

  const handleQuickSettle = async (balance) => {
    try {
      setSettlingBalance(`${balance.from.id}-${balance.to.id}`);

      const payload = {
        fromUser: balance.from.id,

        toUser: balance.to.id,

        amount: balance.amount,
      };

      const data = await createSettlement(groupId, payload, accessToken);

      setSettlements((prev) => [data.settlement, ...prev]);

      await Promise.all([fetchBalances(), fetchSummary()]);

      toast.success("Settlement recorded");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to settle");
    } finally {
      setSettlingBalance(null);
    }
  };

  useEffect(() => {
    if (!accessToken) return;

    const fetchGroup = async () => {
      try {
        const data = await getGroupById(groupId, accessToken);

        setGroup(data.group);

        const expenseData = await getGroupExpenses(groupId, accessToken);

        setExpenses(expenseData.expenses);

        await Promise.all([
          fetchBalances(),
          fetchSummary(),
          fetchSettlements(),
        ]);
      } catch (error) {
        console.error(error);
        toast.error(error?.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, [groupId, accessToken, fetchBalances, fetchSummary, fetchSettlements]);

  if (loading) {
    return <DashboardLayout>Loading...</DashboardLayout>;
  }

  if (!group) {
    return <DashboardLayout>Group not found</DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{group.name}</h1>

        <p className="text-muted-foreground mt-2">{group.description}</p>
      </div>

      <div className="grid gap-6">
        <SummaryCard summary={summary} />

        <BalancesCard
          netBalances={netBalances}
          balances={balances}
          onQuickSettle={handleQuickSettle}
          settlingBalance={settlingBalance}
        />
        <Card>
          <CardHeader>
            <CardTitle>Created By</CardTitle>
          </CardHeader>

          <CardContent>{group.createdBy.name}</CardContent>
        </Card>

        <MembersCard
          members={group.members}
          addMemberButton={
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
                <Button>Add Member</Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Member</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                  <div>
                    <Label>Mobile Number</Label>

                    <Input
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="8849037874"
                    />
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleSearchUser}
                    disabled={searching || !mobileNumber}
                  >
                    {searching ? "Searching..." : "Search User"}
                  </Button>

                  {searchedUser && (
                    <Card>
                      <CardContent className="pt-6">
                        <p className="font-medium">{searchedUser.name}</p>

                        <p className="text-sm text-muted-foreground">
                          {searchedUser.email}
                        </p>

                        <p className="text-sm text-muted-foreground">
                          {searchedUser.mobileNumber}
                        </p>

                        <Button
                          className="w-full mt-4"
                          onClick={handleAddMember}
                          disabled={addingMember}
                        >
                          {addingMember ? "Adding..." : "Add To Group"}
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          }
        />
        {/* expenses card */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Expenses ({expenses.length})</CardTitle>

              <Dialog open={expenseOpen} onOpenChange={setExpenseOpen}>
                <DialogTrigger asChild>
                  <Button>Add Expense</Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Expense</DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4">
                    <Input
                      placeholder="Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />

                    <Input
                      placeholder="Description"
                      value={expenseDescription}
                      onChange={(e) => setExpenseDescription(e.target.value)}
                    />

                    <Input
                      type="number"
                      min="1"
                      placeholder="Amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />

                    <div>
                      <Label>Paid By</Label>

                      <Select value={paidBy} onValueChange={setPaidBy}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Member" />
                        </SelectTrigger>

                        <SelectContent>
                          {group.members.map((member) => (
                            <SelectItem
                              key={member.user._id}
                              value={member.user._id}
                            >
                              {member.user.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Participants</Label>

                      <div className="space-y-2 mt-2">
                        {group.members.map((member) => (
                          <div
                            key={member.user._id}
                            className="flex items-center gap-2"
                          >
                            <Checkbox
                              checked={selectedParticipants.includes(
                                member.user._id,
                              )}
                              onCheckedChange={() =>
                                handleParticipantChange(member.user._id)
                              }
                            />
                            <span>{member.user.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button
                      className="w-full"
                      onClick={handleCreateExpense}
                      disabled={creatingExpense}
                    >
                      {creatingExpense ? "Creating..." : "Create Expense"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>

          <CardContent>
            {expenses.length === 0 ? (
              <p>No expenses yet</p>
            ) : (
              <div className="space-y-4">
                {expenses.map((expense) => (
                  <div key={expense._id} className="border-b pb-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">{expense.title}</h3>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEditExpense(expense)}
                          disabled={deletingExpenseId === expense._id}
                        >
                          Edit
                        </Button>

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteExpense(expense._id)}
                          disabled={deletingExpenseId === expense._id}
                        >
                          {deletingExpenseId === expense._id
                            ? "Deleting..."
                            : "Delete"}
                        </Button>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      ₹{expense.amount}
                    </p>

                    <p className="text-sm">Paid by {expense.paidBy.name}</p>

                    <p className="text-sm">
                      Participants: {expense.participants.length}
                    </p>

                    <p className="text-sm">Split Type: {expense.splitType}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Expense Dialog */}
        <Dialog
          open={editExpenseOpen}
          onOpenChange={(val) => {
            if (updatingExpense) return;
            setEditExpenseOpen(val);
            if (!val) setEditingExpense(null);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Expense</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <Input
                placeholder="Title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />

              <Input
                placeholder="Description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />

              <Input
                type="number"
                min="1"
                placeholder="Amount"
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
              />

              <div>
                <Label>Paid By</Label>

                <Select value={editPaidBy} onValueChange={setEditPaidBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Member" />
                  </SelectTrigger>

                  <SelectContent>
                    {group.members.map((member) => (
                      <SelectItem key={member.user._id} value={member.user._id}>
                        {member.user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Participants</Label>

                <div className="space-y-2 mt-2">
                  {group.members.map((member) => (
                    <div
                      key={member.user._id}
                      className="flex items-center gap-2"
                    >
                      <Checkbox
                        checked={editSelectedParticipants.includes(
                          member.user._id,
                        )}
                        onCheckedChange={() =>
                          handleEditParticipantChange(member.user._id)
                        }
                      />
                      <span>{member.user.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                className="w-full"
                onClick={handleUpdateExpense}
                disabled={updatingExpense}
              >
                {updatingExpense ? "Updating..." : "Update Expense"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* settlements card */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Settlements ({settlements.length})</CardTitle>

              <Dialog open={settlementOpen} onOpenChange={setSettlementOpen}>
                <DialogTrigger asChild>
                  <Button>Create Settlement</Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Settlement</DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div>
                      <Label>From User</Label>

                      <Select value={fromUser} onValueChange={setFromUser}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select User" />
                        </SelectTrigger>

                        <SelectContent>
                          {group.members.map((member) => (
                            <SelectItem
                              key={member.user._id}
                              value={member.user._id}
                            >
                              {member.user.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>To User</Label>

                      <Select value={toUser} onValueChange={setToUser}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select User" />
                        </SelectTrigger>

                        <SelectContent>
                          {group.members.map((member) => (
                            <SelectItem
                              key={member.user._id}
                              value={member.user._id}
                            >
                              {member.user.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Input
                      type="number"
                      min="1"
                      placeholder="Amount"
                      value={settlementAmount}
                      onChange={(e) => setSettlementAmount(e.target.value)}
                    />

                    <Button
                      className="w-full"
                      onClick={handleCreateSettlement}
                      disabled={creatingSettlement}
                    >
                      {creatingSettlement ? "Creating..." : "Create Settlement"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>

          <CardContent>
            {settlements.length === 0 ? (
              <p>No settlements yet</p>
            ) : (
              <div className="space-y-4">
                {settlements.map((settlement) => (
                  <div key={settlement._id} className="border-b pb-4">
                    <div className="flex justify-between items-start">
                      <p>
                        <strong>{settlement.fromUser.name}</strong>

                        {" paid "}

                        <strong>{settlement.toUser.name}</strong>
                      </p>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEditSettlement(settlement)}
                          disabled={deletingSettlementId === settlement._id}
                        >
                          Edit
                        </Button>

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteSettlement(settlement._id)}
                          disabled={deletingSettlementId === settlement._id}
                        >
                          {deletingSettlementId === settlement._id
                            ? "Deleting..."
                            : "Delete"}
                        </Button>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      ₹{settlement.amount}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Settlement Dialog */}
        <Dialog
          open={editSettlementOpen}
          onOpenChange={(val) => {
            if (updatingSettlement) return;
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
              <DialogTitle>Edit Settlement</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label>From User</Label>

                <Select value={editFromUser} onValueChange={setEditFromUser}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select User" />
                  </SelectTrigger>

                  <SelectContent>
                    {group.members.map((member) => (
                      <SelectItem key={member.user._id} value={member.user._id}>
                        {member.user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>To User</Label>

                <Select value={editToUser} onValueChange={setEditToUser}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select User" />
                  </SelectTrigger>

                  <SelectContent>
                    {group.members.map((member) => (
                      <SelectItem key={member.user._id} value={member.user._id}>
                        {member.user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Input
                type="number"
                min="1"
                placeholder="Amount"
                value={editSettlementAmount}
                onChange={(e) => setEditSettlementAmount(e.target.value)}
              />

              <Button
                className="w-full"
                onClick={handleUpdateSettlement}
                disabled={updatingSettlement}
              >
                {updatingSettlement ? "Updating..." : "Update Settlement"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

export default GroupDetails;

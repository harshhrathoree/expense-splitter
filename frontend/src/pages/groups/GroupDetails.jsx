import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SummaryCard from "@/components/group/SummaryCard";
import { NetBalancesCard, SettlementsCard } from "@/components/group/BalancesCard";
import MembersCard from "@/components/group/MembersCard";
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
import {
  ArrowLeft,
  Plus,
  Search,
  UserPlus,
  Receipt,
  HandCoins,
  Pencil,
  Trash2,
  Users,
  Crown,
  IndianRupee,
  Loader2,
} from "lucide-react";

function GroupDetails() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { accessToken, user } = useAuth();

  // Main data states
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [balances, setBalances] = useState([]);
  const [netBalances, setNetBalances] = useState([]);
  const [settlements, setSettlements] = useState([]);

  // Add member dialog
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [searchedUser, setSearchedUser] = useState(null);
  const [searching, setSearching] = useState(false);
  const [addingMember, setAddingMember] = useState(false);

  // Add expense dialog
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [expenseDescription, setExpenseDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [creatingExpense, setCreatingExpense] = useState(false);
  const [deletingExpenseId, setDeletingExpenseId] = useState(null);

  // Edit expense dialog
  const [editExpenseOpen, setEditExpenseOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editPaidBy, setEditPaidBy] = useState("");
  const [editSelectedParticipants, setEditSelectedParticipants] = useState([]);
  const [updatingExpense, setUpdatingExpense] = useState(false);

  // Settlement dialog
  const [settlementOpen, setSettlementOpen] = useState(false);
  const [fromUser, setFromUser] = useState("");
  const [toUser, setToUser] = useState("");
  const [settlementAmount, setSettlementAmount] = useState("");
  const [creatingSettlement, setCreatingSettlement] = useState(false);
  const [deletingSettlementId, setDeletingSettlementId] = useState(null);
  const [settlingBalance, setSettlingBalance] = useState(null);

  // Edit settlement dialog
  const [editSettlementOpen, setEditSettlementOpen] = useState(false);
  const [editingSettlement, setEditingSettlement] = useState(null);
  const [editFromUser, setEditFromUser] = useState("");
  const [editToUser, setEditToUser] = useState("");
  const [editSettlementAmount, setEditSettlementAmount] = useState("");
  const [updatingSettlement, setUpdatingSettlement] = useState(false);

  // Helper: Check if current user is admin
  const isCurrentUserAdmin = useCallback(() => {
    if (!group || !user) return false;
    const currentMember = group.members.find(
      (m) => (m.user?._id === user._id) || (m.user === user._id)
    );
    return currentMember?.role === "admin" || currentMember?.role === "creator" || 
           group.createdBy?._id === user._id || group.createdBy === user._id;
  }, [group, user]);

  // Data fetching functions
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

  const fetchExpenses = useCallback(async () => {
    const expenseData = await getGroupExpenses(groupId, accessToken);
    setExpenses(expenseData.expenses);
  }, [groupId, accessToken]);

  // Add member handlers
  const handleSearchUser = async () => {
    try {
      setSearching(true);
      const data = await searchUserByMobile(mobileNumber, accessToken);
      setSearchedUser(data.user);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "User not found");
      setSearchedUser(null);
    } finally {
      setSearching(false);
    }
  };

  const handleAddMember = async () => {
    if (!searchedUser) return;
    try {
      setAddingMember(true);
      const data = await addMember(groupId, mobileNumber, accessToken);
      setGroup(data.group);
      setMobileNumber("");
      setSearchedUser(null);
      setAddMemberOpen(false);
      toast.success("Member added successfully");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to add member");
    } finally {
      setAddingMember(false);
    }
  };

  // Expense handlers
  const handleParticipantChange = (userId) => {
    setSelectedParticipants((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleCreateExpense = async () => {
    if (Number(amount) <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }
    try {
      setCreatingExpense(true);
      const payload = {
        title,
        description: expenseDescription,
        amount: Number(amount),
        paidBy,
        splitType: "equal",
        participants: selectedParticipants,
      };
      await createExpense(groupId, payload, accessToken);
      await Promise.all([fetchExpenses(), fetchBalances(), fetchSummary()]);
      resetExpenseForm();
      setExpenseOpen(false);
      toast.success("Expense created");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to create expense");
    } finally {
      setCreatingExpense(false);
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      setDeletingExpenseId(expenseId);
      await deleteExpense(expenseId, accessToken);
      setExpenses((prev) => prev.filter((e) => e._id !== expenseId));
      await Promise.all([fetchBalances(), fetchSummary()]);
      toast.success("Expense deleted");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to delete expense");
    } finally {
      setDeletingExpenseId(null);
    }
  };

  const handleOpenEditExpense = (expense) => {
    setEditingExpense(expense);
    setEditTitle(expense.title);
    setEditDescription(expense.description || "");
    setEditAmount(String(expense.amount));
    setEditPaidBy(typeof expense.paidBy === "object" ? expense.paidBy._id : expense.paidBy);
    setEditSelectedParticipants(
      expense.participants.map((p) => {
        if (typeof p.user === "object") return p.user._id;
        if (typeof p.user === "string") return p.user;
        return typeof p === "object" ? p._id : p;
      })
    );
    setEditExpenseOpen(true);
  };

  const handleEditParticipantChange = (userId) => {
    setEditSelectedParticipants((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleUpdateExpense = async () => {
    if (Number(editAmount) <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }
    try {
      setUpdatingExpense(true);
      const payload = {
        title: editTitle,
        description: editDescription,
        amount: Number(editAmount),
        paidBy: editPaidBy,
        participants: editSelectedParticipants,
      };
      await updateExpense(editingExpense._id, payload, accessToken);
      await Promise.all([fetchExpenses(), fetchBalances(), fetchSummary()]);
      setEditExpenseOpen(false);
      setEditingExpense(null);
      toast.success("Expense updated");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to update expense");
    } finally {
      setUpdatingExpense(false);
    }
  };

  const resetExpenseForm = () => {
    setTitle("");
    setExpenseDescription("");
    setAmount("");
    setPaidBy("");
    setSelectedParticipants([]);
  };

  // Settlement handlers
  const handleCreateSettlement = async () => {
    if (Number(settlementAmount) <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }
    if (fromUser === toUser) {
      toast.error("From and To user cannot be same");
      return;
    }
    try {
      setCreatingSettlement(true);
      const payload = { fromUser, toUser, amount: Number(settlementAmount) };
      await createSettlement(groupId, payload, accessToken);
      await Promise.all([fetchSettlements(), fetchBalances(), fetchSummary()]);
      resetSettlementForm();
      setSettlementOpen(false);
      toast.success("Settlement recorded");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to create settlement");
    } finally {
      setCreatingSettlement(false);
    }
  };

  const handleDeleteSettlement = async (settlementId) => {
    try {
      setDeletingSettlementId(settlementId);
      await deleteSettlement(settlementId, accessToken);
      setSettlements((prev) => prev.filter((s) => s._id !== settlementId));
      await Promise.all([fetchBalances(), fetchSummary()]);
      toast.success("Settlement deleted");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to delete settlement");
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
    if (Number(editSettlementAmount) <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }
    if (editFromUser === editToUser) {
      toast.error("From and To user cannot be same");
      return;
    }
    try {
      setUpdatingSettlement(true);
      const payload = { fromUser: editFromUser, toUser: editToUser, amount: Number(editSettlementAmount) };
      const data = await updateSettlement(editingSettlement._id, payload, accessToken);
      setSettlements((prev) =>
        prev.map((s) => (s._id === editingSettlement._id ? data.settlement : s))
      );
      await Promise.all([fetchBalances(), fetchSummary()]);
      resetEditSettlementForm();
      setEditSettlementOpen(false);
      toast.success("Settlement updated");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to update settlement");
    } finally {
      setUpdatingSettlement(false);
    }
  };

  const handleQuickSettle = async (balance) => {
    try {
      setSettlingBalance(`${balance.from.id}-${balance.to.id}`);
      const payload = { fromUser: balance.from.id, toUser: balance.to.id, amount: balance.amount };
      await createSettlement(groupId, payload, accessToken);
      await Promise.all([fetchSettlements(), fetchBalances(), fetchSummary()]);
      toast.success("Settled up!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to settle");
    } finally {
      setSettlingBalance(null);
    }
  };

  const resetSettlementForm = () => {
    setFromUser("");
    setToUser("");
    setSettlementAmount("");
  };

  const resetEditSettlementForm = () => {
    setEditingSettlement(null);
    setEditFromUser("");
    setEditToUser("");
    setEditSettlementAmount("");
  };

  // Initial data fetch
  useEffect(() => {
    if (!accessToken) return;
    const fetchGroup = async () => {
      try {
        const data = await getGroupById(groupId, accessToken);
        setGroup(data.group);
        document.title = `${data.group.name} | Expense Splitter`;
        const expenseData = await getGroupExpenses(groupId, accessToken);
        setExpenses(expenseData.expenses);
        await Promise.all([fetchBalances(), fetchSummary(), fetchSettlements()]);
      } catch (error) {
        console.error(error);
        toast.error(error?.response?.data?.message || "Failed to load group");
      } finally {
        setLoading(false);
      }
    };
    fetchGroup();
  }, [groupId, accessToken, fetchBalances, fetchSummary, fetchSettlements]);

  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6 animate-pulse">
          <div className="h-8 bg-stone-200 rounded w-64"></div>
          <div className="h-4 bg-stone-200 rounded w-96"></div>
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-stone-100 rounded-xl"></div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Not found state
  if (!group) {
    return (
      <DashboardLayout>
        <div className="text-center py-16">
          <div className="w-14 h-14 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-7 h-7 text-stone-400" />
          </div>
          <h2 className="text-xl font-medium text-stone-900 mb-2">Group not found</h2>
          <p className="text-stone-500 font-light mb-6">This group may have been deleted or you don't have access.</p>
          <Button onClick={() => navigate("/groups")} variant="outline" className="border-stone-200 text-stone-600 font-normal">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go back
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 md:space-y-8">
        {/* Header */}
        <div>
          <button
            onClick={() => navigate("/groups")}
            className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700 font-light mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to groups
          </button>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-light text-stone-900 tracking-tight truncate">
                {group.name}
              </h1>
              {group.description && (
                <p className="text-sm text-stone-500 mt-1 font-light">{group.description}</p>
              )}
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-1.5 text-xs text-stone-400 font-light">
                  <Users className="w-3.5 h-3.5" />
                  {group.members.length} {group.members.length === 1 ? "member" : "members"}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-stone-400 font-light">
                  <Crown className="w-3.5 h-3.5" />
                  {group.createdBy?.name}
                </div>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Dialog open={addMemberOpen} onOpenChange={setAddMemberOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 font-normal text-sm">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Member
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md border-stone-200 bg-white">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-medium text-stone-900">Add Member</DialogTitle>
                    <p className="text-sm text-stone-500 font-light mt-1">Search by mobile number to add</p>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="flex gap-2">
                      <Input
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        placeholder="Enter mobile number"
                        className="border-stone-200 bg-stone-50/50 focus:border-stone-400 focus:ring-0 rounded-lg h-11 text-sm flex-1"
                        onKeyDown={(e) => e.key === "Enter" && handleSearchUser()}
                      />
                      <Button
                        variant="outline"
                        onClick={handleSearchUser}
                        disabled={searching || !mobileNumber}
                        className="border-stone-200 text-stone-600 font-normal h-11"
                      >
                        {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                      </Button>
                    </div>
                    {searchedUser && (
                      <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
                        <p className="font-medium text-stone-900">{searchedUser.name}</p>
                        <p className="text-sm text-stone-500">{searchedUser.email}</p>
                        <p className="text-sm text-stone-500">{searchedUser.mobileNumber}</p>
                        <Button
                          className="w-full mt-3 bg-stone-900 hover:bg-stone-800 text-stone-50 font-normal"
                          onClick={handleAddMember}
                          disabled={addingMember}
                        >
                          {addingMember ? "Adding..." : "Add to Group"}
                        </Button>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Summary & Net Balances - Side by side */}
        <div className="grid gap-4 lg:grid-cols-2 items-start">
          <SummaryCard summary={summary} />
          <NetBalancesCard netBalances={netBalances} />
        </div>

        {/* Suggested Settlements - Full width */}
        <SettlementsCard 
          balances={balances} 
          onQuickSettle={handleQuickSettle} 
          settlingBalance={settlingBalance} 
        />

        {/* Members - with Leave Group built in */}
        <MembersCard 
          members={group.members} 
          currentUserId={user?._id}
          isAdmin={isCurrentUserAdmin()}
          netBalances={netBalances}
          groupId={groupId}
          accessToken={accessToken}
          onLeaveGroup={() => navigate("/groups")}
        />

        {/* Expenses */}
        <Card className="border-stone-200 shadow-none bg-white">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
            <div>
              <CardTitle className="text-lg font-medium text-stone-900 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-stone-400" />
                Expenses
              </CardTitle>
              <p className="text-sm text-stone-500 font-light mt-0.5">
                {expenses.length} {expenses.length === 1 ? "expense" : "expenses"} recorded
              </p>
            </div>
            <Dialog open={expenseOpen} onOpenChange={setExpenseOpen}>
              <DialogTrigger asChild>
                <Button className="bg-stone-900 hover:bg-stone-800 text-stone-50 font-normal w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Expense
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md border-stone-200 bg-white max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-lg font-medium text-stone-900">Add Expense</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="border-stone-200 bg-stone-50/50 focus:border-stone-400 focus:ring-0 rounded-lg h-11 text-sm" />
                  <Input placeholder="Description (optional)" value={expenseDescription} onChange={(e) => setExpenseDescription(e.target.value)} className="border-stone-200 bg-stone-50/50 focus:border-stone-400 focus:ring-0 rounded-lg h-11 text-sm" />
                  <Input type="number" min="1" placeholder="Amount (₹)" value={amount} onChange={(e) => setAmount(e.target.value)} className="border-stone-200 bg-stone-50/50 focus:border-stone-400 focus:ring-0 rounded-lg h-11 text-sm" />
                  <div>
                    <Label className="text-sm font-medium text-stone-700 mb-1.5 block">Paid By</Label>
                    <Select value={paidBy} onValueChange={setPaidBy}>
                      <SelectTrigger className="border-stone-200 bg-stone-50/50 focus:ring-0 rounded-lg h-11 text-sm">
                        <SelectValue placeholder="Select who paid" />
                      </SelectTrigger>
                      <SelectContent>
                        {group.members.map((member) => (
                          <SelectItem key={member.user._id} value={member.user._id}>{member.user.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-stone-700 mb-2 block">Participants</Label>
                    <div className="space-y-2 border border-stone-200 rounded-lg p-3">
                      {group.members.map((member) => (
                        <label key={member.user._id} className="flex items-center gap-3 cursor-pointer py-1">
                          <Checkbox checked={selectedParticipants.includes(member.user._id)} onCheckedChange={() => handleParticipantChange(member.user._id)} className="border-stone-300 data-[state=checked]:bg-stone-900 data-[state=checked]:border-stone-900" />
                          <span className="text-sm text-stone-700">{member.user.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <Button className="w-full bg-stone-900 hover:bg-stone-800 text-stone-50 font-normal h-11 rounded-lg" onClick={handleCreateExpense} disabled={creatingExpense || !title || !amount || !paidBy || selectedParticipants.length === 0}>
                    {creatingExpense ? "Creating..." : "Create Expense"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {expenses.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Receipt className="w-6 h-6 text-stone-400" />
                </div>
                <p className="text-stone-500 font-light">No expenses yet</p>
                <p className="text-sm text-stone-400 font-light mt-1">Add your first expense to get started</p>
              </div>
            ) : (
              <div className="divide-y divide-stone-100">
                {expenses.map((expense) => (
                  <div key={expense._id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-stone-900 truncate">{expense.title}</h3>
                        {expense.description && <p className="text-sm text-stone-500 font-light mt-0.5 truncate">{expense.description}</p>}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                          <span className="text-sm font-medium text-stone-900 flex items-center gap-1"><IndianRupee className="w-3.5 h-3.5 text-stone-400" />{expense.amount}</span>
                          <span className="text-xs text-stone-500">Paid by <span className="text-stone-700">{expense.paidBy?.name}</span></span>
                          <span className="text-xs text-stone-400">{expense.participants?.length} {expense.participants?.length === 1 ? "participant" : "participants"}</span>
                          <span className="text-xs px-2 py-0.5 bg-stone-100 text-stone-600 rounded-full capitalize">{expense.splitType}</span>
                        </div>
                      </div>
                      <div className="flex gap-1.5 flex-shrink-0">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-stone-400 hover:text-stone-600 hover:bg-stone-100" onClick={() => handleOpenEditExpense(expense)} disabled={deletingExpenseId === expense._id}><Pencil className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-stone-400 hover:text-red-600 hover:bg-red-50" onClick={() => handleDeleteExpense(expense._id)} disabled={deletingExpenseId === expense._id}>
                          {deletingExpenseId === expense._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Settlements */}
        <Card className="border-stone-200 shadow-none bg-white">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
            <div>
              <CardTitle className="text-lg font-medium text-stone-900 flex items-center gap-2">
                <HandCoins className="w-5 h-5 text-stone-400" />
                Settlements
              </CardTitle>
              <p className="text-sm text-stone-500 font-light mt-0.5">
                {settlements.length} {settlements.length === 1 ? "settlement" : "settlements"} recorded
              </p>
            </div>
            <Dialog open={settlementOpen} onOpenChange={setSettlementOpen}>
              <DialogTrigger asChild>
                <Button className="bg-stone-900 hover:bg-stone-800 text-stone-50 font-normal w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Record Settlement
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md border-stone-200 bg-white">
                <DialogHeader>
                  <DialogTitle className="text-lg font-medium text-stone-900">Record Settlement</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label className="text-sm font-medium text-stone-700 mb-1.5 block">From</Label>
                    <Select value={fromUser} onValueChange={setFromUser}>
                      <SelectTrigger className="border-stone-200 bg-stone-50/50 focus:ring-0 rounded-lg h-11 text-sm"><SelectValue placeholder="Who paid?" /></SelectTrigger>
                      <SelectContent>{group.members.map((m) => <SelectItem key={m.user._id} value={m.user._id}>{m.user.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-stone-700 mb-1.5 block">To</Label>
                    <Select value={toUser} onValueChange={setToUser}>
                      <SelectTrigger className="border-stone-200 bg-stone-50/50 focus:ring-0 rounded-lg h-11 text-sm"><SelectValue placeholder="Who received?" /></SelectTrigger>
                      <SelectContent>{group.members.map((m) => <SelectItem key={m.user._id} value={m.user._id}>{m.user.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <Input type="number" min="1" placeholder="Amount (₹)" value={settlementAmount} onChange={(e) => setSettlementAmount(e.target.value)} className="border-stone-200 bg-stone-50/50 focus:border-stone-400 focus:ring-0 rounded-lg h-11 text-sm" />
                  <Button className="w-full bg-stone-900 hover:bg-stone-800 text-stone-50 font-normal h-11 rounded-lg" onClick={handleCreateSettlement} disabled={creatingSettlement || !fromUser || !toUser || !settlementAmount}>
                    {creatingSettlement ? "Recording..." : "Record Settlement"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {settlements.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-3"><HandCoins className="w-6 h-6 text-stone-400" /></div>
                <p className="text-stone-500 font-light">No settlements yet</p>
                <p className="text-sm text-stone-400 font-light mt-1">Record payments between members</p>
              </div>
            ) : (
              <div className="divide-y divide-stone-100">
                {settlements.map((settlement) => (
                  <div key={settlement._id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-stone-900"><span className="font-medium">{settlement.fromUser?.name}</span><span className="text-stone-400 mx-1.5">paid</span><span className="font-medium">{settlement.toUser?.name}</span></p>
                        <p className="text-sm font-medium text-stone-900 mt-0.5 flex items-center gap-1"><IndianRupee className="w-3.5 h-3.5 text-stone-400" />{settlement.amount}</p>
                      </div>
                      <div className="flex gap-1.5 flex-shrink-0">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-stone-400 hover:text-stone-600 hover:bg-stone-100" onClick={() => handleOpenEditSettlement(settlement)} disabled={deletingSettlementId === settlement._id}><Pencil className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-stone-400 hover:text-red-600 hover:bg-red-50" onClick={() => handleDeleteSettlement(settlement._id)} disabled={deletingSettlementId === settlement._id}>
                          {deletingSettlementId === settlement._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Expense Dialog */}
        <Dialog open={editExpenseOpen} onOpenChange={(val) => { if (!val) setEditingExpense(null); setEditExpenseOpen(val); }}>
          <DialogContent className="sm:max-w-md border-stone-200 bg-white max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle className="text-lg font-medium text-stone-900">Edit Expense</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-4">
              <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="border-stone-200 bg-stone-50/50 focus:border-stone-400 focus:ring-0 rounded-lg h-11 text-sm" />
              <Input value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="border-stone-200 bg-stone-50/50 focus:border-stone-400 focus:ring-0 rounded-lg h-11 text-sm" />
              <Input type="number" min="1" value={editAmount} onChange={(e) => setEditAmount(e.target.value)} className="border-stone-200 bg-stone-50/50 focus:border-stone-400 focus:ring-0 rounded-lg h-11 text-sm" />
              <div>
                <Label className="text-sm font-medium text-stone-700 mb-1.5 block">Paid By</Label>
                <Select value={editPaidBy} onValueChange={setEditPaidBy}>
                  <SelectTrigger className="border-stone-200 bg-stone-50/50 focus:ring-0 rounded-lg h-11 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>{group.members.map((m) => <SelectItem key={m.user._id} value={m.user._id}>{m.user.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium text-stone-700 mb-2 block">Participants</Label>
                <div className="space-y-2 border border-stone-200 rounded-lg p-3">
                  {group.members.map((m) => (
                    <label key={m.user._id} className="flex items-center gap-3 cursor-pointer py-1">
                      <Checkbox checked={editSelectedParticipants.includes(m.user._id)} onCheckedChange={() => handleEditParticipantChange(m.user._id)} className="border-stone-300 data-[state=checked]:bg-stone-900 data-[state=checked]:border-stone-900" />
                      <span className="text-sm text-stone-700">{m.user.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <Button className="w-full bg-stone-900 hover:bg-stone-800 text-stone-50 font-normal h-11 rounded-lg" onClick={handleUpdateExpense} disabled={updatingExpense}>
                {updatingExpense ? "Updating..." : "Update Expense"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Settlement Dialog */}
        <Dialog open={editSettlementOpen} onOpenChange={(val) => { if (!val) resetEditSettlementForm(); setEditSettlementOpen(val); }}>
          <DialogContent className="sm:max-w-md border-stone-200 bg-white">
            <DialogHeader><DialogTitle className="text-lg font-medium text-stone-900">Edit Settlement</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label className="text-sm font-medium text-stone-700 mb-1.5 block">From</Label>
                <Select value={editFromUser} onValueChange={setEditFromUser}>
                  <SelectTrigger className="border-stone-200 bg-stone-50/50 focus:ring-0 rounded-lg h-11 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>{group.members.map((m) => <SelectItem key={m.user._id} value={m.user._id}>{m.user.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium text-stone-700 mb-1.5 block">To</Label>
                <Select value={editToUser} onValueChange={setEditToUser}>
                  <SelectTrigger className="border-stone-200 bg-stone-50/50 focus:ring-0 rounded-lg h-11 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>{group.members.map((m) => <SelectItem key={m.user._id} value={m.user._id}>{m.user.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <Input type="number" min="1" value={editSettlementAmount} onChange={(e) => setEditSettlementAmount(e.target.value)} className="border-stone-200 bg-stone-50/50 focus:border-stone-400 focus:ring-0 rounded-lg h-11 text-sm" />
              <Button className="w-full bg-stone-900 hover:bg-stone-800 text-stone-50 font-normal h-11 rounded-lg" onClick={handleUpdateSettlement} disabled={updatingSettlement}>
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
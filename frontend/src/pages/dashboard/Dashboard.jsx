import { useEffect, useState, useCallback } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import useAuth from "@/hooks/useAuth";
import { getDashboard } from "@/services/dashboard.service";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteGroup } from "@/services/group.service";
import { toast } from "sonner";
import { 
  Users, 
  ArrowDownRight, 
  ArrowUpRight, 
  Wallet,
  Plus,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Trash2,
  AlertTriangle,
  Loader2,
  Crown
} from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteGroupOpen, setDeleteGroupOpen] = useState(null);
  const [deletingGroupId, setDeletingGroupId] = useState(null);

  const fetchDashboard = useCallback(async () => {
    if (!accessToken) return;
    try {
      setLoading(true);
      const data = await getDashboard(accessToken);
      setDashboard(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    document.title = "Dashboard | Expense Splitter";
    fetchDashboard();
  }, [fetchDashboard]);

  const handleDeleteGroup = async (groupId) => {
    try {
      setDeletingGroupId(groupId);
      await deleteGroup(groupId, accessToken);
      toast.success("Group deleted successfully");
      setDeleteGroupOpen(null);
      await fetchDashboard();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to delete group");
    } finally {
      setDeletingGroupId(null);
    }
  };

  const stats = dashboard ? [
    {
      title: "Total Groups",
      value: dashboard.summary.totalGroups,
      icon: Users,
      color: "text-stone-600",
      bgColor: "bg-stone-100",
    },
    {
      title: "You Are Owed",
      value: `₹${dashboard.summary.totalOwed}`,
      icon: ArrowDownRight,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "You Owe",
      value: `₹${dashboard.summary.totalOwes}`,
      icon: ArrowUpRight,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
    },
    {
      title: "Net Balance",
      value: `₹${dashboard.summary.netBalance}`,
      icon: Wallet,
      color: dashboard.summary.netBalance >= 0 ? "text-emerald-600" : "text-rose-600",
      bgColor: dashboard.summary.netBalance >= 0 ? "bg-emerald-50" : "bg-rose-50",
    },
  ] : [];

  const getBalanceIcon = (balance) => {
    if (balance > 0) return <TrendingUp className="w-4 h-4 text-emerald-600" />;
    if (balance < 0) return <TrendingDown className="w-4 h-4 text-rose-600" />;
    return <Minus className="w-4 h-4 text-stone-400" />;
  };

  const getBalanceClass = (balance) => {
    if (balance > 0) return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (balance < 0) return "bg-rose-50 text-rose-700 border-rose-200";
    return "bg-stone-50 text-stone-600 border-stone-200";
  };

  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="h-8 bg-stone-200 rounded w-48 animate-pulse"></div>
          <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="border-stone-200 shadow-none animate-pulse">
                <CardContent className="p-4 md:p-6">
                  <div className="h-3 bg-stone-200 rounded w-20 mb-3"></div>
                  <div className="h-8 bg-stone-200 rounded w-16"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-light text-stone-900 tracking-tight">
              Dashboard
            </h1>
            <p className="text-sm text-stone-500 mt-1 font-light">
              Overview of your groups and balances
            </p>
          </div>
          <Button
            onClick={() => navigate("/groups")}
            className="bg-stone-900 hover:bg-stone-800 text-stone-50 font-normal w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Group
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Card 
              key={i} 
              className="border-stone-200 shadow-none hover:border-stone-300 transition-colors duration-200 bg-white"
            >
              <CardContent className="p-4 md:p-6">
                <div className="flex items-start justify-between mb-3">
                  <p className="text-xs md:text-sm text-stone-500 font-light">
                    {stat.title}
                  </p>
                  <div className={`p-1.5 md:p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`w-3.5 h-3.5 md:w-4 md:h-4 ${stat.color}`} />
                  </div>
                </div>
                <p className={`text-xl md:text-2xl lg:text-3xl font-light tracking-tight ${stat.color}`}>
                  {stat.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Groups Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-medium text-stone-900 tracking-tight">
              Your Groups
            </h2>
            {dashboard.groups.length > 0 && (
              <button
                onClick={() => navigate("/groups")}
                className="text-sm text-stone-500 hover:text-stone-700 font-light flex items-center gap-1 transition-colors"
              >
                View all
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {dashboard.groups.length === 0 ? (
            <Card className="border-stone-200 shadow-none bg-white">
              <CardContent className="p-8 md:p-12 text-center">
                <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-stone-400" />
                </div>
                <p className="text-stone-500 font-light mb-1">No groups yet</p>
                <p className="text-sm text-stone-400 font-light mb-6">
                  Create a group to start splitting expenses
                </p>
                <Button
                  onClick={() => navigate("/groups")}
                  className="bg-stone-900 hover:bg-stone-800 text-stone-50 font-normal"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Group
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
  {dashboard.groups.map((group) => (
    <Card
      key={group.groupId}
      className="border-stone-200 shadow-none hover:border-stone-300 hover:shadow-sm transition-all duration-200 bg-white group relative"
    >
      <CardContent 
        className="p-4 md:p-6 cursor-pointer"
        onClick={() => navigate(`/groups/${group.groupId}`)}
      >
        {/* Admin badge */}
        {group.isAdmin && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border bg-amber-50 text-amber-700 border-amber-200 z-10">
            <Crown className="w-3 h-3" />
            Admin
          </span>
        )}

       {/* Delete button */}
<div 
  className="absolute top-3 right-3 z-10"
  onClick={(e) => e.stopPropagation()}
>
  <Dialog 
    open={deleteGroupOpen === group.groupId} 
    onOpenChange={(open) => setDeleteGroupOpen(open ? group.groupId : null)}
  >
    <DialogTrigger asChild>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-full"
        title="Delete group"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-md border-stone-200 bg-white">
      <DialogHeader>
        <DialogTitle className="text-lg font-medium text-stone-900 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          Delete Group
        </DialogTitle>
        <DialogDescription className="text-sm text-stone-500 font-light mt-1">
          Permanently delete "{group.groupName}"?
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 mt-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-700 font-light">
            All expenses, settlements, and group data will be permanently deleted.
            All members must be settled first.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setDeleteGroupOpen(null)}
            className="flex-1 border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 font-normal h-11 rounded-lg"
            disabled={deletingGroupId === group.groupId}
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleDeleteGroup(group.groupId)}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-normal h-11 rounded-lg"
            disabled={deletingGroupId === group.groupId}
          >
            {deletingGroupId === group.groupId ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Group"
            )}
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</div>

        <div className={`flex items-start justify-between mb-3 ${group.isAdmin ? 'mt-5' : ''}`}>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base md:text-lg font-medium text-stone-900 mb-1 group-hover:text-stone-700 transition-colors truncate pr-6">
              {group.groupName}
            </CardTitle>
            <p className="text-xs text-stone-400 font-light">
              Click to view details
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-stone-500 transition-colors mt-1 flex-shrink-0" />
        </div>

        <div className="flex items-center gap-2 pt-3 border-t border-stone-100">
          {getBalanceIcon(group.balance)}
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${getBalanceClass(group.balance)}`}>
            {group.balance > 0
              ? `Gets ₹${group.balance}`
              : group.balance < 0
              ? `Owes ₹${Math.abs(group.balance)}`
              : "Settled"}
          </span>
        </div>
      </CardContent>
    </Card>
  ))}
</div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
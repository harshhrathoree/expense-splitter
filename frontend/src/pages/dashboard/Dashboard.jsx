import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import useAuth from "@/hooks/useAuth";
import { getDashboard } from "@/services/dashboard.service";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  ArrowDownRight, 
  ArrowUpRight, 
  Wallet,
  Plus,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Dashboard | Expense Splitter";
    if (!accessToken) return;

    const fetchDashboard = async () => {
      try {
        const data = await getDashboard(accessToken);
        setDashboard(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [accessToken]);

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
      trend: "positive",
    },
    {
      title: "You Owe",
      value: `₹${dashboard.summary.totalOwes}`,
      icon: ArrowUpRight,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
      trend: "negative",
    },
    {
      title: "Net Balance",
      value: `₹${dashboard.summary.netBalance}`,
      icon: Wallet,
      color: dashboard.summary.netBalance >= 0 ? "text-emerald-600" : "text-rose-600",
      bgColor: dashboard.summary.netBalance >= 0 ? "bg-emerald-50" : "bg-rose-50",
      trend: dashboard.summary.netBalance >= 0 ? "positive" : "negative",
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
            onClick={() => navigate("/groups/")}
            className="bg-stone-900 hover:bg-stone-800 text-stone-50 font-normal w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Group
          </Button>
        </div>

        {loading ? (
          <div className="space-y-6">
            {/* Loading skeleton */}
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
            <div className="h-48 bg-stone-100 rounded-xl animate-pulse"></div>
          </div>
        ) : (
          <div className="space-y-6 md:space-y-8">
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
                    <p className="text-stone-500 font-light mb-1">
                      No groups yet
                    </p>
                    <p className="text-sm text-stone-400 font-light mb-6">
                      Create a group to start splitting expenses
                    </p>
                    <Button
                      onClick={() => navigate("/groups/create")}
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
                      onClick={() => navigate(`/groups/${group.groupId}`)}
                      className="border-stone-200 shadow-none hover:border-stone-300 hover:shadow-sm transition-all duration-200 cursor-pointer bg-white group"
                    >
                      <CardContent className="p-4 md:p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <CardTitle className="text-base md:text-lg font-medium text-stone-900 mb-1 group-hover:text-stone-700 transition-colors">
                              {group.groupName}
                            </CardTitle>
                            <p className="text-xs text-stone-400 font-light">
                              Click to view details
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-stone-500 transition-colors mt-1" />
                        </div>

                        <div className="flex items-center gap-2 pt-3 border-t border-stone-100">
                          {getBalanceIcon(group.balance)}
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${getBalanceClass(group.balance)}`}
                          >
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
        )}
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
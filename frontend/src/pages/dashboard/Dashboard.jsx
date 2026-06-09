import { useEffect, useState } from "react";

import DashboardLayout from "@/components/layouts/DashboardLayout";

import useAuth from "@/hooks/useAuth";

import { getDashboard } from "@/services/dashboard.service";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function Dashboard() {
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title =
  "Dashboard | Expense Splitter";
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

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <p className="text-muted-foreground mt-2">
  Here's an overview of your groups and balances.
</p>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-8">
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Groups
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-3xl font-bold">
                  {dashboard.summary.totalGroups}
                </p>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  You Are Owed
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-3xl font-bold text-green-600">
                  ₹{dashboard.summary.totalOwed}
                </p>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  You Owe
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-3xl font-bold text-red-600">
                  ₹{dashboard.summary.totalOwes}
                </p>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Net Balance
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p
                  className={`text-3xl font-bold ${
                    dashboard.summary.netBalance >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  ₹{dashboard.summary.netBalance}
                </p>
              </CardContent>
            </Card>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Your Groups</h2>

            {dashboard.groups.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">
                    You haven't joined any groups yet.
                  </p>

                  <Button className="mt-4" onClick={() => navigate("/groups")}>
                    Create Group
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {dashboard.groups.map((group) => (
                  <Card
                    key={group.groupId}
                    onClick={() => navigate(`/groups/${group.groupId}`)}
                    className="
                    cursor-pointer
                    hover:shadow-md
                    hover:-translate-y-1
                    transition-all
                  "
                  >
                    <CardHeader>
                      <CardTitle>{group.groupName}</CardTitle>
                    </CardHeader>

                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Click to view details
                      </p>

                      <div className="mt-4">
                        {group.balance > 0 ? (
                          <span
                            className="
        inline-flex
        items-center
        rounded-full
        px-3
        py-1
        text-sm
        font-medium
        bg-green-100
        text-green-700
      "
                          >
                            Gets ₹{group.balance}
                          </span>
                        ) : group.balance < 0 ? (
                          <span
                            className="
        inline-flex
        items-center
        rounded-full
        px-3
        py-1
        text-sm
        font-medium
        bg-red-100
        text-red-700
      "
                          >
                            Owes ₹{Math.abs(group.balance)}
                          </span>
                        ) : (
                          <span
                            className="
        inline-flex
        items-center
        rounded-full
        px-3
        py-1
        text-sm
        font-medium
        bg-muted
      "
                          >
                            Settled
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Dashboard;

import useAuth from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";


import { logoutUser } from "@/services/auth.service";

import { Button } from "@/components/ui/button";

function DashboardLayout({
  children,
}) {
  const navigate =
    useNavigate();

  const {
    user,
    logout,
  } = useAuth();

  const handleLogout =
    async () => {
      try {
        await logoutUser();

        logout();

        navigate("/login");
      } catch (error) {
        console.error(error);
      }
    };

  return (
    <div className="min-h-screen">

      <header className="border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          <h1 className="text-xl font-bold">
            Expense Splitter
          </h1>

          <div className="flex items-center gap-4">

            <span>
              Welcome, {user?.name}
            </span>

            <Button
              variant="outline"
              onClick={
                handleLogout
              }
            >
              Logout
            </Button>

          </div>

        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {children}
      </main>

    </div>
  );
}


export default DashboardLayout;
import useAuth from "@/hooks/useAuth";
import {
    useNavigate,
    Link, NavLink,
  } from "react-router-dom";

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

    console.log("1");

    try {

      await logoutUser();

      console.log("2");

      logout();

      console.log("3");

      navigate("/");

      console.log("4");

    } catch (error) {

      console.error(error);

    }
  };

  return (
    <div className="min-h-screen">

      <header className="border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        <div
  className="
    flex
    items-center
    gap-6
  "
>

<NavLink
  to="/dashboard"
  className="
    text-xl
    font-bold
  "
>
  Expense Splitter
</NavLink>

<NavLink
  to="/dashboard"
  className={({ isActive }) =>
    isActive
      ? "font-semibold text-primary"
      : "text-muted-foreground"
  }
>
  Dashboard
</NavLink>

<NavLink
  to="/groups"
  className={({ isActive }) =>
    isActive
      ? "font-semibold text-primary"
      : "text-muted-foreground"
  }
>
  Groups
</NavLink>

</div>

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
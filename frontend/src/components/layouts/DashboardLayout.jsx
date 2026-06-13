import { useState } from "react";
import useAuth from "@/hooks/useAuth";
import { useNavigate, NavLink, Link } from "react-router-dom";
import { logoutUser } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Users, 
  LogOut, 
  Menu, 
  X,
  ChevronRight,
  User as UserIcon
} from "lucide-react";

function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logoutUser();
      logout();
      navigate("/");
    } catch (error) {
      console.error(error);
    } finally {
      setLoggingOut(false);
    }
  };

  const navLinks = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/groups", label: "Groups", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="border-b border-stone-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo & Navigation */}
            <div className="flex items-center gap-8">
              <Link 
                to="/dashboard" 
                className="flex items-center gap-2.5 group flex-shrink-0"
              >
                <div className="w-7 h-7 bg-stone-900 rounded-md flex items-center justify-center">
                  <span className="text-stone-50 text-xs font-semibold">E</span>
                </div>
                <span className="text-lg font-semibold tracking-tight text-stone-900 hidden sm:block">
                  Expense Splitter
                </span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === "/dashboard"}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-light transition-colors ${
                        isActive
                          ? "bg-stone-100 text-stone-900"
                          : "text-stone-500 hover:text-stone-700 hover:bg-stone-50"
                      }`
                    }
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* User Section */}
            <div className="flex items-center gap-3">
              {/* User info - Desktop */}
              <div className="hidden sm:flex items-center gap-2 text-sm text-stone-600 font-light">
                <div className="w-7 h-7 bg-stone-100 rounded-full flex items-center justify-center">
                  <UserIcon className="w-3.5 h-3.5 text-stone-500" />
                </div>
                <span className="max-w-[120px] truncate">{user?.name}</span>
              </div>

              {/* Logout button - Desktop */}
              <Button
                variant="ghost"
                onClick={handleLogout}
                disabled={loggingOut}
                className="hidden sm:inline-flex text-stone-500 hover:text-stone-700 hover:bg-stone-100 font-light text-sm"
              >
                <LogOut className="w-4 h-4 mr-2" />
                {loggingOut ? "Signing out..." : "Sign out"}
              </Button>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-stone-600 hover:text-stone-900 hover:bg-stone-100"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-stone-100 py-3 pb-4">
              {/* Mobile user info */}
              <div className="flex items-center gap-3 px-2 py-3 mb-2">
                <div className="w-9 h-9 bg-stone-100 rounded-full flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-stone-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-stone-900 truncate">{user?.name}</p>
                  <p className="text-xs text-stone-400 font-light truncate">{user?.email}</p>
                </div>
              </div>

              {/* Mobile nav links */}
              <nav className="space-y-1">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === "/dashboard"}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-light transition-colors ${
                        isActive
                          ? "bg-stone-100 text-stone-900"
                          : "text-stone-500 hover:text-stone-700 hover:bg-stone-50"
                      }`
                    }
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                    <ChevronRight className="w-4 h-4 ml-auto text-stone-300" />
                  </NavLink>
                ))}
              </nav>

              {/* Mobile logout */}
              <div className="mt-3 pt-3 border-t border-stone-100">
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="w-full justify-start text-stone-500 hover:text-red-600 hover:bg-red-50 font-light text-sm"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  {loggingOut ? "Signing out..." : "Sign out"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8">
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;
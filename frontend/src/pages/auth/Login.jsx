import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginUser } from "@/services/auth.service";
import useAuth from "@/hooks/useAuth";
import { ArrowRight } from "lucide-react";

function Login() {
  document.title = "Login | Expense Splitter";
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    try {
      setLoading(true);
      const data = await loginUser({
        email,
        password,
      });
      login(data.user, data.accessToken);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setError(error?.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-7 h-7 bg-stone-900 rounded-md flex items-center justify-center">
              <span className="text-stone-50 text-xs font-semibold">E</span>
            </div>
            <span className="text-lg font-semibold tracking-tight text-stone-900">
              Expense Splitter
            </span>
          </Link>
        </div>

        <Card className="border-stone-200 shadow-none rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-medium text-stone-900">Welcome back</CardTitle>
            <p className="text-sm text-stone-500 font-light mt-1">
              Sign in to manage your expenses
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-stone-200 bg-stone-50/50 focus:border-stone-400 focus:ring-0 rounded-lg h-11 text-sm"
                />
              </div>

              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-stone-200 bg-stone-50/50 focus:border-stone-400 focus:ring-0 rounded-lg h-11 text-sm"
                />
              </div>

              {error && (
                <p className="text-sm text-red-500 font-light bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="w-full bg-stone-900 hover:bg-stone-800 text-stone-50 font-normal h-11 rounded-lg group"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
                {!loading && <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />}
              </Button>
            </form>

            <p className="text-center text-sm text-stone-400 mt-6 font-light">
              Don't have an account?{" "}
              <span
                onClick={() => navigate("/register")}
                className="text-stone-900 font-medium hover:text-stone-600 transition-colors cursor-pointer"
              >
                Create one
              </span>
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-stone-400 mt-6 font-light">
          <span 
            onClick={() => navigate("/")}
            className="hover:text-stone-600 transition-colors cursor-pointer"
          >
            ← Back to home
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
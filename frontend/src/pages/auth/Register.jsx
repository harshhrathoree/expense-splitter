import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { registerUser } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

function Register() {
  document.title = "Register | Expense Splitter";
  const navigate = useNavigate();
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (mobileNumber.length !== 10) {
      setError("Mobile number must be 10 digits");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const data = await registerUser({
        name,
        email,
        mobileNumber,
        password,
      });
      login(data.user, data.accessToken);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setError(error?.response?.data?.message || "Registration failed");
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
            <CardTitle className="text-xl font-medium text-stone-900">Create your account</CardTitle>
            <p className="text-sm text-stone-500 font-light mt-1">
              Start splitting expenses with ease
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <Input
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="border-stone-200 bg-stone-50/50 focus:border-stone-400 focus:ring-0 rounded-lg h-11 text-sm"
                />
              </div>

              <div>
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-stone-200 bg-stone-50/50 focus:border-stone-400 focus:ring-0 rounded-lg h-11 text-sm"
                />
              </div>

              <div>
                <Input
                  type="tel"
                  placeholder="Mobile number"
                  value={mobileNumber}
                  maxLength={10}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ""))}
                  className="border-stone-200 bg-stone-50/50 focus:border-stone-400 focus:ring-0 rounded-lg h-11 text-sm"
                />
              </div>

              <div>
                <Input
                  type="password"
                  placeholder="Password (min. 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-stone-200 bg-stone-50/50 focus:border-stone-400 focus:ring-0 rounded-lg h-11 text-sm"
                />
              </div>

              <div>
                <Input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
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
                {loading ? "Creating account..." : "Create account"}
                {!loading && <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />}
              </Button>
            </form>

            <p className="text-center text-sm text-stone-400 mt-6 font-light">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-stone-900 font-medium hover:text-stone-600 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-stone-400 mt-6 font-light">
          By creating an account, you agree to our Terms and Privacy Policy
        </p>
      </div>
    </div>
  );
}

export default Register;
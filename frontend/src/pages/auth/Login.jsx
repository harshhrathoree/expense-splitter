import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { loginUser } from "@/services/auth.service";
import useAuth from "@/hooks/useAuth";

function Login() {
    document.title =
  "Login | Expense Splitter";
  const navigate = useNavigate();

  const { login } = useAuth();

  const [
    loading,
    setLoading,
  ] = useState(false);

  const handleLogin =
  async () => {

    try {

      setLoading(true);

      const data =
        await loginUser({
          email,
          password,
        });

      login(
        data.user,
        data.accessToken
      );

      navigate("/dashboard");

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  };

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>

            <Input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Password</Label>

            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

       

          <Button
  className="w-full"
  onClick={handleLogin}
  disabled={loading}
>
  {loading
    ? "Logging in..."
    : "Login"}
</Button>

          <p className="text-center text-sm">

  Don't have an account?{" "}

  <span
    onClick={() =>
      navigate("/register")
    }
    className="
      text-primary
      font-medium
      cursor-pointer
    "
  >
    Register
  </span>

</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;

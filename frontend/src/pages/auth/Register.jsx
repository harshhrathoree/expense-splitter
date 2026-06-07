import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import useAuth from "@/hooks/useAuth";

import { registerUser } from "@/services/auth.service";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function Register() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [mobileNumber, setMobileNumber] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleRegister =
  async (e) => {

    e.preventDefault();

    // Validation Starts Here

    if (!name.trim()) {
      alert("Name is required");
      return;
    }

    if (!email.trim()) {
      alert("Email is required");
      return;
    }

    if (mobileNumber.length !== 10) {
      alert(
        "Mobile number must be 10 digits"
      );
      return;
    }

    if (password.length < 6) {
      alert(
        "Password must be at least 6 characters"
      );
      return;
    }

    if (
      password !==
      confirmPassword
    ) {
      alert(
        "Passwords do not match"
      );
      return;
    }

    // Validation Ends Here

    try {

      setLoading(true);

      const data =
        await registerUser({
          name,
          email,
          mobileNumber,
          password,
        });

      login(
        data.user,
        data.accessToken
      );

      navigate(
        "/dashboard"
      );

    } catch (error) {

      console.error(error);

      alert(
        error?.response?.data
          ?.message ||
          "Registration failed"
      );

    } finally {

      setLoading(false);

    }
  };
  return (
    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        px-4
      "
    >
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

<Input
  type="tel"
  placeholder="Mobile Number"
  value={mobileNumber}
  maxLength={10}
  onChange={(e) =>
    setMobileNumber(
      e.target.value
        .replace(/\D/g, "")
    )
  }
/>

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Register"}
            </Button>
          </form>

          <p
            className="
              text-center
              text-sm
              mt-4
            "
          >
            Already have an account?{" "}
            <Link
              to="/login"
              className="
                text-primary
                font-medium
              "
            >
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default Register;

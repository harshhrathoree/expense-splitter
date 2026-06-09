import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

import useAuth from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function LandingPage() {
    document.title =
    "Expense Splitter";
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div
          className="
    max-w-6xl
    mx-auto
    px-6
    py-4
    flex
    justify-between
    items-center
  "
        >
          <h1 className="text-xl font-bold">Expense Splitter</h1>

          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => navigate("/login")}>
              Login
            </Button>

            <Button onClick={() => navigate("/register")}>Register</Button>
          </div>
        </div>
      </header>

      {/* Hero */}

      <section
        className="
          max-w-6xl
          mx-auto
          px-6
          py-24
          text-center
        "
      >
        <h1
          className="
    text-5xl
    md:text-7xl
    font-bold
    leading-tight
    mb-6
  "
        >
          Split Expenses
          <br />
          Without The
          <span className="block text-primary">Headaches</span>
        </h1>

        <p
          className="
    text-xl
    text-muted-foreground
    max-w-3xl
    mx-auto
    mb-8
  "
        >
          Manage shared expenses, track balances, and settle debts with friends,
          roommates, trips and events.
        </p>

        <div
          className="
            flex
            justify-center
            gap-4
          "
        >
          <Button size="lg" onClick={() => navigate("/register")}>
            Get Started
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        </div>
      </section>

      <section
        className="
    max-w-6xl
    mx-auto
    px-6
    pb-20
  "
      >
        <div
          className="
      grid
      gap-6
      md:grid-cols-3
    "
        >
          <Card>
            <CardContent
              className="
          pt-6
          text-center
        "
            >
              <p className="text-4xl font-bold">100%</p>

              <p className="text-muted-foreground">Transparent Tracking</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent
              className="
          pt-6
          text-center
        "
            >
              <p className="text-4xl font-bold">Unlimited</p>

              <p className="text-muted-foreground">Groups & Expenses</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent
              className="
          pt-6
          text-center
        "
            >
              <p className="text-4xl font-bold">Real Time</p>

              <p className="text-muted-foreground">Balance Updates</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features */}

      <section
        className="
          max-w-6xl
          mx-auto
          px-6
          pb-20
        "
      >
        <h2
          className="
            text-3xl
            font-bold
            text-center
            mb-10
          "
        >
          Features
        </h2>

        <div
          className="
            grid
            gap-6
            md:grid-cols-2
            lg:grid-cols-4
          "
        >
          <Card>
            <CardHeader>
              <CardTitle>👥 Groups</CardTitle>
            </CardHeader>

            <CardContent>Create groups and add members easily.</CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>💸 Expenses</CardTitle>
            </CardHeader>

            <CardContent>Track shared expenses with transparency.</CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>⚖️ Balances</CardTitle>
            </CardHeader>

            <CardContent>Instantly know who owes whom.</CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>✅ Settlements</CardTitle>
            </CardHeader>

            <CardContent>
              Record payments and keep balances accurate.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}

      <section
        className="
          max-w-6xl
          mx-auto
          px-6
          pb-20
        "
      >
        <h2
          className="
            text-3xl
            font-bold
            text-center
            mb-10
          "
        >
          How It Works
        </h2>

        <div
          className="
            grid
            gap-6
            md:grid-cols-4
          "
        >
          <Card>
            <CardContent className="pt-6">1. Create a Group</CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">2. Add Members</CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">3. Add Expenses</CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">4. Settle Up</CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}

      <section
        className="
          py-20
          text-center
        "
      >
        <h2
          className="
            text-4xl
            font-bold
            mb-4
          "
        >
          Ready to Split Expenses Smarter?
        </h2>

        <p
          className="
            text-muted-foreground
            mb-8
          "
        >
          Start managing group expenses in minutes.
        </p>

        <Button size="lg" onClick={() => navigate("/register")}>
          Create Free Account
        </Button>
      </section>

      <footer
        className="
    border-t
    py-8
    text-center
    text-sm
    text-muted-foreground
  "
      >
        Built with React, Node.js, Express, MongoDB & AWS
      </footer>
    </div>
  );
}

export default LandingPage;

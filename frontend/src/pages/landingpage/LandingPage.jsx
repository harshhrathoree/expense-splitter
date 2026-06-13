import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Sparkles, Users, Receipt, Scale, CheckCircle2 } from "lucide-react";

function LandingPage() {
  document.title = "Expense Splitter";

  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const navigate = useNavigate();

  const features = [
    {
      icon: Users,
      title: "Groups",
      description: "Create shared spaces for trips, homes, or any collective.",
    },
    {
      icon: Receipt,
      title: "Expenses",
      description: "Log shared costs with clarity and context.",
    },
    {
      icon: Scale,
      title: "Balances",
      description: "See who owes what, always up to date.",
    },
    {
      icon: CheckCircle2,
      title: "Settlements",
      description: "Record payments and close out balances cleanly.",
    },
  ];

  const steps = [
    { number: "1", title: "Create a group", description: "Set up a shared space in seconds." },
    { number: "2", title: "Invite members", description: "Bring in friends or colleagues." },
    { number: "3", title: "Add expenses", description: "Log costs as they happen." },
    { number: "4", title: "Settle up", description: "Clear balances when ready." },
  ];

  const stats = [
    { value: "100%", label: "Transparent" },
    { value: "Unlimited", label: "Groups & expenses" },
    { value: "Real-time", label: "Balance updates" },
  ];

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 antialiased">
      {/* Header */}
      <header className="border-b border-stone-200/60 bg-stone-50/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-stone-900 rounded-md flex items-center justify-center">
              <span className="text-stone-50 text-xs font-semibold">E</span>
            </div>
            <h1 className="text-lg font-semibold tracking-tight text-stone-900">
              Expense Splitter
            </h1>
          </div>
          <div className="flex gap-2 items-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/login")}
              className="text-stone-600 hover:text-stone-900 hover:bg-stone-100 font-normal"
            >
              Sign in
            </Button>
            <Button 
              onClick={() => navigate("/register")}
              className="bg-stone-900 hover:bg-stone-800 text-stone-50 font-normal"
            >
              Get started
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-6 pt-28 pb-20 md:pt-36 md:pb-28 text-center">
          <div className="inline-flex items-center gap-2 bg-stone-100 border border-stone-200 rounded-full px-4 py-1.5 mb-8 text-sm text-stone-500">
            <Sparkles className="w-3.5 h-3.5 text-stone-400" />
            Simple shared expense management
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-tight mb-6 text-stone-900">
            Split expenses
            <br />
            <span className="font-normal">with grace and clarity</span>
          </h1>
          
          <p className="text-base md:text-lg text-stone-500 max-w-xl mx-auto mb-10 leading-relaxed font-light">
            Manage shared costs among friends, roommates, and groups. 
            Elegant tracking, transparent balances, zero headaches.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Button 
              size="lg" 
              onClick={() => navigate("/register")}
              className="bg-stone-900 hover:bg-stone-800 text-stone-50 px-8 py-5 text-base rounded-xl font-normal group"
            >
              Start splitting
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => navigate("/login")}
              className="border-stone-300 text-stone-600 hover:text-stone-900 hover:bg-stone-50 px-8 py-5 text-base rounded-xl font-normal"
            >
              Sign in
            </Button>
          </div>
        </section>

        {/* Stats - Subtle row */}
        <section className="max-w-4xl mx-auto px-6 pb-24">
          <div className="border border-stone-200 rounded-2xl bg-white divide-y md:divide-y-0 md:divide-x divide-stone-100 grid md:grid-cols-3">
            {stats.map((stat, i) => (
              <div key={i} className="py-8 px-8 text-center">
                <p className="text-3xl font-light text-stone-900 mb-1 tracking-tight">{stat.value}</p>
                <p className="text-sm text-stone-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <div className="text-center mb-14">
            <p className="text-xs font-medium text-stone-400 uppercase tracking-widest mb-3">Features</p>
            <h2 className="text-3xl font-light tracking-tight text-stone-900">
              Everything you need, nothing you don't
            </h2>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <Card key={i} className="border-stone-200 shadow-none hover:border-stone-300 transition-colors duration-200 rounded-xl bg-white">
                <CardHeader className="pb-2">
                  <feature.icon className="w-5 h-5 text-stone-400 mb-2" />
                  <CardTitle className="text-base font-medium text-stone-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-stone-500 leading-relaxed font-light">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <div className="text-center mb-14">
            <p className="text-xs font-medium text-stone-400 uppercase tracking-widest mb-3">How it works</p>
            <h2 className="text-3xl font-light tracking-tight text-stone-900">
              Four simple steps
            </h2>
          </div>
          
          <div className="grid gap-4 md:grid-cols-4">
            {steps.map((step, i) => (
              <div key={i} className="text-center p-6">
                <div className="w-10 h-10 rounded-full border border-stone-200 bg-white flex items-center justify-center mx-auto mb-4">
                  <span className="text-sm text-stone-500 font-light">{step.number}</span>
                </div>
                <h3 className="text-base font-medium text-stone-900 mb-1.5">{step.title}</h3>
                <p className="text-sm text-stone-400 font-light">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <div className="bg-stone-900 rounded-3xl p-12 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-light text-stone-50 mb-4 tracking-tight">
              Ready to simplify shared expenses?
            </h2>
            <p className="text-stone-400 mb-8 font-light max-w-md mx-auto">
              Join those who've traded spreadsheets for something better.
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate("/register")}
              className="bg-stone-50 hover:bg-stone-200 text-stone-900 px-8 py-5 text-base rounded-xl font-normal group"
            >
              Create free account
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 py-8 text-center text-xs text-stone-400 font-light">
        <p>Built with care. React · Node.js · Express · MongoDB · AWS</p>
      </footer>
    </div>
  );
}

export default LandingPage;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DashboardCard } from "@/components/DashboardCard";
import { MetricItem } from "@/components/MetricItem";
import { StatusPill } from "@/components/StatusPill";
import { TrendingUp, MapPin, Users, Clock, Mail, ArrowRight, Zap } from "lucide-react";

const MainDashboard = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (email) {
      navigate("/kam-hub");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Top Navigation */}
      <nav className="bg-card/80 backdrop-blur-lg shadow-lg border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Zomato Drive
            </h2>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-b border-border/50">
        <div className="container mx-auto px-6 py-12">
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div>
              <h1 className="text-5xl font-bold text-foreground mb-3 animate-fade-in">BAU Dashboard</h1>
              <p className="text-muted-foreground text-lg animate-fade-in">Real-time insights into your drive performance</p>
            </div>
            <Button
              onClick={() => navigate("/live-sprints")}
              size="lg"
              className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 animate-fade-in"
            >
              <Zap className="mr-2 w-5 h-5" />
              Live Sprints in Pune 🏁
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-10">

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {/* Column 1 - Info Sidebar */}
          <div className="space-y-6">
            <DashboardCard title="Current / Live Drives">
              <div className="space-y-2">
                <div className="flex items-center justify-between py-3 px-3 hover:bg-primary/5 rounded-lg transition-all duration-200 hover:scale-[1.02] border border-transparent hover:border-primary/20 group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <span className="text-xs font-bold text-primary">1</span>
                    </div>
                    <span className="font-semibold text-foreground">NCN</span>
                  </div>
                  <StatusPill type="success">85%</StatusPill>
                </div>
                <div className="flex items-center justify-between py-3 px-3 hover:bg-primary/5 rounded-lg transition-all duration-200 hover:scale-[1.02] border border-transparent hover:border-primary/20 group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <span className="text-xs font-bold text-primary">2</span>
                    </div>
                    <span className="font-semibold text-foreground">MRP</span>
                  </div>
                  <StatusPill type="success">72%</StatusPill>
                </div>
                <div className="flex items-center justify-between py-3 px-3 hover:bg-primary/5 rounded-lg transition-all duration-200 hover:scale-[1.02] border border-transparent hover:border-primary/20 group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <span className="text-xs font-bold text-primary">3</span>
                    </div>
                    <span className="font-semibold text-foreground">N2R</span>
                  </div>
                  <StatusPill type="warning">58%</StatusPill>
                </div>
              </div>
            </DashboardCard>

            <DashboardCard title="Past Drives">
              <div className="space-y-2">
                <div className="py-3 px-3 hover:bg-muted/50 rounded-lg transition-all duration-200 border border-transparent hover:border-border">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-foreground text-sm">Ads Drive</span>
                    <StatusPill type="success">92%</StatusPill>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>Completed: Jan 15, 2025</span>
                  </div>
                </div>
              </div>
            </DashboardCard>

            <DashboardCard title="Upcoming Drives">
              <div className="space-y-2">
                <div className="py-3 px-3 hover:bg-muted/50 rounded-lg transition-all duration-200 border border-transparent hover:border-border">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-foreground text-sm">Image Drive</span>
                    <StatusPill type="neutral">Scheduled</StatusPill>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>Starting: Feb 20, 2025</span>
                  </div>
                </div>
              </div>
            </DashboardCard>
          </div>

          {/* Column 2 - City View */}
          <DashboardCard 
            title="City View" 
            className="h-fit lg:col-span-1"
          >
            <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="font-medium">Performance by City</span>
            </div>
            <MetricItem label="Pune" value="90%" showPill />
            <MetricItem label="Mumbai" value="80%" showPill />
            <MetricItem label="Hyderabad" value="75%" showPill />
            <MetricItem label="Bangalore" value="25%" showPill />
          </DashboardCard>

          {/* Column 3 - Zone View */}
          <DashboardCard 
            title="Zone View" 
            className="h-fit lg:col-span-1"
          >
            <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="font-medium">Performance by Zone</span>
            </div>
            <MetricItem label="East" value="70%" showPill />
            <MetricItem label="North-West" value="25%" showPill />
            <MetricItem label="South" value="60%" showPill />
          </DashboardCard>

          {/* Column 4 - KAM View */}
          <DashboardCard
            title="KAM View"
            className="h-fit lg:col-span-1"
            footer={
              <button className="flex items-center gap-2 text-sm text-primary hover:gap-3 transition-all duration-200 font-semibold group">
                <Users className="w-4 h-4" />
                <span>View all KAMs</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            }
          >
            <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
              <Users className="w-4 h-4" />
              <span className="font-medium">Key Account Managers</span>
            </div>
            <MetricItem label="Shiv" value="50%" showPill />
            <MetricItem label="Amdeep" value="70%" showPill />
            <MetricItem label="Shrawani" value="70%" showPill />
            <MetricItem label="Rutuja" value="20%" showPill />
          </DashboardCard>
        </div>

        {/* Login Section - Positioned below the grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* Welcome Back - Login Card */}
          <div className="animate-fade-in">
            <div className="bg-card rounded-2xl shadow-lg border border-border/50 p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center shadow-md flex-shrink-0">
                  <Mail className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-foreground mb-1">
                    Welcome Back
                  </h3>
                  <p className="text-sm text-muted-foreground">Login to access your KAM dashboard</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Input
                  type="email"
                  placeholder="Enter your Mail ID"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 h-12 text-base"
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
                <Button
                  onClick={handleLogin}
                  className="h-12 px-6 text-base font-semibold"
                >
                  Login
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Manager Access Card */}
          <div className="animate-fade-in">
            <div className="bg-gradient-to-br from-pink-50 to-pink-100/50 dark:from-pink-950/20 dark:to-pink-900/10 rounded-2xl shadow-lg border border-pink-200/50 dark:border-pink-800/30 p-8 h-full flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Manager Access</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  View team performance and analytics
                </p>
              </div>
              <Button
                onClick={() => navigate("/zonal-head-view")}
                variant="outline"
                className="w-full h-12 text-base font-medium bg-white/50 dark:bg-gray-900/50 hover:bg-white dark:hover:bg-gray-900 border-pink-300 dark:border-pink-700"
              >
                <TrendingUp className="mr-2 w-4 h-4" />
                Zonal Head View
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainDashboard;

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardCard } from "@/components/DashboardCard";
import { MetricItem } from "@/components/MetricItem";
import { StatusPill } from "@/components/StatusPill";
import { TrendingUp, MapPin, Users, Clock, Zap, ArrowRight, LogOut, Store } from "lucide-react";

const MainDashboard = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">BAU Dashboard</h1>
              <p className="text-sm text-muted-foreground">Business Operations</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={() => navigate("/live-sprints")} variant="outline" className="gap-2">
              <Zap className="w-4 h-4" />
              View Live Sprints
            </Button>
            <Button onClick={handleSignOut} variant="ghost" className="gap-2">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Top Performance Grid - 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Current/Live Drives */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Current / Live Drives</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: "NCN", score: 85, rank: 1 },
                { name: "MRP", score: 72, rank: 2 },
                { name: "N2R", score: 58, rank: 3 },
              ].map((drive) => (
                <div
                  key={drive.name}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-muted-foreground">
                      {drive.rank}
                    </span>
                    <span className="font-medium">{drive.name}</span>
                  </div>
                  <StatusPill autoVariant value={drive.score}>
                    {drive.score}%
                  </StatusPill>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* City View */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                City View
              </CardTitle>
              <CardDescription>Performance by City</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: "Pune", score: 90 },
                { name: "Mumbai", score: 80 },
                { name: "Hyderabad", score: 75 },
                { name: "Bangalore", score: 25 },
                { name: "Delhi", score: 85 },
                { name: "Kolkata", score: 70 },
                { name: "Chennai", score: 65 },
              ].map((city) => (
                <div key={city.name} className="flex items-center justify-between">
                  <span className="text-sm">{city.name}</span>
                  <StatusPill autoVariant value={city.score}>
                    {city.score}%
                  </StatusPill>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Zone View */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Zone View
              </CardTitle>
              <CardDescription>Performance by Zone</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: "East", score: 70 },
                { name: "North-West", score: 25 },
                { name: "South", score: 60 },
                { name: "Central", score: 80 },
                { name: "PCMC", score: 75 },
              ].map((zone) => (
                <div key={zone.name} className="flex items-center justify-between">
                  <span className="text-sm">{zone.name}</span>
                  <StatusPill autoVariant value={zone.score}>
                    {zone.score}%
                  </StatusPill>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* KAM View */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">KAM View</CardTitle>
              <CardDescription>Key Account Managers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: "Shiv", score: 50 },
                { name: "Amdeep", score: 70 },
                { name: "Shrawani", score: 70 },
                { name: "Rutuja", score: 20 },
                { name: "Viraj", score: 85 },
                { name: "Rohit", score: 65 },
                { name: "Jaswant", score: 75 },
              ].map((kam) => (
                <div key={kam.name} className="flex items-center justify-between">
                  <span className="text-sm">{kam.name}</span>
                  <StatusPill autoVariant value={kam.score}>
                    {kam.score}%
                  </StatusPill>
                </div>
              ))}
              <Button
                onClick={() => navigate("/zonal-head-view")}
                variant="link"
                className="text-primary p-0 h-auto gap-1"
              >
                View all KAMs
                <ArrowRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Grid - Aligned with Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Past Drives */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Past Drives</CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Ads Drive</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Jan 15, 2025</p>
                </div>
                <StatusPill autoVariant value={92} className="text-xs">
                  92%
                </StatusPill>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Drives */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Upcoming Drives</CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Image Drive</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Feb 20, 2025</p>
                </div>
                <StatusPill type="neutral" className="text-xs">
                  Scheduled
                </StatusPill>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* My Portfolio Section - Full Width CTA */}
        <Card
          className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-primary/20 hover:shadow-lg transition-all cursor-pointer group"
          onClick={() => navigate("/kam-hub")}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center">
                  <Store className="w-8 h-8 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-1">My Portfolio</h3>
                  <p className="text-sm text-muted-foreground">
                    View and manage all restaurants with search and filtering
                  </p>
                </div>
              </div>
              <Button size="lg" className="gap-2 group-hover:gap-3 transition-all">
                View Portfolio
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default MainDashboard;

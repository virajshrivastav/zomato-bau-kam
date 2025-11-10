import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LogOut, Zap, MapPin, Clock, BarChart3, ArrowRight } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    navigate("/");
  };

  const getPerformanceBadgeVariant = (score: number) => {
    if (score >= 80) return "success";
    if (score >= 60) return "warning";
    return "destructive";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">BAU Dashboard</h1>
              <p className="text-sm text-muted-foreground">Business Operations</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={() => navigate("/analytics")} variant="outline" className="gap-2">
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
        {/* Top Performance Grid */}
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
                  <Badge variant={getPerformanceBadgeVariant(drive.score)}>{drive.score}%</Badge>
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
              ].map((city) => (
                <div key={city.name} className="flex items-center justify-between">
                  <span className="text-sm">{city.name}</span>
                  <Badge variant={getPerformanceBadgeVariant(city.score)}>{city.score}%</Badge>
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
              ].map((zone) => (
                <div key={zone.name} className="flex items-center justify-between">
                  <span className="text-sm">{zone.name}</span>
                  <Badge variant={getPerformanceBadgeVariant(zone.score)}>{zone.score}%</Badge>
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
              ].map((kam) => (
                <div key={kam.name} className="flex items-center justify-between">
                  <span className="text-sm">{kam.name}</span>
                  <Badge variant={getPerformanceBadgeVariant(kam.score)}>{kam.score}%</Badge>
                </div>
              ))}
              <Button variant="link" className="text-primary p-0 h-auto gap-1">
                View all KAMs
                <ArrowRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Grid - Optimized Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Past Drives - Compact */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Past Drives</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Ads Drive</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Jan 15, 2025</p>
                </div>
                <Badge variant="success" className="text-xs">
                  92%
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Drives - Compact */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Upcoming Drives</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Image Drive</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Feb 20, 2025</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  Scheduled
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics - Extended */}
          <Card className="lg:col-span-7">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm">Performance Metrics</CardTitle>
                  <CardDescription className="text-xs">
                    Detailed analytics and insights
                  </CardDescription>
                </div>
                <Button
                  onClick={() => navigate("/analytics")}
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                >
                  View Full Analytics
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Metric Grid */}
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Owner Live Drives</p>
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span>NCN</span>
                      <Badge variant="success" className="text-xs h-5">
                        85%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span>MRP</span>
                      <Badge variant="warning" className="text-xs h-5">
                        72%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span>N2R</span>
                      <Badge variant="destructive" className="text-xs h-5">
                        58%
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">City Wise</p>
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span>Pune</span>
                      <Badge variant="success" className="text-xs h-5">
                        90%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span>Mumbai</span>
                      <Badge variant="success" className="text-xs h-5">
                        80%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span>Hyderabad</span>
                      <Badge variant="warning" className="text-xs h-5">
                        75%
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Zone Wise</p>
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span>East</span>
                      <Badge variant="warning" className="text-xs h-5">
                        70%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span>North-West</span>
                      <Badge variant="destructive" className="text-xs h-5">
                        25%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span>South</span>
                      <Badge variant="warning" className="text-xs h-5">
                        60%
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">KAM Performance</p>
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span>Shiv</span>
                      <Badge variant="destructive" className="text-xs h-5">
                        50%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span>Amdeep</span>
                      <Badge variant="warning" className="text-xs h-5">
                        70%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span>Shrawani</span>
                      <Badge variant="warning" className="text-xs h-5">
                        70%
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Restaurants Section - Compact */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs">Restaurants</CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <div className="flex flex-col items-center justify-center text-center">
                <MapPin className="w-6 h-6 text-muted-foreground mb-1" />
                <p className="text-xs text-muted-foreground mb-2">No restaurants yet</p>
                <Button variant="outline" size="sm" className="text-xs h-7">
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

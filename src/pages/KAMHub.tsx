import { useNavigate } from "react-router-dom";
import { SearchBar } from "@/components/SearchBar";
import { StatusPill } from "@/components/StatusPill";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, TrendingUp, TrendingDown, Store, Target, BarChart3, Home } from "lucide-react";

const restaurants = [
  { id: 1, name: "Viraj Restaurant", status: "poor" as const, revenue: "₹12K", orders: 45, trend: "down" },
  { id: 2, name: "Snehil Restaurant", status: "good" as const, revenue: "₹28K", orders: 128, trend: "up" },
  { id: 3, name: "Rakesh Restaurant", status: "best" as const, revenue: "₹45K", orders: 210, trend: "up" },
  { id: 4, name: "Priya's Kitchen", status: "good" as const, revenue: "₹32K", orders: 156, trend: "up" },
  { id: 5, name: "Mumbai Spice", status: "pending" as const, revenue: "₹8K", orders: 32, trend: "down" },
  { id: 6, name: "Tandoor Express", status: "good" as const, revenue: "₹22K", orders: 98, trend: "up" },
  { id: 7, name: "South Flavors", status: "approached" as const, revenue: "₹5K", orders: 18, trend: "up" },
];

const driveMetrics = [
  { id: 1, label: "NCN", value: "25%", subtitle: "New Customer to New", change: "+3.2%", isPositive: true },
  { id: 2, label: "N2R", value: "18%", subtitle: "New to Regular", change: "+1.8%", isPositive: true },
  { id: 3, label: "MRP", value: "₹45K", subtitle: "Monthly Revenue per Rest.", change: "-2.1%", isPositive: false },
  { id: 4, label: "Active", value: "127", subtitle: "Active Restaurants", change: "+12", isPositive: true },
];

const KAMHub = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
                className="hover:bg-muted"
              >
                <Home className="h-5 w-5" />
              </Button>
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                SU
              </div>
              <div>
                <p className="text-sm font-medium">Shiv Udesi</p>
                <p className="text-xs text-muted-foreground">shiv.udesi@zomato.com</p>
              </div>
            </div>
            <SearchBar className="flex-1 max-w-xl" />
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/zonal-head-view")}
              className="hidden md:flex"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Zonal View
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[1fr_400px] gap-6">
          {/* Left Column - Restaurant View */}
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Restaurant Portfolio</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {restaurants.length} restaurants under management
                </p>
              </div>
              <Badge variant="outline" className="gap-1">
                <Store className="h-3 w-3" />
                {restaurants.length} Total
              </Badge>
            </div>
            <div className="space-y-3">
              {restaurants.map((restaurant, index) => (
                <Card
                  key={restaurant.id}
                  className="group p-5 hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-transparent hover:border-l-primary animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-semibold">
                          {restaurant.name}
                        </span>
                        <StatusPill status={restaurant.status} />
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Target className="h-3.5 w-3.5" />
                          <span>{restaurant.orders} orders</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {restaurant.trend === "up" ? (
                            <TrendingUp className="h-3.5 w-3.5 text-status-good" />
                          ) : (
                            <TrendingDown className="h-3.5 w-3.5 text-status-poor" />
                          )}
                          <span className="font-medium">{restaurant.revenue}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Column - Drive View */}
          <div className="animate-fade-in" style={{ animationDelay: "200ms" }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Performance Metrics</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Your key drive indicators
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {driveMetrics.map((metric, index) => (
                <Card
                  key={metric.id}
                  className="p-5 hover:shadow-md transition-all duration-300 animate-scale-in"
                  style={{ animationDelay: `${300 + index * 100}ms` }}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-sm font-medium text-muted-foreground">
                            {metric.label}
                          </span>
                          <Badge 
                            variant={metric.isPositive ? "default" : "destructive"}
                            className="text-xs"
                          >
                            {metric.change}
                          </Badge>
                        </div>
                        <div className="text-3xl font-bold text-primary">
                          {metric.value}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {metric.subtitle}
                        </p>
                      </div>
                      {metric.isPositive ? (
                        <TrendingUp className="h-5 w-5 text-status-good" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-status-poor" />
                      )}
                    </div>
                  </div>
                </Card>
              ))}
              
              <Card
                className="p-5 bg-primary text-primary-foreground hover:shadow-primary transition-all duration-300 cursor-pointer group mt-6"
                onClick={() => navigate("/kam-analytics")}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold mb-1">View Full Analytics</p>
                    <p className="text-xs opacity-90">Detailed insights & trends</p>
                  </div>
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default KAMHub;

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Users,
  DollarSign,
  Activity,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

/**
 * KAM Analytics Page
 *
 * NOTE: This page currently uses MOCK DATA intentionally.
 *
 * Reason: Real analytics data is still evolving and changing. Once data stabilizes,
 * this can be connected to real metrics in 1-2 hours by:
 * 1. Creating database functions for metrics calculation (conversion rates, trends, etc.)
 * 2. Creating useKAMStats() hook to fetch real data
 * 3. Replacing the mock data arrays below with real data from the hook
 *
 * For now, this serves as a UI preview for stakeholders.
 */

const KAMAnalytics = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // MOCK DATA - Sample data for bar chart
  const barData = [
    { name: "Week 1", value: 45 },
    { name: "Week 2", value: 52 },
    { name: "Week 3", value: 38 },
    { name: "Week 4", value: 65 },
    { name: "Week 5", value: 58 },
    { name: "Week 6", value: 72 },
    { name: "Week 7", value: 48 },
  ];

  // MOCK DATA - Sample data for pie chart
  const pieData = [
    { name: "Active", value: 450, color: "hsl(var(--chart-1))" },
    { name: "Pending", value: 280, color: "hsl(var(--chart-2))" },
    { name: "Inactive", value: 180, color: "hsl(var(--chart-3))" },
    { name: "New", value: 90, color: "hsl(var(--chart-4))" },
  ];

  const kpis = [
    {
      label: "N2R",
      fullName: "New to Repeat",
      values: ["25%", "22%", "23%", "25%", "30%"],
      trend: "up",
      icon: TrendingUp,
      color: "text-chart-1",
    },
    {
      label: "NCN",
      fullName: "New Customer Network",
      values: ["18%", "21%", "19%", "23%", "27%"],
      trend: "up",
      icon: Users,
      color: "text-chart-2",
    },
    {
      label: "MRP",
      fullName: "Market Revenue Penetration",
      values: ["32%", "28%", "31%", "29%", "35%"],
      trend: "up",
      icon: DollarSign,
      color: "text-chart-3",
    },
    {
      label: "ADS",
      fullName: "Average Deal Size",
      values: ["15%", "17%", "16%", "18%", "20%"],
      trend: "up",
      icon: Activity,
      color: "text-chart-4",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={() => navigate("/kam-hub")} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to KAM Hub
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium">KAM Analytics</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                <Target className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl space-y-6">
        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bar Chart */}
            <Card className="shadow-elevated hover:shadow-lg-soft transition-all duration-300 border-border/50 animate-scale-in">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold">
                    Weekly Performance Metrics
                  </CardTitle>
                  <div className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                    Last 7 Weeks
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={barData}>
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={1} />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.6} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                      opacity={0.3}
                    />
                    <XAxis
                      dataKey="name"
                      stroke="hsl(var(--muted-foreground))"
                      style={{ fontSize: "12px", fontWeight: 500 }}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      style={{ fontSize: "12px", fontWeight: 500 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                      cursor={{ fill: "hsl(var(--muted))", opacity: 0.2 }}
                    />
                    <Bar
                      dataKey="value"
                      fill="url(#barGradient)"
                      radius={[8, 8, 0, 0]}
                      animationDuration={1000}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Pie Chart */}
            <Card className="shadow-elevated hover:shadow-lg-soft transition-all duration-300 border-border/50 animate-slide-up">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold">Customer Distribution</CardTitle>
                  <div className="px-3 py-1 bg-chart-2/10 text-chart-2 text-sm font-medium rounded-full">
                    1,000 Total
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <defs>
                      {pieData.map((entry, index) => (
                        <linearGradient
                          key={`gradient-${index}`}
                          id={`pieGradient-${index}`}
                          x1="0"
                          y1="0"
                          x2="1"
                          y2="1"
                        >
                          <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                          <stop offset="100%" stopColor={entry.color} stopOpacity={0.7} />
                        </linearGradient>
                      ))}
                    </defs>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={110}
                      innerRadius={60}
                      fill="hsl(var(--primary))"
                      dataKey="value"
                      animationDuration={1000}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`url(#pieGradient-${index})`} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: "14px", fontWeight: 500 }}
                      iconType="circle"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - KPIs and Action Button */}
          <div className="space-y-6">
            {/* KPI Cards */}
            <Card className="shadow-elevated hover:shadow-lg-soft transition-all duration-300 border-border/50 animate-fade-in">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold">Customer Specific Coverage</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Track key performance indicators
                </p>
              </CardHeader>
              <CardContent className="space-y-5">
                {kpis.map((kpi, index) => {
                  const Icon = kpi.icon;
                  const latestValue = kpi.values[kpi.values.length - 1];
                  const previousValue = kpi.values[kpi.values.length - 2];

                  return (
                    <div
                      key={index}
                      className="group p-4 rounded-lg bg-gradient-to-br from-muted/30 to-muted/10 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-md"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-lg bg-gradient-to-br from-${kpi.color}/20 to-${kpi.color}/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                          >
                            <Icon className={`w-5 h-5 ${kpi.color}`} />
                          </div>
                          <div>
                            <div className="font-semibold text-foreground text-sm">{kpi.label}</div>
                            <div className="text-xs text-muted-foreground">{kpi.fullName}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          {kpi.trend === "up" ? (
                            <TrendingUp className="w-4 h-4 text-chart-2" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-destructive" />
                          )}
                          <span className="font-bold text-lg">{latestValue}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {kpi.values.map((value, valueIndex) => (
                          <span
                            key={valueIndex}
                            className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
                              valueIndex === kpi.values.length - 1
                                ? "bg-primary/10 text-primary ring-1 ring-primary/20 scale-105"
                                : "bg-secondary/50 text-secondary-foreground hover:bg-secondary"
                            }`}
                          >
                            {value}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Strategize Button */}
            <Card className="shadow-elevated hover:shadow-lg-soft transition-all duration-300 border-border/50 overflow-hidden animate-scale-in">
              <div className="relative bg-gradient-to-br from-primary via-primary to-primary/90 p-6">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
                <div className="relative">
                  <h3 className="text-white font-semibold text-lg mb-2">Ready to optimize?</h3>
                  <p className="text-white/80 text-sm mb-4">
                    Review insights and create strategic action plans
                  </p>
                  <Button
                    className="w-full bg-white text-primary hover:bg-white/90 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    size="lg"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Strategize Now
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KAMAnalytics;

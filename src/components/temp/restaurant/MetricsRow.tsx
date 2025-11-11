import { MetricCard } from "@/components/temp/ui/MetricCard";
import { RestaurantMetrics } from "@/types/restaurantTemp";
import { Grid3x3, TrendingUp, DollarSign, Smartphone } from "lucide-react";

interface MetricsRowProps {
  metrics: RestaurantMetrics;
}

export const MetricsRow = ({ metrics }: MetricsRowProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Active Drives"
        value={metrics.activeDrives}
        icon={Grid3x3}
        variant="primary"
      />
      <MetricCard
        title="ZVD.PO"
        value={metrics.zvdPo}
        icon={TrendingUp}
        variant="success"
        description="Zero Value Delivery Per Order"
      />
      <MetricCard
        title="ADS Budget"
        value={`₹${metrics.adsBudget.total.toLocaleString()}`}
        icon={DollarSign}
        variant="warning"
        progress={metrics.adsBudget.percentage}
        description={`₹${metrics.adsBudget.utilized.toLocaleString()} utilized`}
      />
      <MetricCard
        title="TOING Flag"
        value={metrics.toingFlag}
        icon={Smartphone}
        variant={metrics.toingFlag === "Live" ? "success" : "default"}
      />
    </div>
  );
};

import ZonalHeader from "@/components/ZonalHeader";
import KPICard from "@/components/KPICard";
import KAMPerformanceTable from "@/components/KAMPerformanceTable";
import { Users, TrendingUp, Target, Activity } from "lucide-react";

const ZonalHeadView = () => {
  return (
    <div className="min-h-screen bg-background">
      <ZonalHeader />
      
      <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-fade-in">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Performance Dashboard
          </h2>
          <p className="text-muted-foreground">
            Track and analyze Key Account Manager performance across the region
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <KPICard
            title="Total KAMs"
            value="5"
            icon={Users}
            description="Active account managers"
            change="+2"
            changeType="positive"
          />
          <KPICard
            title="Avg Conversion Rate"
            value="76.8%"
            icon={TrendingUp}
            description="Team average"
            change="+3.2%"
            changeType="positive"
          />
          <KPICard
            title="Avg Approach Rate"
            value="82.4%"
            icon={Target}
            description="Team average"
            change="+1.8%"
            changeType="positive"
          />
          <KPICard
            title="Total Drives"
            value="200"
            icon={Activity}
            description="This month"
            change="+12%"
            changeType="positive"
          />
        </div>

        <div>
          <h3 className="text-xl font-semibold text-foreground mb-4">
            KAM Performance Rankings
          </h3>
          <KAMPerformanceTable />
        </div>
      </main>
    </div>
  );
};

export default ZonalHeadView;

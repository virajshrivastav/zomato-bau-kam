import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "./StatusBadge";
import { Zap } from "lucide-react";

interface ActiveDrivesCardProps {
  drives: string[];
}

export const ActiveDrivesCard = ({ drives }: ActiveDrivesCardProps) => {
  const driveDescriptions = {
    N2R: "New to Restaurant - Onboarding new customers",
    NCN: "New Customer Nurture - Engaging first-time users",
    MRP: "Most Relevant Product - Personalized recommendations",
  };

  return (
    <Card className="card-hover border-primary/20">
      <CardHeader className="border-b bg-gradient-to-br from-[hsl(var(--status-info))]/5 to-transparent">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Zap className="w-5 h-5 text-[hsl(var(--status-info))]" />
          Active Drives
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {drives.length === 0 ? (
          <p className="text-muted-foreground text-sm">No active drives</p>
        ) : (
          <div className="space-y-3">
            {drives.map((drive, index) => (
              <div
                key={index}
                className="p-3 rounded-lg border border-[hsl(var(--status-info))]/20 bg-[hsl(var(--status-info))]/5 hover:bg-[hsl(var(--status-info))]/10 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <StatusBadge variant="info">{drive}</StatusBadge>
                  <Zap className="w-4 h-4 text-[hsl(var(--status-info))]" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {driveDescriptions[drive as keyof typeof driveDescriptions]}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

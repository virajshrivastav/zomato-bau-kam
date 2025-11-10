import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
  description?: string;
}

export const KPICard = ({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  iconColor = "text-primary",
  description,
}: KPICardProps) => {
  return (
    <Card className="card-hover overflow-hidden relative hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />
      <CardContent className="p-6 relative">
        <div className="flex items-start justify-between mb-4">
          <div className={cn("p-2 rounded-lg bg-primary/10", iconColor)}>
            <Icon className="w-5 h-5" />
          </div>
          {change && (
            <span
              className={cn(
                "text-xs font-medium px-2 py-1 rounded-full",
                changeType === "positive" &&
                  "bg-[hsl(var(--status-done))]/10 text-[hsl(var(--status-done))]",
                changeType === "negative" && "bg-destructive/10 text-destructive",
                changeType === "neutral" && "bg-muted text-muted-foreground"
              )}
            >
              {change}
            </span>
          )}
        </div>
        <div>
          <p className="text-2xl font-bold mb-1">{value}</p>
          <p className="text-sm text-muted-foreground">{title}</p>
          {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        </div>
      </CardContent>
    </Card>
  );
};

export default KPICard;

import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant?: "primary" | "success" | "warning" | "default";
  progress?: number;
  description?: string;
}

export const MetricCard = ({
  title,
  value,
  icon: Icon,
  variant = "default",
  progress,
  description,
}: MetricCardProps) => {
  // Determine icon background and text color based on variant
  const variantStyles = {
    primary: "bg-primary/10 text-primary",
    success: "bg-[hsl(var(--status-success))]/10 text-[hsl(var(--status-success))]",
    warning: "bg-[hsl(var(--status-warning))]/10 text-[hsl(var(--status-warning))]",
    default: "bg-muted text-muted-foreground",
  };

  const decorativeCircleStyles = {
    primary: "bg-primary/5",
    success: "bg-[hsl(var(--status-success))]/5",
    warning: "bg-[hsl(var(--status-warning))]/5",
    default: "bg-muted/50",
  };

  return (
    <Card className="overflow-hidden relative hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Decorative circle - top right */}
      <div
        className={cn(
          "absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16",
          decorativeCircleStyles[variant]
        )}
      />

      <CardContent className="p-6 relative">
        {/* Icon in colored circle */}
        <div className="flex items-start justify-between mb-4">
          <div className={cn("p-2 rounded-lg", variantStyles[variant])}>
            <Icon className="w-5 h-5" />
          </div>
        </div>

        {/* Title and Value */}
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        </div>

        {/* Optional Progress Bar */}
        {progress !== undefined && (
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">{progress}% utilized</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

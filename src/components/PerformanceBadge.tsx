import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PerformanceBadgeProps {
  value: number;
  type: "percentage" | "ratio";
}

const PerformanceBadge = ({ value, type }: PerformanceBadgeProps) => {
  const getPerformanceLevel = () => {
    if (type === "percentage") {
      if (value >= 80) return { label: "Excellent", variant: "success" };
      if (value >= 70) return { label: "Good", variant: "warning" };
      return { label: "Needs Improvement", variant: "destructive" };
    } else {
      // For ratio (e.g., 8/10 = 0.8)
      if (value >= 0.8) return { label: "Excellent", variant: "success" };
      if (value >= 0.7) return { label: "Good", variant: "warning" };
      return { label: "Needs Improvement", variant: "destructive" };
    }
  };

  const performance = getPerformanceLevel();

  return (
    <Badge
      className={cn(
        "font-semibold",
        performance.variant === "success" &&
          "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400",
        performance.variant === "warning" &&
          "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400",
        performance.variant === "destructive" &&
          "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400"
      )}
    >
      {performance.label}
    </Badge>
  );
};

export default PerformanceBadge;

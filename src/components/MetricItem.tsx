import { StatusPill } from "./StatusPill";

interface MetricItemProps {
  label: string;
  value: string | number;
  showPill?: boolean;
  pillType?: "success" | "warning" | "danger" | "neutral";
}

export const MetricItem = ({ label, value, showPill, pillType }: MetricItemProps) => {
  const getStatusType = (val: string | number): "success" | "warning" | "danger" | "neutral" => {
    if (pillType) return pillType;
    const numValue = typeof val === "string" ? parseInt(val) : val;
    if (numValue >= 70) return "success";
    if (numValue >= 40) return "warning";
    return "danger";
  };

  return (
    <div className="flex items-center justify-between py-3 hover:bg-muted/50 px-3 rounded-lg transition-all duration-200 hover:scale-[1.02] group">
      <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{label}</span>
      {showPill ? (
        <StatusPill type={getStatusType(value)}>{value}</StatusPill>
      ) : (
        <span className="text-sm font-medium text-muted-foreground">{value}</span>
      )}
    </div>
  );
};

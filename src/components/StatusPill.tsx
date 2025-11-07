import { cn } from "@/lib/utils";

type StatusType = "success" | "warning" | "danger" | "neutral";

interface StatusPillProps {
  children: React.ReactNode;
  type?: StatusType;
  className?: string;
}

const statusStyles: Record<StatusType, string> = {
  success: "bg-status-success/10 text-status-success border-status-success/30 shadow-sm",
  warning: "bg-status-warning/10 text-status-warning border-status-warning/30 shadow-sm",
  danger: "bg-status-danger/10 text-status-danger border-status-danger/30 shadow-sm",
  neutral: "bg-muted text-muted-foreground border-border",
};

export const StatusPill = ({ children, type = "neutral", className }: StatusPillProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 hover:scale-105",
        statusStyles[type],
        className
      )}
    >
      {children}
    </span>
  );
};

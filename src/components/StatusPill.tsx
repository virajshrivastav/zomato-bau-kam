import { cn, getPerformanceBadgeVariant } from "@/lib/utils";

type StatusType = "success" | "warning" | "danger" | "neutral";

interface StatusPillProps {
  children: React.ReactNode;
  type?: StatusType;
  className?: string;
  /**
   * Enable automatic variant calculation based on value
   * When true, the variant will be determined by the value prop
   */
  autoVariant?: boolean;
  /**
   * Value to use for automatic variant calculation
   * Can be a number or string (e.g., "85%", "₹50K", "72")
   */
  value?: number | string;
}

const statusStyles: Record<StatusType, string> = {
  success: "bg-status-success/10 text-status-success border-status-success/30 shadow-sm",
  warning: "bg-status-warning/10 text-status-warning border-status-warning/30 shadow-sm",
  danger: "bg-status-danger/10 text-status-danger border-status-danger/30 shadow-sm",
  neutral: "bg-muted text-muted-foreground border-border",
};

export const StatusPill = ({
  children,
  type,
  className,
  autoVariant = false,
  value,
}: StatusPillProps) => {
  // Determine the variant to use
  let variant: StatusType;

  if (autoVariant && value !== undefined) {
    // Auto-calculate variant based on value
    variant = getPerformanceBadgeVariant(value);
  } else if (type) {
    // Use explicitly provided type
    variant = type;
  } else {
    // Default to neutral
    variant = "neutral";
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 hover:scale-105",
        statusStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

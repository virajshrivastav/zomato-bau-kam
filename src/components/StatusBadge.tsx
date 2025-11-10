import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  variant: "info" | "done" | "pending";
  children: React.ReactNode;
  className?: string;
}

export const StatusBadge = ({ variant, children, className }: StatusBadgeProps) => {
  const variants = {
    info: "bg-[hsl(var(--status-info))] text-white",
    done: "bg-[hsl(var(--status-done))] text-white",
    pending: "bg-[hsl(var(--status-pending))] text-white",
  };

  return <span className={cn("status-badge", variants[variant], className)}>{children}</span>;
};

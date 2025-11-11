import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ManagementCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
}

export const ManagementCard = ({
  title,
  subtitle,
  children,
  className,
  footer,
}: ManagementCardProps) => {
  return (
    <Card
      className={cn(
        "shadow-md hover:shadow-xl transition-all duration-300 border-border/50 bg-gradient-to-br from-card to-card/95 hover:-translate-y-1",
        className
      )}
    >
      <CardHeader className="pb-4 border-b border-border/50">
        <CardTitle className="text-lg font-bold text-foreground">{title}</CardTitle>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {children}
        {footer && <div className="pt-4 border-t border-border/50 mt-4">{footer}</div>}
      </CardContent>
    </Card>
  );
};

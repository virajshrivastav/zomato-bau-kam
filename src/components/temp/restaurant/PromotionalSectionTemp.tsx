import { ManagementCardTemp } from "@/components/temp/ui/ManagementCardTemp";
import { PromotionalData } from "@/types/restaurantTemp";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, Zap, Gift } from "lucide-react";

interface PromotionalSectionTempProps {
  data: PromotionalData;
}

export const PromotionalSectionTemp = ({ data }: PromotionalSectionTempProps) => {
  const statusColors = {
    pending:
      "bg-[hsl(var(--status-warning))]/10 text-[hsl(var(--status-warning))] border-[hsl(var(--status-warning))]/20",
    active:
      "bg-[hsl(var(--status-success))]/10 text-[hsl(var(--status-success))] border-[hsl(var(--status-success))]/20",
    scheduled: "bg-primary/10 text-primary border-primary/20",
  };

  return (
    <ManagementCardTemp title="BOGO / Flash Sale" subtitle="Promotional Planning">
      {/* Action Required Alert */}
      {data.actionRequired && (
        <div className="flex items-start gap-3 p-4 border border-[hsl(var(--status-warning))]/30 bg-[hsl(var(--status-warning))]/5 rounded-lg">
          <AlertCircle className="w-5 h-5 text-[hsl(var(--status-warning))] flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground mb-1">Action Required</p>
            <p className="text-xs text-muted-foreground">
              Suggested items for BOGO/Flash sale need to be reviewed and approved
            </p>
          </div>
        </div>
      )}

      {/* Status Badge */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Status:</span>
        <Badge variant="outline" className={statusColors[data.status]}>
          {data.status}
        </Badge>
      </div>

      {/* BOGO Items */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Gift className="w-4 h-4 text-primary" />
          <h4 className="text-sm font-semibold">BOGO Items</h4>
        </div>
        <div className="space-y-2">
          {data.bogoItems.length > 0 ? (
            data.bogoItems.map((item, index) => (
              <div
                key={index}
                className="p-3 border border-border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <p className="text-sm text-foreground">{item}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground italic">No BOGO items selected</p>
          )}
        </div>
      </div>

      {/* Flash Sale Items */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-4 h-4 text-[hsl(var(--status-warning))]" />
          <h4 className="text-sm font-semibold">Flash Sale Items</h4>
        </div>
        <div className="space-y-2">
          {data.flashSaleItems.length > 0 ? (
            data.flashSaleItems.map((item, index) => (
              <div
                key={index}
                className="p-3 border border-border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <p className="text-sm text-foreground">{item}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground italic">No flash sale items selected</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button variant="default" className="flex-1">
          Approve Campaign
        </Button>
        <Button variant="outline" className="flex-1">
          Edit Items
        </Button>
      </div>
    </ManagementCardTemp>
  );
};

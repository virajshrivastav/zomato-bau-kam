import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Tag, Plus } from "lucide-react";
import { toast } from "sonner";

interface Promo {
  id: string;
  name: string;
  discount: string;
}

interface PromosCardProps {
  title: string;
  promos: Promo[];
  showActivateButton?: boolean;
}

export const PromosCard = ({ title, promos, showActivateButton }: PromosCardProps) => {
  const [selectedPromos, setSelectedPromos] = useState<string[]>([]);

  const handlePromoToggle = (promoId: string) => {
    setSelectedPromos((prev) =>
      prev.includes(promoId) ? prev.filter((id) => id !== promoId) : [...prev, promoId]
    );
  };

  const handleActivate = () => {
    if (selectedPromos.length === 0) {
      toast.error("Please select at least one promo");
      return;
    }
    toast.success(`Activated ${selectedPromos.length} promo(s)`);
    setSelectedPromos([]);
  };

  return (
    <Card className="card-hover h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Tag className="w-4 h-4 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="space-y-2 flex-1">
          {promos.length === 0 ? (
            <p className="text-sm text-muted-foreground">No promos available</p>
          ) : (
            promos.map((promo) => (
              <div
                key={promo.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-all duration-200"
              >
                <Checkbox
                  id={promo.id}
                  checked={selectedPromos.includes(promo.id)}
                  onCheckedChange={() => handlePromoToggle(promo.id)}
                />
                <label htmlFor={promo.id} className="flex-1 cursor-pointer">
                  <p className="font-medium text-sm">{promo.name}</p>
                  <p className="text-xs text-muted-foreground">{promo.discount}</p>
                </label>
              </div>
            ))
          )}
        </div>
        {showActivateButton && (
          <Button
            onClick={handleActivate}
            className="w-full mt-4"
            disabled={selectedPromos.length === 0}
          >
            <Plus className="w-4 h-4 mr-2" />
            Activate Selected
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

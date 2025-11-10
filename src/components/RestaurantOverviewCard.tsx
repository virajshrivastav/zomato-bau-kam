import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, DollarSign, MapPin, Phone, Mail } from "lucide-react";

interface RestaurantOverviewCardProps {
  restaurantData: {
    id: string;
    name: string;
    adsBudget: string;
    location: string;
    phone: string;
    email: string;
  };
}

export const RestaurantOverviewCard = ({ restaurantData }: RestaurantOverviewCardProps) => {
  const details = [
    { icon: Building2, label: "Res ID", value: restaurantData.id },
    { icon: Building2, label: "Res Name", value: restaurantData.name },
    { icon: DollarSign, label: "Ads Budget", value: restaurantData.adsBudget },
    { icon: MapPin, label: "Location", value: restaurantData.location },
    { icon: Phone, label: "Phone", value: restaurantData.phone },
    { icon: Mail, label: "Email", value: restaurantData.email },
  ];

  return (
    <Card className="card-hover border-primary/20">
      <CardHeader className="border-b bg-gradient-to-br from-primary/5 to-transparent">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" />
          Restaurant Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-3">
          {details.map((detail, index) => {
            const Icon = detail.icon;
            return (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-all duration-200 border border-transparent hover:border-border"
              >
                <div className="p-2 rounded-lg bg-primary/10">
                  <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    {detail.label}
                  </p>
                  <p className="font-semibold text-foreground truncate">{detail.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

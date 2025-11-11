import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Phone,
  Mail,
  ExternalLink,
  Share2,
  MoreVertical,
  ArrowLeft,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface RestaurantHeaderProps {
  restaurant: {
    id: string;
    name: string;
    location: string;
    phone: string;
    email: string;
  };
}

export const RestaurantHeader = ({ restaurant }: RestaurantHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="bg-card border-b">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
        {/* Back Button & Breadcrumbs */}
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/kam-hub")} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to KAM Hub
          </Button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">{restaurant.name}</span>
          </div>
        </div>

        {/* Header Content */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="font-medium">ID:</span> {restaurant.id}
              </span>
              <span>•</span>
              <span>{restaurant.location}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                window.location.href = `tel:${restaurant.phone}`;
              }}
            >
              <Phone className="w-4 h-4 mr-2" />
              Call
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                window.location.href = `mailto:${restaurant.email}`;
              }}
            >
              <Mail className="w-4 h-4 mr-2" />
              Email
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => toast.success("Link copied to clipboard")}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Restaurant
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    window.open(`https://zomato.com/restaurant/${restaurant.id}`, "_blank")
                  }
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on Zomato
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};

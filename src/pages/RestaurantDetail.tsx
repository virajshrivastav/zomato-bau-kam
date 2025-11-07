import { useParams, useNavigate } from "react-router-dom";
import { RestaurantOverviewCard } from "@/components/RestaurantOverviewCard";
import { ActiveDrivesCard } from "@/components/ActiveDrivesCard";
import { PromosCard } from "@/components/PromosCard";
import { TasksCard } from "@/components/TasksCard";
import { NotesCard } from "@/components/NotesCard";
import { RestaurantHeader } from "@/components/RestaurantHeader";
import { KPICard } from "@/components/KPICard";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Target, 
  Users, 
  DollarSign,
  ArrowLeft 
} from "lucide-react";

// Mock data - in real app, this would come from API
const mockRestaurantData = {
  "1": {
    id: "RES-2024-001",
    name: "The Golden Spoon",
    adsBudget: "₹25,000/month",
    location: "Indiranagar, Bangalore",
    phone: "+91 98765 43210",
    email: "contact@goldenspoon.com",
    drives: ["N2R", "NCN", "MRP"],
    activePromos: [
      { id: "p1", name: "Weekend Special", discount: "20% off" },
      { id: "p2", name: "Happy Hours", discount: "Buy 1 Get 1" },
    ],
    suggestedPromos: [
      { id: "p3", name: "New Customer Offer", discount: "15% off first order" },
      { id: "p4", name: "Festival Special", discount: "30% off on orders above ₹500" },
      { id: "p5", name: "Lunch Deal", discount: "25% off 12PM-3PM" },
    ],
    tasks: [
      { id: "t1", name: "Update menu items with seasonal specials", status: "done" as const },
      { id: "t2", name: "Verify pricing for new dishes", status: "pending" as const },
      { id: "t3", name: "Upload high-quality food photos", status: "pending" as const },
      { id: "t4", name: "Confirm delivery radius expansion", status: "done" as const },
      { id: "t5", name: "Review and respond to customer feedback", status: "pending" as const },
    ],
  },
  "2": {
    id: "RES-2024-002",
    name: "Spice Garden",
    adsBudget: "₹18,500/month",
    location: "Koramangala, Bangalore",
    phone: "+91 98765 43211",
    email: "info@spicegarden.com",
    drives: ["N2R", "NCN"],
    activePromos: [
      { id: "p1", name: "Dinner Deal", discount: "15% off" },
    ],
    suggestedPromos: [
      { id: "p3", name: "Family Pack", discount: "25% off on orders above ₹800" },
      { id: "p4", name: "Early Bird Special", discount: "20% off 11AM-1PM" },
    ],
    tasks: [
      { id: "t1", name: "Add new biryani variants", status: "pending" as const },
      { id: "t2", name: "Update restaurant timings", status: "done" as const },
      { id: "t3", name: "Verify contact details", status: "done" as const },
    ],
  },
};

const RestaurantDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const restaurant = id ? mockRestaurantData[id as keyof typeof mockRestaurantData] : null;

  if (!restaurant) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Restaurant Not Found</h1>
            <Button onClick={() => navigate("/")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Calculate KPIs
  const completedTasks = restaurant.tasks.filter(t => t.status === "done").length;
  const completionRate = Math.round((completedTasks / restaurant.tasks.length) * 100);

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        {/* Professional Header with Breadcrumbs */}
        <RestaurantHeader restaurant={restaurant} />

        <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">
          {/* KPI Metrics Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              title="Active Drives"
              value={restaurant.drives.length}
              change="+2 this month"
              changeType="positive"
              icon={TrendingUp}
            />
            <KPICard
              title="Task Completion"
              value={`${completionRate}%`}
              change={`${completedTasks}/${restaurant.tasks.length}`}
              changeType={completionRate >= 50 ? "positive" : "neutral"}
              icon={Target}
            />
            <KPICard
              title="Active Promos"
              value={restaurant.activePromos.length}
              change={`${restaurant.suggestedPromos.length} suggested`}
              changeType="neutral"
              icon={Users}
            />
            <KPICard
              title="Monthly Budget"
              value={restaurant.adsBudget.split('/')[0]}
              change="On track"
              changeType="positive"
              icon={DollarSign}
            />
          </div>

          {/* Overview Section - 2 Column Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <RestaurantOverviewCard restaurantData={restaurant} />
            <ActiveDrivesCard drives={restaurant.drives} />
          </div>

          {/* Action Section - 3 Column Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Column 1 - Promos */}
            <div className="space-y-6">
              <PromosCard
                title="Active Promos"
                promos={restaurant.activePromos}
              />
              <PromosCard
                title="Suggested Promos"
                promos={restaurant.suggestedPromos}
                showActivateButton
              />
            </div>

            {/* Column 2 - Tasks */}
            <TasksCard tasks={restaurant.tasks} />

            {/* Column 3 - Notes */}
            <NotesCard restaurantId={restaurant.id} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RestaurantDetail;

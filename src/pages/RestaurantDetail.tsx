import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useRestaurant } from "@/hooks/useRestaurants";
import { RestaurantHeader } from "@/components/temp/restaurant/RestaurantHeader";
import { MetricsRow } from "@/components/temp/restaurant/MetricsRow";
import { NCNManagementCard } from "@/components/temp/restaurant/NCNManagementCard";
import { N2RManagementCard } from "@/components/temp/restaurant/N2RManagementCard";
import { ItemsManagementCard } from "@/components/temp/restaurant/ItemsManagementCard";
import { CommentsSection } from "@/components/temp/restaurant/CommentsSection";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import {
  RestaurantTempData,
  RestaurantMetrics,
  NCNData,
  N2RData,
  ItemsData,
  Comment,
} from "@/types/restaurantTemp";

const RestaurantDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: restaurant, isLoading, error } = useRestaurant(id || "");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading restaurant details...</p>
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Restaurant Not Found</h1>
          <p className="text-muted-foreground mb-4">
            {error
              ? "Error loading restaurant data"
              : "This restaurant doesn't exist or you don't have access"}
          </p>
          <Button onClick={() => navigate("/kam-hub")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to KAM Hub
          </Button>
        </div>
      </div>
    );
  }

  // Transform API data to match new UI component interfaces
  const restaurantData: RestaurantTempData = {
    id: restaurant.res_id,
    name: restaurant.res_name,
    location: restaurant.locality || "N/A",
    cuisine: restaurant.cuisine || "N/A",
    phone: undefined, // TODO: Add phone field to database
    email: undefined, // TODO: Add email field to database
    toingFlag: "Not Live", // TODO: Add TOING flag to database
  };

  const metricsData: RestaurantMetrics = {
    activeDrives: restaurant.drive_data?.length || 0,
    zvdPo: "N/A", // TODO: Add ZVD.PO calculation
    adsBudget: {
      total: 50000, // TODO: Add ADS budget to database
      utilized: 32000, // TODO: Add ADS utilized to database
      percentage: 64, // TODO: Calculate from total and utilized
    },
    toingFlag: "Not Live", // TODO: Add TOING flag to database
  };

  // NCN Data - Transform from drive_data
  const ncnDriveData = restaurant.drive_data?.find(
    (dd) =>
      dd.drives?.drive_name.toLowerCase().includes("ncn") ||
      dd.drives?.drive_name.toLowerCase().includes("no cooking november")
  );

  const ncnData: NCNData = {
    priorities: [
      "Stepper Codes",
      "Base Codes",
      "BOGO Offers",
      "Flash Sales",
      "Salt Discount",
      "Customer Retention",
    ], // TODO: Add priorities to database
    activePromosLink: ncnDriveData?.la_active_promos || "#",
    suggestedPromos: {
      bogo: {
        items: ["Burger + Fries", "Pizza + Coke", "Combo Meal"], // TODO: Add to database
      },
      flashSale: {
        items: ["Lunch Special", "Dinner Deal", "Weekend Offer"], // TODO: Add to database
      },
      salt: {
        percentage: 15, // TODO: Add to database
      },
    },
    stepperAndBaseCodes: {
      la: [
        {
          id: "la-1",
          flatOff: ncnDriveData?.la || 50,
          mov: 199,
          status: ncnDriveData?.la_step1 ? "Picked" : "Pending",
          selected: false,
        },
        {
          id: "la-2",
          flatOff: ncnDriveData?.la || 75,
          mov: 299,
          status: ncnDriveData?.la_step2 ? "Picked" : "Pending",
          selected: false,
        },
      ],
      mm: [
        {
          id: "mm-1",
          flatOff: ncnDriveData?.mm || 60,
          mov: 249,
          status: "Pending",
          selected: false,
        },
      ],
      um: [
        {
          id: "um-1",
          flatOff: ncnDriveData?.um || 70,
          mov: 349,
          status: "Pending",
          selected: false,
        },
      ],
    },
    approached: ncnDriveData?.approached ? "yes" : "no",
    converted: ncnDriveData?.converted_stepper ? "yes" : "no",
  };

  // N2R Data - Transform from drive_data
  const n2rDriveData = restaurant.drive_data?.find(
    (dd) =>
      dd.drives?.drive_name.toLowerCase().includes("n2r") ||
      dd.drives?.drive_name.toLowerCase().includes("new to restaurant")
  );

  const n2rData: N2RData = {
    currentCodes: {
      la: {
        aov: n2rDriveData?.la || 250,
        currentCode: n2rDriveData?.la_active_promos || "N/A",
      },
      mm: {
        aov: n2rDriveData?.mm || 350,
        currentCode: n2rDriveData?.mm_active_promos || "N/A",
      },
      um: {
        aov: n2rDriveData?.um || 450,
        currentCode: n2rDriveData?.um_active_promos || "N/A",
      },
    },
    suggestedCodes: {
      la: {
        construct: n2rDriveData?.la_base_code_suggested || "50% upto 100",
        mov: "199rs",
      },
      mm: {
        construct: n2rDriveData?.mm_base_code_suggested || "60% upto 120",
        mov: "249rs",
      },
      um: {
        construct: n2rDriveData?.um_base_code_suggested || "70% upto 150",
        mov: "349rs",
      },
    },
    reqCoupons: {
      la: 1000, // TODO: Add to database
      mm: 800, // TODO: Add to database
      um: 600, // TODO: Add to database
    },
    approached: n2rDriveData?.approached ? "yes" : "no",
    converted: n2rDriveData?.converted_stepper ? "yes" : "no",
  };

  // Items Data
  const itemsData: ItemsData = {
    priority: "P0", // TODO: Add to database
    posFlag: "Pet Pooja", // TODO: Add to database
    pg7to10: "23%", // TODO: Add to database
    dishSuggestions: [
      "Paneer Tikka",
      "Chicken Biryani",
      "Veg Fried Rice",
      "Butter Naan",
      "Dal Makhani",
      "Gulab Jamun",
    ], // TODO: Add to database
    approached: "no",
    converted: "no",
    itemsAdded: [
      { id: "1", value: "", checked: false },
      { id: "2", value: "", checked: false },
      { id: "3", value: "", checked: false },
      { id: "4", value: "", checked: false },
      { id: "5", value: "", checked: false },
    ],
  };

  // Comments Data - TODO: Fetch from database
  const commentsData: Comment[] = [
    {
      id: "1",
      author: user?.email || "KAM",
      text: "Initial contact made with restaurant owner.",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="pt-6">
          <RestaurantHeader restaurant={restaurantData} />
        </div>

        {/* Metrics Row */}
        <MetricsRow metrics={metricsData} />

        {/* Three-Column Layout - Drive Modules */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <NCNManagementCard data={ncnData} />
          <N2RManagementCard data={n2rData} />
          <ItemsManagementCard data={itemsData} />
        </div>

        {/* Comments Section */}
        <CommentsSection comments={commentsData} />
      </div>
    </div>
  );
};

export default RestaurantDetail;

import { useParams, useNavigate } from "react-router-dom";
import { RestaurantOverviewCard } from "@/components/RestaurantOverviewCard";
import { PromosCard } from "@/components/PromosCard";
import { TasksCard } from "@/components/TasksCard";
import { NotesCard } from "@/components/NotesCard";
import { RestaurantHeader } from "@/components/RestaurantHeader";
import { KPICard } from "@/components/KPICard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useRestaurant, useMarkApproached, useMarkConverted } from "@/hooks/useRestaurants";
import {
  TrendingUp,
  Target,
  Users,
  DollarSign,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Circle,
  Zap,
} from "lucide-react";

const RestaurantDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: restaurant, isLoading, error } = useRestaurant(id || "");
  const markApproached = useMarkApproached();
  const markConverted = useMarkConverted();

  const handleMarkApproached = async (driveId: number, driveName: string) => {
    if (!user?.email || !id) return;

    try {
      await markApproached.mutateAsync({
        resId: id,
        driveId,
        kamEmail: user.email,
      });

      toast({
        title: "Success",
        description: `Marked as approached for ${driveName}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark as approached",
        variant: "destructive",
      });
    }
  };

  const handleMarkConverted = async (driveId: number, driveName: string) => {
    if (!user?.email || !id) return;

    try {
      await markConverted.mutateAsync({
        resId: id,
        driveId,
        kamEmail: user.email,
      });

      toast({
        title: "Success",
        description: `Marked as converted for ${driveName}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark as converted",
        variant: "destructive",
      });
    }
  };

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

  // Transform data for existing components
  const restaurantData = {
    id: restaurant.res_id,
    name: restaurant.res_name,
    adsBudget: "N/A",
    location: restaurant.locality || "N/A",
    phone: "N/A",
    email: "N/A",
    drives: restaurant.drive_data?.map((dd) => dd.drives?.drive_name || "Unknown") || [],
    activePromos: [],
    suggestedPromos: [],
    tasks: [],
  };

  // Calculate KPIs
  const activeDrives = restaurant.drive_data?.length || 0;
  const approachedCount = restaurant.drive_data?.filter((dd) => dd.approached).length || 0;
  const convertedCount = restaurant.drive_data?.filter((dd) => dd.converted_stepper).length || 0;
  const conversionRate = activeDrives > 0 ? Math.round((convertedCount / activeDrives) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="animate-fade-in">
        {/* Professional Header with Breadcrumbs */}
        <RestaurantHeader restaurant={restaurantData} />

        <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">
          {/* KPI Metrics Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              title="Active Drives"
              value={activeDrives}
              change={`${approachedCount} approached`}
              changeType="positive"
              icon={TrendingUp}
            />
            <KPICard
              title="Conversion Rate"
              value={`${conversionRate}%`}
              change={`${convertedCount}/${activeDrives} converted`}
              changeType={conversionRate >= 50 ? "positive" : "neutral"}
              icon={Target}
            />
            <KPICard
              title="Sept Revenue"
              value={restaurant.sept_ov ? `₹${(restaurant.sept_ov / 1000).toFixed(0)}K` : "N/A"}
              change={restaurant.cuisine || "N/A"}
              changeType="neutral"
              icon={DollarSign}
            />
            <KPICard
              title="Priority Score"
              value={restaurant.drive_data?.[0]?.priority_score || 0}
              change="Avg across drives"
              changeType="neutral"
              icon={Users}
            />
          </div>

          {/* Overview Section - 2 Column Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <RestaurantOverviewCard restaurantData={restaurantData} />

            {/* Drive Tracking Card */}
            <Card className="card-hover border-primary/20">
              <CardHeader className="border-b bg-gradient-to-br from-[hsl(var(--status-info))]/5 to-transparent">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[hsl(var(--status-info))]" />
                  Active Drives & Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {!restaurant.drive_data || restaurant.drive_data.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No active drives</p>
                ) : (
                  <div className="space-y-4">
                    {restaurant.drive_data.map((driveData) => {
                      const drive = driveData.drives;
                      if (!drive) return null;

                      return (
                        <div
                          key={driveData.id}
                          className="p-4 rounded-lg border border-border bg-card hover:shadow-md transition-all"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="font-semibold">
                                  {drive.drive_name}
                                </Badge>
                                {driveData.converted_stepper && (
                                  <Badge className="bg-status-good text-white">Converted</Badge>
                                )}
                                {driveData.approached && !driveData.converted_stepper && (
                                  <Badge variant="secondary">Approached</Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {drive.drive_type || "Marketing Drive"} • Priority:{" "}
                                {driveData.priority_score}
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant={driveData.approached ? "outline" : "default"}
                              onClick={() => handleMarkApproached(drive.id, drive.drive_name)}
                              disabled={driveData.approached || markApproached.isPending}
                              className="flex-1"
                            >
                              {driveData.approached ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                                  Approached
                                </>
                              ) : (
                                <>
                                  <Circle className="w-3.5 h-3.5 mr-1" />
                                  Mark Approached
                                </>
                              )}
                            </Button>

                            <Button
                              size="sm"
                              variant={driveData.converted_stepper ? "outline" : "default"}
                              onClick={() => handleMarkConverted(drive.id, drive.drive_name)}
                              disabled={driveData.converted_stepper || markConverted.isPending}
                              className="flex-1"
                            >
                              {driveData.converted_stepper ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                                  Converted
                                </>
                              ) : (
                                <>
                                  <Circle className="w-3.5 h-3.5 mr-1" />
                                  Mark Converted
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Action Section - 3 Column Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Column 1 - Promos */}
            <div className="space-y-6">
              <PromosCard title="Active Promos" promos={restaurantData.activePromos} />
              <PromosCard
                title="Suggested Promos"
                promos={restaurantData.suggestedPromos}
                showActivateButton
              />
            </div>

            {/* Column 2 - Tasks */}
            <TasksCard tasks={restaurantData.tasks} />

            {/* Column 3 - Notes */}
            <NotesCard restaurantId={restaurant.res_id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;

import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/kam-hub")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to KAM Hub
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Restaurant Detail</h1>
          <p className="text-muted-foreground text-lg">
            Restaurant ID: {id}
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            This page will be built in the next iteration
          </p>
        </div>
      </main>
    </div>
  );
};

export default RestaurantDetail;

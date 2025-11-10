import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const KAMAnalytics = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/kam-hub")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to KAM Hub
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">KAM Analytics</h1>
          <p className="text-muted-foreground text-lg">Performance analytics and insights</p>
          <p className="text-sm text-muted-foreground mt-4">
            This page will be built in a future iteration
          </p>
        </div>
      </main>
    </div>
  );
};

export default KAMAnalytics;

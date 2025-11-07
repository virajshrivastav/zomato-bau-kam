import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainDashboard from "./pages/MainDashboard";
import KAMHub from "./pages/KAMHub";
import RestaurantDetail from "./pages/RestaurantDetail";
import KAMAnalytics from "./pages/KAMAnalytics";
import ZonalHeadView from "./pages/ZonalHeadView";
import LiveSprints from "./pages/LiveSprints";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainDashboard />} />
          <Route path="/kam-hub" element={<KAMHub />} />
          <Route path="/restaurant/:id" element={<RestaurantDetail />} />
          <Route path="/kam-analytics" element={<KAMAnalytics />} />
          <Route path="/zonal-head-view" element={<ZonalHeadView />} />
          <Route path="/live-sprints" element={<LiveSprints />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;


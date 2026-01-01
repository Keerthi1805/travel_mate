import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { TripProvider } from "@/contexts/TripContext";
import { MainLayout } from "@/layouts/MainLayout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Hotels from "./pages/Hotels";
import Transport from "./pages/Transport";
import History from "./pages/History";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TripProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route element={<MainLayout />}>
                <Route path="/" element={<Index />} />
                <Route path="/history" element={<History />} />
                <Route path="/hotels" element={<Hotels />} />
                <Route path="/transport" element={<Transport />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </TripProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;

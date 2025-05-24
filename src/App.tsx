
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Overview from "./pages/Overview";
import Demographics from "./pages/Demographics";
import SurveyAnalysis from "./pages/SurveyAnalysis";
import ComparativeAnalysis from "./pages/ComparativeAnalysis";
import ClusteringAnalysis from "./pages/ClusteringAnalysis";
import TechnologyAnalysis from "./pages/TechnologyAnalysis";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";
import CorrelationalAnalysis from "./pages/CorrelationalAnalysis";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/demographics" element={<Demographics />} />
          <Route path="/survey" element={<SurveyAnalysis />} />
          <Route path="/comparative" element={<ComparativeAnalysis />} />
          <Route path="/clustering" element={<ClusteringAnalysis />} />
          <Route path="/correlational" element={<CorrelationalAnalysis />} />
          <Route path="/technology" element={<TechnologyAnalysis />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

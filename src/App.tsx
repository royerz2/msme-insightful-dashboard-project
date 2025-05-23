
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Overview from "./pages/Overview";
import Demographics from "./pages/Demographics";
import SurveyAnalysis from "./pages/SurveyAnalysis";
import NotFound from "./pages/NotFound";

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
          {/* Placeholder routes for future development */}
          <Route path="/comparative" element={<Overview />} />
          <Route path="/clustering" element={<Overview />} />
          <Route path="/technology" element={<Overview />} />
          <Route path="/partnership" element={<Overview />} />
          <Route path="/reports" element={<Overview />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

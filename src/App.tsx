
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import MainLayout from "@/components/Layout/MainLayout";
import Dashboard from "@/pages/Dashboard";
import ImageAnalysis from "@/pages/ImageAnalysis";
import ChatAssistant from "@/pages/ChatAssistant";
import TreatmentPlanner from "@/pages/TreatmentPlanner";
import MedicationAnalyzer from "@/pages/MedicationAnalyzer";
import VideoResources from "@/pages/VideoResources";
import HealthReports from "@/pages/HealthReports";
import NotFound from "@/pages/NotFound";

// Initialize the query client
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={
              <MainLayout>
                <Dashboard />
              </MainLayout>
            } />
            <Route path="/image-analysis" element={
              <MainLayout>
                <ImageAnalysis />
              </MainLayout>
            } />
            <Route path="/chat-assistant" element={
              <MainLayout>
                <ChatAssistant />
              </MainLayout>
            } />
            <Route path="/treatment-planner" element={
              <MainLayout>
                <TreatmentPlanner />
              </MainLayout>
            } />
            <Route path="/medication-analyzer" element={
              <MainLayout>
                <MedicationAnalyzer />
              </MainLayout>
            } />
            <Route path="/video-resources" element={
              <MainLayout>
                <VideoResources />
              </MainLayout>
            } />
            <Route path="/reports" element={
              <MainLayout>
                <HealthReports />
              </MainLayout>
            } />
            <Route path="/settings" element={
              <MainLayout>
                <div className="p-6">
                  <h1 className="text-3xl font-bold mb-4">Settings</h1>
                  <p>This feature is coming soon. Check back later for updates!</p>
                </div>
              </MainLayout>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;

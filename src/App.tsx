
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
import UserProfile from "@/pages/UserProfile";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import Index from "@/pages/Index";

// Initialize the query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <div className="bg-background min-h-screen bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)]">
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={
                <MainLayout>
                  <Index />
                </MainLayout>
              } />
              <Route path="/dashboard" element={
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
              <Route path="/profile" element={
                <MainLayout>
                  <UserProfile />
                </MainLayout>
              } />
              <Route path="/settings" element={
                <MainLayout>
                  <Settings />
                </MainLayout>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;

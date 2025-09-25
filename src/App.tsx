import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AccessibilityProvider } from "@/components/accessibility/AccessibilityProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import ErrorBoundary from "@/components/ui/error-boundary";
import OfflineIndicator from "@/components/performance/OfflineIndicator";
import { automationManager } from "@/services/automationManager";
import Index from "./pages/Index";
import Library from "./pages/Library";
import Favorites from "./pages/Favorites";
import Customize from "./pages/Customize";
import Settings from "./pages/Settings";
import Welcome from "./pages/Welcome";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ResetPassword from "./pages/ResetPassword";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 3,
    },
  },
});

function App() {
  // Initialize automation services after React is ready
  useEffect(() => {
    automationManager.initialize().catch(console.error);
  }, []);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <AccessibilityProvider>
              <TooltipProvider delayDuration={300}>
                <div className="min-h-screen bg-background">
                  <main id="main-content">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/library" element={<Library />} />
                      <Route path="/favorites" element={<Favorites />} />
                      <Route path="/customize" element={<Customize />} />
                      <Route path="/settings" element={<Settings />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/reset-password" element={<ResetPassword />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                </div>
                <Toaster />
                <OfflineIndicator />
              </TooltipProvider>
            </AccessibilityProvider>
          </AuthProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;

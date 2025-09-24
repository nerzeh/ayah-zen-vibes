import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AccessibilityProvider } from "@/components/accessibility/AccessibilityProvider";
import ErrorBoundary from "@/components/ui/error-boundary";
import Index from "./pages/Index";
import Library from "./pages/Library";
import Favorites from "./pages/Favorites";
import Customize from "./pages/Customize";
import Settings from "./pages/Settings";
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
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
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
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
              <Toaster />
            </TooltipProvider>
          </AccessibilityProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;

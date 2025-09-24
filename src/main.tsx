import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { automationManager } from "@/services/automationManager";
import OfflineIndicator from "@/components/performance/OfflineIndicator";

// Initialize automation services
automationManager.initialize().catch(console.error);

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <App />
    <OfflineIndicator />
  </React.StrictMode>
);

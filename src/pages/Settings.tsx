import { useState } from "react";
import { Settings as SettingsIcon, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import PremiumSettings from "@/components/settings/PremiumSettings";
import { useLanguage } from "@/contexts/LanguageContext";
import { Navigate, Link } from "react-router-dom";
import AccountSettings from "@/components/settings/AccountSettings";
import DailyVerseSettings from "@/components/settings/DailyVerseSettings";
import AppearanceSettings from "@/components/settings/AppearanceSettings";
import LanguageSettings from "@/components/settings/LanguageSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import DataPrivacySettings from "@/components/settings/DataPrivacySettings";
import WidgetConfiguration from "@/components/widget/WidgetConfiguration";
import BottomNavigation from "@/components/navigation/BottomNavigation";

const Settings = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/welcome" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-6 pb-24 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center mb-8">
        <Link to="/" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        
        <div className="flex items-center">
          <SettingsIcon className="h-8 w-8 text-primary mr-3" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t('settings.title')}</h1>
            <p className="text-muted-foreground">{t('settings.subtitle')}</p>
          </div>
        </div>
      </div>

      <div className="space-y-8 max-w-2xl mx-auto">
        {/* Premium Status */}
        <PremiumSettings />

        {/* Account Section */}
        <AccountSettings />

        {/* Daily Verse Settings */}
        <DailyVerseSettings />

        {/* Appearance Settings */}
        <AppearanceSettings />

        {/* Language & Localization */}
        <LanguageSettings />

        {/* Notifications */}
        <NotificationSettings />

        {/* Home Screen Widget */}
        <WidgetConfiguration />

        {/* Data & Privacy */}
        <DataPrivacySettings />
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Settings;
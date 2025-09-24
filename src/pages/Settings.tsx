import { useState } from "react";
import { Settings as SettingsIcon, Bell, Globe, Moon, Sun, Info, Smartphone, LogOut, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useUserSettings } from "@/hooks/useUserSettings";
import { useAuth } from "@/contexts/AuthContext";
import WidgetConfiguration from "@/components/widget/WidgetConfiguration";
import AutomationSettings from "@/components/automation/AutomationSettings";
import AccessibilitySettings from "@/components/accessibility/AccessibilitySettings";
import { Navigate } from "react-router-dom";

const Settings = () => {
  const { user, signOut } = useAuth();
  const { settings, updateSettings, loading } = useUserSettings();
  const { toast } = useToast();

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 pb-24 bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your settings...</p>
        </div>
      </div>
    );
  }

  const handleSettingChange = (setting: string, value: any) => {
    toast({
      title: "Setting updated",
      description: `${setting} has been ${value ? 'enabled' : 'disabled'}`,
    });
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-6 pb-24 bg-background min-h-screen">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-2">
          <SettingsIcon className="h-8 w-8 text-primary mr-2" />
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        </div>
        <p className="text-muted-foreground">Customize your Ayah Wallpaper experience</p>
      </div>

      <div className="space-y-6">
        {/* User Profile Section */}
        <Card className="p-6 bg-gradient-card border-primary/10">
          <div className="flex items-center mb-4">
            <User className="h-6 w-6 text-primary mr-2" />
            <h2 className="text-xl font-semibold text-foreground">Account</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-base font-medium text-foreground">{user.email}</p>
                <p className="text-sm text-muted-foreground">
                  {user.user_metadata?.display_name || 'No display name set'}
                </p>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              onClick={handleSignOut}
              className="w-full border-destructive/20 text-destructive hover:bg-destructive/5"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </Card>

        {/* Daily Automation Section */}
        <AutomationSettings />

        {/* Widget Configuration Section */}
        <WidgetConfiguration />

        {/* Accessibility Section */}
        <AccessibilitySettings />

        {/* Daily Updates Section */}
        <Card className="p-6 bg-gradient-card border-primary/10">
          <div className="flex items-center mb-4">
            <Smartphone className="h-6 w-6 text-primary mr-2" />
            <h2 className="text-xl font-semibold text-foreground">Daily Wallpapers</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="daily-updates" className="text-base font-medium">
                  Daily Verse Updates
                </Label>
                <p className="text-sm text-muted-foreground">
                  Automatically generate new wallpapers daily
                </p>
              </div>
              <Switch
                id="daily-updates"
                checked={settings.dailyUpdates}
                onCheckedChange={(checked) => {
                  updateSettings({ dailyUpdates: checked });
                  handleSettingChange("Daily updates", checked);
                }}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="auto-wallpaper" className="text-base font-medium">
                  Auto Set Wallpaper
                </Label>
                <p className="text-sm text-muted-foreground">
                  Automatically set new wallpaper as device background
                </p>
              </div>
              <Switch
                id="auto-wallpaper"
                defaultChecked={false}
                onCheckedChange={(checked) => {
                  handleSettingChange("Auto wallpaper", checked);
                }}
              />
            </div>
          </div>
        </Card>

        {/* Notifications Section */}
        <Card className="p-6 bg-gradient-card border-primary/10">
          <div className="flex items-center mb-4">
            <Bell className="h-6 w-6 text-primary mr-2" />
            <h2 className="text-xl font-semibold text-foreground">Notifications</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="daily-notifications" className="text-base font-medium">
                  Daily Verse Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications for new daily verses
                </p>
              </div>
              <Switch
                id="daily-notifications"
                checked={settings.dailyNotifications}
                onCheckedChange={(checked) => {
                  updateSettings({ dailyNotifications: checked });
                  handleSettingChange("Daily notifications", checked);
                }}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="prayer-reminders" className="text-base font-medium">
                  Prayer Time Reminders
                </Label>
                <p className="text-sm text-muted-foreground">
                  Get notified for prayer times with verses
                </p>
              </div>
              <Switch
                id="prayer-reminders"
                defaultChecked={false}
                onCheckedChange={(checked) => {
                  handleSettingChange("Prayer reminders", checked);
                }}
              />
            </div>
          </div>
        </Card>

        {/* Appearance Section */}
        <Card className="p-6 bg-gradient-card border-primary/10">
          <div className="flex items-center mb-4">
            {settings.darkMode ? (
              <Moon className="h-6 w-6 text-primary mr-2" />
            ) : (
              <Sun className="h-6 w-6 text-primary mr-2" />
            )}
            <h2 className="text-xl font-semibold text-foreground">Appearance</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="dark-mode" className="text-base font-medium">
                  Dark Mode
                </Label>
                <p className="text-sm text-muted-foreground">
                  Switch between light and dark themes
                </p>
              </div>
              <Switch
                id="dark-mode"
                checked={settings.darkMode}
                onCheckedChange={(checked) => {
                  updateSettings({ darkMode: checked });
                  handleSettingChange("Dark mode", checked);
                }}
              />
            </div>
          </div>
        </Card>

        {/* Language Section */}
        <Card className="p-6 bg-gradient-card border-primary/10">
          <div className="flex items-center mb-4">
            <Globe className="h-6 w-6 text-primary mr-2" />
            <h2 className="text-xl font-semibold text-foreground">Language & Region</h2>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="language" className="text-base font-medium">
                Translation Language
              </Label>
              <Select value={settings.language} onValueChange={(value) => updateSettings({ language: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ar">العربية</SelectItem>
                  <SelectItem value="ur">اردو</SelectItem>
                  <SelectItem value="id">Bahasa Indonesia</SelectItem>
                  <SelectItem value="tr">Türkçe</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Choose your preferred language for verse translations
              </p>
            </div>
          </div>
        </Card>

        {/* About Section */}
        <Card className="p-6 bg-gradient-card border-primary/10">
          <div className="flex items-center mb-4">
            <Info className="h-6 w-6 text-primary mr-2" />
            <h2 className="text-xl font-semibold text-foreground">About</h2>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium text-foreground">Ayah Wallpapers</h3>
              <p className="text-sm text-muted-foreground">Version 1.0.0</p>
              <p className="text-sm text-muted-foreground">
                Create beautiful Islamic wallpapers with Quranic verses. 
                Daily inspiration for your spiritual journey.
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                size="sm"
                className="border-primary/20 hover:bg-primary/5"
              >
                Privacy Policy
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="border-primary/20 hover:bg-primary/5"
              >
                Terms of Service
              </Button>
            </div>
          </div>
        </Card>

        {/* Reset Section */}
        <Card className="p-6 bg-gradient-card border-destructive/10">
          <h2 className="text-xl font-semibold text-foreground mb-4">Reset Settings</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Reset all settings to their default values. This action cannot be undone.
          </p>
          <Button 
            variant="destructive" 
            onClick={() => {
              toast({
                title: "Settings reset",
                description: "All settings have been restored to defaults",
              });
            }}
          >
            Reset All Settings
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
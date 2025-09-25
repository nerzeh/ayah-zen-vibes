import { Clock, Bell, Download, Smartphone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUserSettings } from "@/hooks/useUserSettings";
import { useToast } from "@/hooks/use-toast";

const DailyVerseSettings = () => {
  const { settings, updateSettings, isAuthenticated } = useUserSettings();
  const { toast } = useToast();

  const handleSettingChange = (setting: string, value: any) => {
    toast({
      title: "Setting updated",
      description: `${setting} has been ${value ? 'enabled' : 'updated'}`,
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayTime = formatTime(timeString);
        options.push({ value: timeString, label: displayTime });
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  return (
    <Card className="p-6 bg-gradient-card border-primary/10">
      <div className="flex items-center mb-6">
        <Smartphone className="h-6 w-6 text-primary mr-2" />
        <h2 className="text-xl font-semibold text-foreground">Daily Verse Settings</h2>
      </div>
      
      <div className="space-y-6">
        {!isAuthenticated && (
          <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded border">
            Sign in to save your daily verse preferences and sync across devices.
          </div>
        )}
        
        {/* Enable Daily Verse */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="daily-verse-enabled" className="text-base font-medium">
              Daily Verse Updates
            </Label>
            <p className="text-sm text-muted-foreground">
              Automatically get a new verse each day
            </p>
          </div>
          <Switch
            id="daily-verse-enabled"
            checked={settings.dailyUpdates}
            onCheckedChange={(checked) => {
              updateSettings({ dailyUpdates: checked });
              handleSettingChange("Daily verse updates", checked);
            }}
          />
        </div>

        {settings.dailyUpdates && (
          <>
            {/* Daily Verse Time */}
            <div className="space-y-2">
              <Label className="text-base font-medium flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Daily Update Time
              </Label>
              <Select
                value={settings.updateTime}
                onValueChange={(value) => {
                  updateSettings({ updateTime: value });
                  handleSettingChange("Update time", value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent className="max-h-48">
                  {timeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Choose when to receive your daily verse
              </p>
            </div>

            {/* Auto Wallpaper */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="auto-wallpaper" className="text-base font-medium">
                  Auto-Download Wallpaper
                </Label>
                <p className="text-sm text-muted-foreground">
                  Automatically download new wallpapers for easy setting
                </p>
              </div>
              <Switch
                id="auto-wallpaper"
                checked={settings.autoWallpaper}
                onCheckedChange={(checked) => {
                  updateSettings({ autoWallpaper: checked });
                  handleSettingChange("Auto wallpaper download", checked);
                }}
              />
            </div>

            {/* Daily Notifications */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="daily-notifications" className="text-base font-medium flex items-center">
                  <Bell className="h-4 w-4 mr-2" />
                  Daily Verse Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when your daily verse is ready
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

            {/* Update Frequency */}
            <div className="space-y-2">
              <Label className="text-base font-medium">
                Update Frequency
              </Label>
              <Select
                value={settings.frequency}
                onValueChange={(value: 'daily' | 'weekly' | 'manual') => {
                  updateSettings({ frequency: value });
                  handleSettingChange("Update frequency", value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="manual">Manual Only</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                How often to automatically update your verses
              </p>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default DailyVerseSettings;
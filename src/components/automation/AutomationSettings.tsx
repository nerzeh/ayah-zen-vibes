import { Clock, Download, Bell, Play, AlertCircle, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useDailyAutomation, AutomationSettings as Settings } from "@/hooks/useDailyAutomation";
import { useUserSettings } from "@/hooks/useUserSettings";
import { useToast } from "@/hooks/use-toast";

const AutomationSettings = () => {
  const { state, manualUpdate, requestPermissions } = useDailyAutomation();
  const { settings, updateSettings, isAuthenticated } = useUserSettings();
  const { toast } = useToast();

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

  const handleSettingChange = (key: string, value: any) => {
    // Map the automation settings to user settings
    const settingsMap: Record<string, any> = {
      'enabled': { automationEnabled: value },
      'updateTime': { updateTime: value },
      'frequency': { frequency: value },
      'autoWallpaper': { autoWallpaper: value },
      'notifications': { automationNotifications: value },
    };

    if (settingsMap[key]) {
      updateSettings(settingsMap[key]);
    }
    
    toast({
      title: "Setting updated",
      description: `Daily automation ${key} has been ${value ? 'enabled' : 'updated'}`,
    });
  };

  const handleManualUpdate = async () => {
    toast({
      title: "Processing update",
      description: "Generating your daily verse and wallpaper...",
    });
    
    await manualUpdate();
  };

  const timeOptions = generateTimeOptions();

  return (
    <Card className="p-6 bg-gradient-card border-primary/10">
      <div className="flex items-center mb-4">
        <Clock className="h-6 w-6 text-primary mr-2" />
        <h2 className="text-xl font-semibold text-foreground">Daily Automation</h2>
        {settings.automationEnabled && (
          <Badge variant="secondary" className="ml-auto">
            Active
          </Badge>
        )}
      </div>
      
      <div className="space-y-6">
        {!isAuthenticated && (
          <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded border">
            Sign in to save your automation settings and sync across devices.
          </div>
        )}
        
        {/* Enable Automation */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="automation-enabled" className="text-base font-medium">
              Enable Daily Automation
            </Label>
            <p className="text-sm text-muted-foreground">
              Automatically update verse and wallpaper daily
            </p>
          </div>
          <Switch
            id="automation-enabled"
            checked={settings.automationEnabled}
            onCheckedChange={(checked) => handleSettingChange('enabled', checked)}
          />
        </div>

        {settings.automationEnabled && (
          <>
            {/* Update Time */}
            <div className="space-y-2">
              <Label htmlFor="update-time" className="text-base font-medium">
                Daily Update Time
              </Label>
              <Select
                value={settings.updateTime}
                onValueChange={(value) => handleSettingChange('updateTime', value)}
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
                Choose when to update your daily verse
              </p>
            </div>

            {/* Update Frequency */}
            <div className="space-y-2">
              <Label htmlFor="frequency" className="text-base font-medium">
                Update Frequency
              </Label>
              <Select
                value={settings.frequency}
                onValueChange={(value: 'daily' | 'weekly' | 'manual') => 
                  handleSettingChange('frequency', value)
                }
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
                How often to automatically update
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
                onCheckedChange={(checked) => handleSettingChange('autoWallpaper', checked)}
              />
            </div>

            {/* Notifications */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="automation-notifications" className="text-base font-medium">
                  Daily Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when your daily verse is ready
                </p>
              </div>
              <Switch
                id="automation-notifications"
                checked={settings.automationNotifications}
                onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
              />
            </div>
          </>
        )}

        {/* Status Information */}
        {settings.automationEnabled && (
          <div className="pt-4 border-t border-border/50">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Status:</span>
                <div className="flex items-center gap-2">
                  {state.isProcessing ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                      <span className="text-primary">Processing...</span>
                    </>
                  ) : state.error ? (
                    <>
                      <AlertCircle className="h-4 w-4 text-destructive" />
                      <span className="text-destructive">Error</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-success">Ready</span>
                    </>
                  )}
                </div>
              </div>

              {state.lastUpdate && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last Update:</span>
                  <span className="text-foreground">
                    {new Date(state.lastUpdate).toLocaleDateString()}
                  </span>
                </div>
              )}

              {state.nextScheduled && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Next Update:</span>
                  <span className="text-foreground">
                    {new Date(state.nextScheduled).toLocaleString()}
                  </span>
                </div>
              )}

              {state.error && (
                <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
                  {state.error}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-border/50">
          <Button 
            onClick={handleManualUpdate}
            disabled={state.isProcessing}
            className="flex-1"
            variant="outline"
          >
            <Play className="h-4 w-4 mr-2" />
            Update Now
          </Button>
          
          {(settings.automationNotifications || settings.autoWallpaper) && (
            <Button 
              onClick={requestPermissions}
              variant="outline"
              size="sm"
            >
              <Bell className="h-4 w-4 mr-2" />
              Permissions
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default AutomationSettings;
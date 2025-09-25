import { Bell, Smartphone, Star, Volume2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUserSettings } from "@/hooks/useUserSettings";
import { useToast } from "@/hooks/use-toast";

const NotificationSettings = () => {
  const { settings, updateSettings, isAuthenticated } = useUserSettings();
  const { toast } = useToast();

  const handleSettingChange = (setting: string, value: any) => {
    toast({
      title: "Notification updated",
      description: `${setting} has been ${value ? 'enabled' : 'updated'}`,
    });
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        toast({
          title: "Notifications enabled",
          description: "You'll now receive notifications for daily verses and updates.",
        });
      } else {
        toast({
          title: "Notifications blocked",
          description: "Please enable notifications in your browser settings to receive updates.",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Not supported",
        description: "Your browser doesn't support notifications.",
        variant: "destructive"
      });
    }
  };

  const notificationTimes = [
    { value: '06:00', label: '6:00 AM - Fajr' },
    { value: '07:00', label: '7:00 AM - Morning' },
    { value: '12:00', label: '12:00 PM - Dhuhr' },
    { value: '15:00', label: '3:00 PM - Asr' },
    { value: '18:00', label: '6:00 PM - Maghrib' },
    { value: '20:00', label: '8:00 PM - Isha' },
    { value: '21:00', label: '9:00 PM - Evening' },
  ];

  const notificationPermission = 'Notification' in window ? Notification.permission : 'denied';

  return (
    <Card className="p-6 bg-gradient-card border-primary/10">
      <div className="flex items-center mb-6">
        <Bell className="h-6 w-6 text-primary mr-2" />
        <h2 className="text-xl font-semibold text-foreground">Notifications</h2>
      </div>
      
      <div className="space-y-6">
        {!isAuthenticated && (
          <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded border">
            Sign in to save your notification preferences across devices.
          </div>
        )}

        {/* Notification Permission Status */}
        {notificationPermission !== 'granted' && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                <div>
                  <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Enable Push Notifications
                  </h3>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300">
                    Allow notifications to receive daily verse reminders
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={requestNotificationPermission}
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                Enable
              </Button>
            </div>
          </div>
        )}

        {/* Daily Verse Reminders */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="daily-reminders" className="text-base font-medium">
                Daily Verse Reminders
              </Label>
              <p className="text-sm text-muted-foreground">
                Get notified when new verses are available
              </p>
            </div>
            <Switch
              id="daily-reminders"
              checked={settings.dailyNotifications}
              onCheckedChange={(checked) => {
                updateSettings({ dailyNotifications: checked });
                handleSettingChange("Daily verse reminders", checked);
              }}
            />
          </div>

          {settings.dailyNotifications && (
            <div className="ml-6 space-y-3">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Reminder Time</Label>
                <Select defaultValue="07:00">
                  <SelectTrigger>
                    <SelectValue placeholder="Select notification time" />
                  </SelectTrigger>
                  <SelectContent>
                    {notificationTimes.map((time) => (
                      <SelectItem key={time.value} value={time.value}>
                        {time.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        {/* Prayer Time Reminders */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="prayer-reminders" className="text-base font-medium">
              Prayer Time Reminders
            </Label>
            <p className="text-sm text-muted-foreground">
              Get notifications for prayer times with verses
            </p>
          </div>
          <Switch
            id="prayer-reminders"
            checked={settings.prayerReminders}
            onCheckedChange={(checked) => {
              updateSettings({ prayerReminders: checked });
              handleSettingChange("Prayer time reminders", checked);
            }}
          />
        </div>

        {/* New Features Notifications */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="feature-updates" className="text-base font-medium flex items-center">
              <Star className="h-4 w-4 mr-2" />
              New Features & Updates
            </Label>
            <p className="text-sm text-muted-foreground">
              Be notified about new app features and improvements
            </p>
          </div>
          <Switch
            id="feature-updates"
            defaultChecked={true}
            onCheckedChange={(checked) => {
              handleSettingChange("Feature updates", checked);
            }}
          />
        </div>

        {/* Sound & Vibration */}
        <div className="space-y-4 pt-4 border-t border-border/50">
          <Label className="text-base font-medium flex items-center">
            <Volume2 className="h-4 w-4 mr-2" />
            Sound & Vibration
          </Label>
          
          <div className="space-y-4 ml-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="notification-sound" className="text-sm font-medium">
                  Notification Sound
                </Label>
                <p className="text-xs text-muted-foreground">
                  Play sound for notifications
                </p>
              </div>
              <Switch
                id="notification-sound"
                defaultChecked={true}
                onCheckedChange={(checked) => {
                  handleSettingChange("Notification sound", checked);
                }}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="vibration" className="text-sm font-medium flex items-center">
                  <Smartphone className="h-4 w-4 mr-2" />
                  Vibration
                </Label>
                <p className="text-xs text-muted-foreground">
                  Vibrate on mobile devices
                </p>
              </div>
              <Switch
                id="vibration"
                defaultChecked={true}
                onCheckedChange={(checked) => {
                  handleSettingChange("Vibration", checked);
                }}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Notification Sound</Label>
              <Select defaultValue="default">
                <SelectTrigger>
                  <SelectValue placeholder="Select notification sound" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="adhan">Adhan Call</SelectItem>
                  <SelectItem value="chime">Gentle Chime</SelectItem>
                  <SelectItem value="bell">Bell</SelectItem>
                  <SelectItem value="silent">Silent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Quiet Hours */}
        <div className="space-y-3 pt-4 border-t border-border/50">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="quiet-hours" className="text-base font-medium">
                Quiet Hours
              </Label>
              <p className="text-sm text-muted-foreground">
                Disable notifications during specified hours
              </p>
            </div>
            <Switch
              id="quiet-hours"
              onCheckedChange={(checked) => {
                handleSettingChange("Quiet hours", checked);
              }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default NotificationSettings;
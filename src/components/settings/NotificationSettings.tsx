import { Bell, Smartphone, Star, Volume2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUserSettings } from "@/hooks/useUserSettings";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

const NotificationSettings = () => {
  const { settings, updateSettings, isAuthenticated } = useUserSettings();
  const { toast } = useToast();
  const { t } = useLanguage();
  const handleSettingChange = (settingKey: string, value: any) => {
    toast({
      title: t('notifications.updated'),
      description: t(value ? 'notifications.settingEnabled' : 'notifications.settingUpdated'),
    });
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        toast({
          title: t('notifications.permissionGranted'),
          description: t('notifications.permissionGrantedDesc'),
        });
      } else {
        toast({
          title: t('notifications.permissionBlocked'),
          description: t('notifications.permissionBlockedDesc'),
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: t('notifications.notSupported'),
        description: t('notifications.notSupportedDesc'),
        variant: "destructive"
      });
    }
  };

  const notificationTimes = [
    { value: '06:00', label: t('notifications.time6amFajr') },
    { value: '07:00', label: t('notifications.time7amMorning') },
    { value: '12:00', label: t('notifications.time12pmDhuhr') },
    { value: '15:00', label: t('notifications.time3pmAsr') },
    { value: '18:00', label: t('notifications.time6pmMaghrib') },
    { value: '20:00', label: t('notifications.time8pmIsha') },
    { value: '21:00', label: t('notifications.time9pmEvening') },
  ];

  const notificationPermission = 'Notification' in window ? Notification.permission : 'denied';

  return (
    <Card className="p-6 bg-gradient-card border-primary/10">
      <div className="flex items-center mb-6">
        <Bell className="h-6 w-6 text-primary mr-2" />
        <h2 className="text-xl font-semibold text-foreground">{t('settings.notifications')}</h2>
      </div>
      
      <div className="space-y-6">
        {!isAuthenticated && (
          <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded border">
            {t('notifications.signInNote')}
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
                    {t('notifications.enablePush')}
                  </h3>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300">
                    {t('notifications.enablePushDesc')}
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={requestNotificationPermission}
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                {t('notifications.enable')}
              </Button>
            </div>
          </div>
        )}

        {/* Daily Verse Reminders */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="daily-reminders" className="text-base font-medium">
                {t('notifications.dailyReminders')}
              </Label>
              <p className="text-sm text-muted-foreground">
                {t('notifications.dailyRemindersDesc')}
              </p>
            </div>
            <Switch
              id="daily-reminders"
              checked={settings.dailyNotifications}
              onCheckedChange={(checked) => {
                updateSettings({ dailyNotifications: checked });
                handleSettingChange("notifications.dailyReminders", checked);
              }}
            />
          </div>

          {settings.dailyNotifications && (
            <div className="ml-6 space-y-3">
              <div className="space-y-2">
                <Label className="text-sm font-medium">{t('notifications.reminderTime')}</Label>
                <Select defaultValue="07:00">
                  <SelectTrigger>
                    <SelectValue placeholder={t('notifications.selectTime')} />
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
              {t('notifications.prayerReminders')}
            </Label>
            <p className="text-sm text-muted-foreground">
              {t('notifications.prayerRemindersDesc')}
            </p>
          </div>
          <Switch
            id="prayer-reminders"
            checked={settings.prayerReminders}
            onCheckedChange={(checked) => {
              updateSettings({ prayerReminders: checked });
              handleSettingChange("notifications.prayerReminders", checked);
            }}
          />
        </div>

        {/* New Features Notifications */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="feature-updates" className="text-base font-medium flex items-center">
              <Star className="h-4 w-4 mr-2" />
              {t('notifications.features')}
            </Label>
            <p className="text-sm text-muted-foreground">
              {t('notifications.featuresDesc')}
            </p>
          </div>
          <Switch
            id="feature-updates"
            defaultChecked={true}
            onCheckedChange={(checked) => {
              handleSettingChange("notifications.features", checked);
            }}
          />
        </div>

        {/* Sound & Vibration */}
        <div className="space-y-4 pt-4 border-t border-border/50">
          <Label className="text-base font-medium flex items-center">
            <Volume2 className="h-4 w-4 mr-2" />
            {t('notifications.sound')}
          </Label>
          
          <div className="space-y-4 ml-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="notification-sound" className="text-sm font-medium">
                  {t('notifications.soundEnabled')}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {t('notifications.soundEnabledDesc')}
                </p>
              </div>
              <Switch
                id="notification-sound"
                defaultChecked={true}
                onCheckedChange={(checked) => {
                  handleSettingChange("notifications.soundEnabled", checked);
                }}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="vibration" className="text-sm font-medium flex items-center">
                  <Smartphone className="h-4 w-4 mr-2" />
                  {t('notifications.vibration')}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {t('notifications.vibrationDesc')}
                </p>
              </div>
              <Switch
                id="vibration"
                defaultChecked={true}
                onCheckedChange={(checked) => {
                  handleSettingChange("notifications.vibration", checked);
                }}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">{t('notifications.soundSelect')}</Label>
              <Select defaultValue="default">
                <SelectTrigger>
                  <SelectValue placeholder={t('notifications.selectSound')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">{t('notifications.soundDefault')}</SelectItem>
                  <SelectItem value="adhan">{t('notifications.soundAdhan')}</SelectItem>
                  <SelectItem value="chime">{t('notifications.soundChime')}</SelectItem>
                  <SelectItem value="bell">{t('notifications.soundBell')}</SelectItem>
                  <SelectItem value="silent">{t('notifications.soundSilent')}</SelectItem>
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
                {t('notifications.quietHours')}
              </Label>
              <p className="text-sm text-muted-foreground">
                {t('notifications.quietHoursDesc')}
              </p>
            </div>
            <Switch
              id="quiet-hours"
              onCheckedChange={(checked) => {
                handleSettingChange("notifications.quietHours", checked);
              }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default NotificationSettings;
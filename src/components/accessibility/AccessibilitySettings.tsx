import { Eye, Type, Contrast, Zap, Volume2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAccessibility } from "./AccessibilityProvider";
import { useUserSettings } from "@/hooks/useUserSettings";
import { useToast } from "@/hooks/use-toast";

const AccessibilitySettings = () => {
  const { announceToScreenReader } = useAccessibility();
  const { settings, updateSettings, isAuthenticated } = useUserSettings();
  const { toast } = useToast();

  const handleSettingChange = (key: string, value: any) => {
    const settingsMap: Record<string, any> = {
      'fontSize': { fontSize: value },
      'highContrast': { highContrast: value },
      'reducedMotion': { reducedMotion: value },
      'screenReaderMode': { screenReaderMode: value },
    };

    if (settingsMap[key]) {
      updateSettings(settingsMap[key]);
    }
    announceToScreenReader(`${key} ${value ? 'enabled' : 'updated'}`);
    
    toast({
      title: "Accessibility updated", 
      description: `${key} has been ${value ? 'enabled' : 'updated'}`,
    });
  };

  return (
    <Card className="p-6 bg-gradient-card border-primary/10">
      <div className="flex items-center mb-4">
        <Eye className="h-6 w-6 text-primary mr-2" />
        <h2 className="text-xl font-semibold text-foreground">Accessibility</h2>
      </div>
      
      <div className="space-y-6">
        {/* Font Size */}
        <div className="space-y-2">
          <Label htmlFor="font-size" className="text-base font-medium">
            Text Size
          </Label>
          <Select
            value={settings.fontSize}
            onValueChange={(value: 'small' | 'medium' | 'large' | 'extra-large') => 
              handleSettingChange('fontSize', value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select text size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium (Default)</SelectItem>
              <SelectItem value="large">Large</SelectItem>
              <SelectItem value="extra-large">Extra Large</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            Adjust text size for better readability
          </p>
        </div>

        {/* High Contrast */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="high-contrast" className="text-base font-medium">
              High Contrast Mode
            </Label>
            <p className="text-sm text-muted-foreground">
              Increase contrast for better visibility
            </p>
          </div>
          <Switch
            id="high-contrast"
            checked={settings.highContrast}
            onCheckedChange={(checked) => handleSettingChange('highContrast', checked)}
            aria-describedby="high-contrast-description"
          />
        </div>

        {/* Reduced Motion */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="reduced-motion" className="text-base font-medium">
              Reduce Motion
            </Label>
            <p className="text-sm text-muted-foreground">
              Minimize animations and transitions
            </p>
          </div>
          <Switch
            id="reduced-motion"
            checked={settings.reducedMotion}
            onCheckedChange={(checked) => handleSettingChange('reducedMotion', checked)}
            aria-describedby="reduced-motion-description"
          />
        </div>

        {/* Screen Reader Mode */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="screen-reader" className="text-base font-medium">
              Screen Reader Optimizations
            </Label>
            <p className="text-sm text-muted-foreground">
              Enhanced support for screen readers
            </p>
          </div>
          <Switch
            id="screen-reader"
            checked={settings.screenReaderMode}
            onCheckedChange={(checked) => handleSettingChange('screenReaderMode', checked)}
            aria-describedby="screen-reader-description"
          />
        </div>

        {/* Accessibility Tips */}
        <div className="pt-4 border-t border-border/50">
          <h3 className="font-medium text-foreground mb-3 flex items-center">
            <Volume2 className="h-4 w-4 mr-2" />
            Accessibility Tips
          </h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Use keyboard navigation with Tab and Enter keys</p>
            <p>• Enable VoiceOver (iOS) or TalkBack (Android) for audio descriptions</p>
            <p>• Tap and hold elements for additional options</p>
            <p>• Use device-level accessibility settings for system-wide changes</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AccessibilitySettings;
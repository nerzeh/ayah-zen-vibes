import { Palette, Sun, Moon, Type, Contrast } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useUserSettings } from "@/hooks/useUserSettings";
import { useToast } from "@/hooks/use-toast";

const AppearanceSettings = () => {
  const { settings, updateSettings, isAuthenticated } = useUserSettings();
  const { toast } = useToast();

  const handleSettingChange = (setting: string, value: any) => {
    toast({
      title: "Appearance updated",
      description: `${setting} has been ${value ? 'enabled' : 'updated'}`,
    });
  };

  const backgroundStyles = [
    { value: 'gradient', label: 'Gradient' },
    { value: 'geometric', label: 'Islamic Geometric' },
    { value: 'nature', label: 'Nature Inspired' },
    { value: 'solid', label: 'Solid Color' },
  ];

  const colorSchemes = [
    { value: 'emerald', label: 'Emerald & Gold', preview: 'bg-gradient-to-r from-emerald-900 to-amber-500' },
    { value: 'teal', label: 'Teal & Ocean', preview: 'bg-gradient-to-r from-teal-900 to-teal-500' },
    { value: 'gold', label: 'Gold & Amber', preview: 'bg-gradient-to-r from-amber-800 to-amber-400' },
    { value: 'navy', label: 'Navy & Silver', preview: 'bg-gradient-to-r from-blue-900 to-blue-600' },
  ];

  return (
    <Card className="p-6 bg-gradient-card border-primary/10">
      <div className="flex items-center mb-6">
        <Palette className="h-6 w-6 text-primary mr-2" />
        <h2 className="text-xl font-semibold text-foreground">Appearance</h2>
      </div>
      
      <div className="space-y-6">
        {!isAuthenticated && (
          <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded border">
            Sign in to save your appearance preferences across devices.
          </div>
        )}

        {/* Theme Selection */}
        <div className="space-y-4">
          <Label className="text-base font-medium flex items-center">
            {settings.darkMode ? (
              <Moon className="h-4 w-4 mr-2" />
            ) : (
              <Sun className="h-4 w-4 mr-2" />
            )}
            Theme Selection
          </Label>
          
          <div className="grid grid-cols-3 gap-3">
            <Button
              variant={!settings.darkMode ? "default" : "outline"}
              className="flex flex-col items-center p-4 h-auto"
              onClick={() => {
                updateSettings({ darkMode: false });
                handleSettingChange("Theme", "Light");
              }}
            >
              <Sun className="h-6 w-6 mb-2" />
              <span className="text-sm">Light</span>
            </Button>
            
            <Button
              variant={settings.darkMode ? "default" : "outline"}
              className="flex flex-col items-center p-4 h-auto"
              onClick={() => {
                updateSettings({ darkMode: true });
                handleSettingChange("Theme", "Dark");
              }}
            >
              <Moon className="h-6 w-6 mb-2" />
              <span className="text-sm">Dark</span>
            </Button>
            
            <Button
              variant="outline"
              className="flex flex-col items-center p-4 h-auto"
              onClick={() => toast({ title: "Coming Soon", description: "Auto theme will be available in a future update!" })}
            >
              <div className="h-6 w-6 mb-2 rounded-full bg-gradient-to-r from-yellow-400 to-blue-900"></div>
              <span className="text-sm">Auto</span>
            </Button>
          </div>
        </div>

        {/* Font Size */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center">
            <Type className="h-4 w-4 mr-2" />
            Font Size
          </Label>
          
          <div className="space-y-2">
            <Select
              value={settings.fontSize}
              onValueChange={(value: 'small' | 'medium' | 'large' | 'extra-large') => {
                updateSettings({ fontSize: value });
                handleSettingChange("Font size", value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select font size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium (Default)</SelectItem>
                <SelectItem value="large">Large</SelectItem>
                <SelectItem value="extra-large">Extra Large</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="text-sm space-y-1">
              <p className={`${settings.fontSize === 'small' ? 'text-sm' : settings.fontSize === 'large' ? 'text-lg' : settings.fontSize === 'extra-large' ? 'text-xl' : 'text-base'} text-muted-foreground`}>
                Preview: Sample text in {settings.fontSize} size
              </p>
            </div>
          </div>
        </div>

        {/* Background Style Preferences */}
        <div className="space-y-3">
          <Label className="text-base font-medium">
            Default Background Style
          </Label>
          
          <Select
            defaultValue="gradient"
            onValueChange={(value) => {
              handleSettingChange("Background style", value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select background style" />
            </SelectTrigger>
            <SelectContent>
              {backgroundStyles.map((style) => (
                <SelectItem key={style.value} value={style.value}>
                  {style.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Color Scheme */}
        <div className="space-y-3">
          <Label className="text-base font-medium">
            Default Color Scheme
          </Label>
          
          <div className="grid grid-cols-2 gap-3">
            {colorSchemes.map((scheme) => (
              <Button
                key={scheme.value}
                variant="outline"
                className="flex items-center justify-start p-3 h-auto"
                onClick={() => handleSettingChange("Color scheme", scheme.label)}
              >
                <div className={`w-6 h-6 rounded-full ${scheme.preview} mr-3 border`} />
                <span className="text-sm">{scheme.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Accessibility Options */}
        <div className="space-y-4 pt-4 border-t border-border/50">
          <Label className="text-base font-medium flex items-center">
            <Contrast className="h-4 w-4 mr-2" />
            Accessibility
          </Label>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="high-contrast" className="text-sm font-medium">
                  High Contrast Mode
                </Label>
                <p className="text-xs text-muted-foreground">
                  Increase contrast for better visibility
                </p>
              </div>
              <Switch
                id="high-contrast"
                checked={settings.highContrast}
                onCheckedChange={(checked) => {
                  updateSettings({ highContrast: checked });
                  handleSettingChange("High contrast", checked);
                }}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="reduced-motion" className="text-sm font-medium">
                  Reduce Motion
                </Label>
                <p className="text-xs text-muted-foreground">
                  Minimize animations and transitions
                </p>
              </div>
              <Switch
                id="reduced-motion"
                checked={settings.reducedMotion}
                onCheckedChange={(checked) => {
                  updateSettings({ reducedMotion: checked });
                  handleSettingChange("Reduced motion", checked);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AppearanceSettings;
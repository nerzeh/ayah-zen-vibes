import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Smartphone, RefreshCw, Settings, Clock, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WidgetConfig {
  enabled: boolean;
  updateFrequency: 'daily' | 'twice-daily' | 'hourly';
  size: '2x2' | '4x2' | '4x4';
  theme: 'classic' | 'minimal' | 'elegant';
  showArabic: boolean;
  showTranslation: boolean;
}

const WidgetConfiguration = () => {
  const [config, setConfig] = useState<WidgetConfig>({
    enabled: false,
    updateFrequency: 'daily',
    size: '4x2',
    theme: 'classic',
    showArabic: true,
    showTranslation: true
  });
  const { toast } = useToast();

  const updateConfig = (key: keyof WidgetConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const saveConfiguration = async () => {
    // Store widget configuration in localStorage for now
    // In a full implementation, this would sync with native widget providers
    localStorage.setItem('widgetConfig', JSON.stringify(config));
    
    toast({
      title: "Widget configured",
      description: "Your home screen widget settings have been saved",
    });
  };

  const installWidget = async () => {
    // This would trigger native widget installation
    // For now, we'll simulate the process
    toast({
      title: "Widget installation",
      description: "Please add the Ayah Widget from your device's widget gallery",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-card border-primary/10">
        <div className="flex items-center mb-6">
          <Smartphone className="h-6 w-6 text-primary mr-2" />
          <h2 className="text-xl font-semibold text-foreground">Home Screen Widget</h2>
        </div>

        {/* Widget Preview */}
        <div className="mb-6">
          <Label className="text-base font-medium mb-3 block">Widget Preview</Label>
          <div className="flex justify-center">
            <div 
              className={`relative bg-gradient-primary rounded-2xl text-primary-foreground p-4 shadow-elegant ${
                config.size === '2x2' ? 'w-32 h-32' :
                config.size === '4x2' ? 'w-64 h-32' :
                'w-64 h-64'
              }`}
            >
              {/* Islamic Pattern Background */}
              <div className="absolute inset-0 opacity-10 rounded-2xl bg-islamic-pattern"></div>
              
              {/* Content */}
              <div className="relative h-full flex flex-col justify-between">
                <div className="text-xs opacity-80">Today's Verse</div>
                
                <div className="flex-1 flex flex-col justify-center text-center">
                  {config.showArabic && (
                    <p className="font-arabic text-sm mb-2 leading-relaxed">
                      بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                    </p>
                  )}
                  {config.showTranslation && config.size !== '2x2' && (
                    <p className="text-xs opacity-90 leading-tight">
                      "In the name of Allah..."
                    </p>
                  )}
                </div>
                
                <div className="flex justify-between items-end">
                  <div className="text-xs opacity-70">Al-Fatiha 1:1</div>
                  <div className="w-4 h-4 bg-white/20 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Configuration Options */}
        <div className="space-y-6">
          {/* Enable Widget */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="widget-enabled" className="text-base font-medium">
                Enable Widget
              </Label>
              <p className="text-sm text-muted-foreground">
                Show daily verses on your home screen
              </p>
            </div>
            <Switch
              id="widget-enabled"
              checked={config.enabled}
              onCheckedChange={(checked) => updateConfig('enabled', checked)}
            />
          </div>

          {config.enabled && (
            <>
              {/* Widget Size */}
              <div className="space-y-2">
                <Label className="text-base font-medium flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Widget Size
                </Label>
                <Select value={config.size} onValueChange={(value) => updateConfig('size', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select widget size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2x2">Small (2×2) - Arabic only</SelectItem>
                    <SelectItem value="4x2">Medium (4×2) - Arabic + Translation</SelectItem>
                    <SelectItem value="4x4">Large (4×4) - Full verse display</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Update Frequency */}
              <div className="space-y-2">
                <Label className="text-base font-medium flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Update Frequency
                </Label>
                <Select value={config.updateFrequency} onValueChange={(value) => updateConfig('updateFrequency', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select update frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily (Recommended)</SelectItem>
                    <SelectItem value="twice-daily">Twice Daily</SelectItem>
                    <SelectItem value="hourly">Every Hour</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  More frequent updates may impact battery life
                </p>
              </div>

              {/* Widget Theme */}
              <div className="space-y-2">
                <Label className="text-base font-medium flex items-center">
                  <Palette className="h-4 w-4 mr-2" />
                  Widget Theme
                </Label>
                <Select value={config.theme} onValueChange={(value) => updateConfig('theme', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select widget theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="classic">Classic Green & Gold</SelectItem>
                    <SelectItem value="minimal">Minimal Dark</SelectItem>
                    <SelectItem value="elegant">Elegant Teal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Content Options */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Content Display</Label>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="show-arabic" className="text-sm font-medium">
                      Show Arabic Text
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Display original Arabic verse
                    </p>
                  </div>
                  <Switch
                    id="show-arabic"
                    checked={config.showArabic}
                    onCheckedChange={(checked) => updateConfig('showArabic', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="show-translation" className="text-sm font-medium">
                      Show Translation
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Display English translation
                    </p>
                  </div>
                  <Switch
                    id="show-translation"
                    checked={config.showTranslation}
                    onCheckedChange={(checked) => updateConfig('showTranslation', checked)}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-8">
          <Button
            onClick={saveConfiguration}
            className="flex-1 bg-gradient-primary hover:opacity-90 text-primary-foreground"
          >
            <Settings className="mr-2 h-4 w-4" />
            Save Configuration
          </Button>
          
          {config.enabled && (
            <Button
              onClick={installWidget}
              variant="outline"
              className="flex-1 border-primary/20 hover:bg-primary/5"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Install Widget
            </Button>
          )}
        </div>

        {/* Installation Instructions */}
        {config.enabled && (
          <Card className="mt-6 p-4 bg-muted/50 border-primary/10">
            <h3 className="font-medium text-foreground mb-2">Installation Instructions</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><strong>iOS:</strong> Long press on home screen → Add Widget → Search "Ayah Wallpapers"</p>
              <p><strong>Android:</strong> Long press on home screen → Widgets → Find "Daily Verse Widget"</p>
              <p className="text-xs mt-3 text-primary">
                💡 Tip: Place the widget where you'll see it first thing in the morning for daily inspiration
              </p>
            </div>
          </Card>
        )}
      </Card>
    </div>
  );
};

export default WidgetConfiguration;
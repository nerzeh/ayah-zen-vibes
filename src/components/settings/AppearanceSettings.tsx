import { Palette, Type } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEnhancedUserSettings } from "@/hooks/useEnhancedUserSettings";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

const AppearanceSettings = () => {
  const { settings, updateSettings, isAuthenticated } = useEnhancedUserSettings();
  const { toast } = useToast();
  const { t } = useLanguage();
  const handleSettingChange = (setting: string, value: any) => {
    toast({
      title: "Appearance updated",
      description: `${setting} has been ${value ? 'enabled' : 'updated'}`,
    });
  };


  return (
    <Card className="p-6 bg-gradient-card border-primary/10">
      <div className="flex items-center mb-6">
        <Palette className="h-6 w-6 text-primary mr-2" />
        <h2 className="text-xl font-semibold text-foreground">{t('settings.appearance')}</h2>
      </div>
      
      <div className="space-y-6">
        {!isAuthenticated && (
          <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded border">
            Sign in to save your appearance preferences across devices.
          </div>
        )}


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
            
            <div 
              className={`text-muted-foreground transition-all duration-200 ${
                settings.fontSize === 'small' ? 'text-sm' : 
                settings.fontSize === 'large' ? 'text-lg' : 
                settings.fontSize === 'extra-large' ? 'text-xl' : 
                'text-base'
              }`}
              style={{
                fontSize: settings.fontSize === 'small' ? '14px' : 
                         settings.fontSize === 'large' ? '18px' : 
                         settings.fontSize === 'extra-large' ? '20px' : 
                         '16px'
              }}
            >
              Preview: Sample text in {settings.fontSize} size - Lorem ipsum dolor sit amet
            </div>
          </div>
        </div>

      </div>
    </Card>
  );
};

export default AppearanceSettings;
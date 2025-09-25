import { Globe, Type, Book } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useEnhancedUserSettings } from "@/hooks/useEnhancedUserSettings";
import { useToast } from "@/hooks/use-toast";

const LanguageSettings = () => {
  const { settings, updateSettings, isAuthenticated } = useEnhancedUserSettings();
  const { toast } = useToast();

  const handleSettingChange = (setting: string, value: any) => {
    toast({
      title: "Language updated",
      description: `${setting} has been updated`,
    });
  };

  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'ar', name: 'Arabic', native: 'العربية' },
    { code: 'ur', name: 'Urdu', native: 'اردو' },
    { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia' },
    { code: 'tr', name: 'Turkish', native: 'Türkçe' },
    { code: 'fr', name: 'French', native: 'Français' },
    { code: 'es', name: 'Spanish', native: 'Español' },
    { code: 'de', name: 'German', native: 'Deutsch' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা' },
    { code: 'fa', name: 'Persian', native: 'فارسی' },
  ];

  const translationStyles = [
    { value: 'literal', label: 'Literal Translation' },
    { value: 'interpretive', label: 'Interpretive Translation' },
    { value: 'simplified', label: 'Simplified Language' },
  ];

  return (
    <Card className="p-6 bg-gradient-card border-primary/10">
      <div className="flex items-center mb-6">
        <Globe className="h-6 w-6 text-primary mr-2" />
        <h2 className="text-xl font-semibold text-foreground">Language & Localization</h2>
      </div>
      
      <div className="space-y-6">
        {!isAuthenticated && (
          <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded border">
            Sign in to save your language preferences across devices.
          </div>
        )}

        {/* Preferred Language */}
        <div className="space-y-3">
          <Label className="text-base font-medium">
            Interface Language
          </Label>
          
          <Select
            value={settings.language}
            onValueChange={(value) => {
              updateSettings({ language: value });
              handleSettingChange("Interface language", value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  <div className="flex items-center space-x-3">
                    <span className="font-medium">{lang.name}</span>
                    <span className="text-sm text-muted-foreground">{lang.native}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <p className="text-sm text-muted-foreground">
            Choose your preferred language for the app interface
          </p>
        </div>

        {/* Translation Preferences */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center">
            <Book className="h-4 w-4 mr-2" />
            Translation Style
          </Label>
          
          <Select
            value={settings.translationStyle || 'interpretive'}
            onValueChange={(value: 'literal' | 'interpretive' | 'simplified') => {
              updateSettings({ translationStyle: value });
              handleSettingChange("Translation style", value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select translation style" />
            </SelectTrigger>
            <SelectContent>
              {translationStyles.map((style) => (
                <SelectItem key={style.value} value={style.value}>
                  {style.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <p className="text-sm text-muted-foreground">
            Choose how you prefer Quranic verses to be translated
          </p>
        </div>

        {/* Arabic Text Settings */}
        <div className="space-y-4 pt-4 border-t border-border/50">
          <Label className="text-base font-medium flex items-center">
            <Type className="h-4 w-4 mr-2" />
            Arabic Text Settings
          </Label>
          
          {/* Arabic Text Size */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Arabic Text Size</Label>
              <span className="text-sm text-muted-foreground">{settings.arabicTextSize || 18}px</span>
            </div>
            
            <Slider
              value={[settings.arabicTextSize || 18]}
              max={24}
              min={14}
              step={2}
              className="w-full"
              onValueChange={(value) => {
                updateSettings({ arabicTextSize: value[0] });
                handleSettingChange("Arabic text size", `${value[0]}px`);
              }}
            />
            
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Small</span>
              <span>Medium</span>
              <span>Large</span>
              <span>Extra Large</span>
            </div>
          </div>

          {/* Sample Arabic Text */}
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-4 rounded-lg border border-primary/10">
            <p 
              className="text-center font-arabic text-foreground mb-2"
              style={{ fontSize: `${settings.arabicTextSize || 18}px` }}
            >
              بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </p>
            <p className="text-center text-sm text-muted-foreground">
              Sample Arabic text with current size settings ({settings.arabicTextSize || 18}px)
            </p>
          </div>
        </div>

        {/* Regional Settings */}
        <div className="space-y-3 pt-4 border-t border-border/50">
          <Label className="text-base font-medium">
            Regional Settings
          </Label>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Date Format</Label>
              <Select 
                value={settings.dateFormat || 'gregorian'}
                onValueChange={(value: 'gregorian' | 'hijri' | 'both') => {
                  updateSettings({ dateFormat: value });
                  handleSettingChange("Date format", value);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gregorian">Gregorian Calendar</SelectItem>
                  <SelectItem value="hijri">Hijri Calendar</SelectItem>
                  <SelectItem value="both">Both Calendars</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Time Format</Label>
              <Select 
                value={settings.timeFormat || '12h'}
                onValueChange={(value: '12h' | '24h') => {
                  updateSettings({ timeFormat: value });
                  handleSettingChange("Time format", value);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12h">12 Hour (AM/PM)</SelectItem>
                  <SelectItem value="24h">24 Hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default LanguageSettings;
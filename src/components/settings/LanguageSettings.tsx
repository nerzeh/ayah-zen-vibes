import { useState, useEffect } from "react";
import { Globe, Type, Book } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useEnhancedUserSettings } from "@/hooks/useEnhancedUserSettings";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

const LanguageSettings = () => {
  const { settings, updateSettings, isAuthenticated } = useEnhancedUserSettings();
  const { toast } = useToast();
  const { t, setLanguage } = useLanguage();

  // Local (unsaved) values
  const [localLanguage, setLocalLanguage] = useState(settings.language);
  const [localTranslationStyle, setLocalTranslationStyle] = useState(settings.translationStyle || 'interpretive');
  const [localArabicTextSize, setLocalArabicTextSize] = useState<number>(settings.arabicTextSize || 18);
  const [localDateFormat, setLocalDateFormat] = useState(settings.dateFormat || 'gregorian');
  const [localTimeFormat, setLocalTimeFormat] = useState(settings.timeFormat || '12h');
  const [isSaving, setIsSaving] = useState(false);

  // Sync local state when settings change
  useEffect(() => {
    setLocalLanguage(settings.language);
    setLocalTranslationStyle(settings.translationStyle || 'interpretive');
    setLocalArabicTextSize(settings.arabicTextSize || 18);
    setLocalDateFormat(settings.dateFormat || 'gregorian');
    setLocalTimeFormat(settings.timeFormat || '12h');
  }, [settings.language, settings.translationStyle, settings.arabicTextSize, settings.dateFormat, settings.timeFormat]);

  const isDirty =
    localLanguage !== settings.language ||
    localTranslationStyle !== (settings.translationStyle || 'interpretive') ||
    localArabicTextSize !== (settings.arabicTextSize || 18) ||
    localDateFormat !== (settings.dateFormat || 'gregorian') ||
    localTimeFormat !== (settings.timeFormat || '12h');

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const updates: Record<string, any> = {};
      if (localLanguage !== settings.language) {
        updates.language = localLanguage;
        // Change language immediately for UI (only supported app languages)
        const appLangs = ['en','ar','fr','es','de'] as const;
        if ((appLangs as readonly string[]).includes(localLanguage)) {
          setLanguage(localLanguage as any);
        }
      }
      if (localTranslationStyle !== settings.translationStyle) updates.translationStyle = localTranslationStyle;
      if (localArabicTextSize !== settings.arabicTextSize) updates.arabicTextSize = localArabicTextSize;
      if (localDateFormat !== settings.dateFormat) updates.dateFormat = localDateFormat;
      if (localTimeFormat !== settings.timeFormat) updates.timeFormat = localTimeFormat;

      if (Object.keys(updates).length > 0) {
        await updateSettings(updates);
        toast({ title: t('common.success'), description: t('language.saved', 'Language settings updated.') });
      }
    } catch (e) {
      toast({ title: t('common.error'), description: t('language.saveFailed', 'Failed to save settings.'), variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
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
    { value: 'literal', label: t('translation.literal') },
    { value: 'interpretive', label: t('translation.interpretive') },
    { value: 'simplified', label: t('translation.simplified') },
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
            {t('language.interfaceLanguage')}
          </Label>
          
          <Select
            value={localLanguage}
            onValueChange={(value) => {
              setLocalLanguage(value);
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
            {t('language.interfaceLanguageDesc')}
          </p>
        </div>

        {/* Translation Preferences */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center">
            <Book className="h-4 w-4 mr-2" />
            {t('language.translationStyle')}
          </Label>
          
          <Select
            value={localTranslationStyle}
            onValueChange={(value: 'literal' | 'interpretive' | 'simplified') => {
              setLocalTranslationStyle(value);
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
            {t('language.translationStyleDesc')}
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
              <span className="text-sm text-muted-foreground">{localArabicTextSize}px</span>
            </div>
            
            <Slider
              value={[localArabicTextSize]}
              max={24}
              min={14}
              step={2}
              className="w-full"
              onValueChange={(value) => setLocalArabicTextSize(value[0])}
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
              style={{ fontSize: `${localArabicTextSize}px` }}
            >
              بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </p>
            <p className="text-center text-sm text-muted-foreground">
              Sample Arabic text with current size settings ({localArabicTextSize}px)
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
                value={localDateFormat}
                onValueChange={(value: 'gregorian' | 'hijri' | 'both') => {
                  setLocalDateFormat(value);
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
                value={localTimeFormat}
                onValueChange={(value: '12h' | '24h') => {
                  setLocalTimeFormat(value);
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

          {isDirty && (
            <div className="sticky bottom-4 z-20">
              <Card className="p-3 bg-background/95 border-primary/20 backdrop-blur flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('language.unsavedChanges')}</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setLocalLanguage(settings.language);
                      setLocalTranslationStyle(settings.translationStyle || 'interpretive');
                      setLocalArabicTextSize(settings.arabicTextSize || 18);
                      setLocalDateFormat(settings.dateFormat || 'gregorian');
                      setLocalTimeFormat(settings.timeFormat || '12h');
                    }}
                  >
                    {t('language.discard')}
                  </Button>
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? t('language.saving') : t('language.saveChanges')}
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default LanguageSettings;
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Smartphone, RefreshCw, Settings, Clock, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

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
      title: t('widget.configured'),
      description: t('widget.configuredDesc'),
    });
  };

  const installWidget = async () => {
    // This would trigger native widget installation
    // For now, we'll simulate the process
    toast({
      title: t('widget.installation'),
      description: t('widget.installationDesc'),
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-card border-primary/10">
        <div className="flex items-center mb-6">
          <Smartphone className="h-6 w-6 text-primary mr-2" />
          <h2 className="text-xl font-semibold text-foreground">{t('widget.title')}</h2>
        </div>

        {/* Widget Preview */}
        <div className="mb-6">
          <Label className="text-base font-medium mb-3 block">{t('widget.preview')}</Label>
          <div className="flex justify-center">
            <div 
              className={`relative rounded-2xl p-4 shadow-2xl backdrop-blur-sm ${
                config.size === '2x2' ? 'w-32 h-32' :
                config.size === '4x2' ? 'w-64 h-32' :
                'w-64 h-64'
              }`}
              style={{
                background: 'linear-gradient(135deg, hsl(142, 76%, 36%) 0%, hsl(158, 64%, 52%) 100%)',
                position: 'relative'
              }}
            >
              {/* Semi-transparent black overlay */}
              <div 
                className="absolute inset-0 rounded-2xl"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
              ></div>
              
              {/* Islamic Pattern Background */}
              <div className="absolute inset-0 opacity-10 rounded-2xl bg-islamic-pattern"></div>
              
              {/* Content */}
              <div className="relative h-full flex flex-col justify-between text-white p-2">
                <div className="text-xs font-medium opacity-90">{t('widget.todayVerse')}</div>
                
                <div className="flex-1 flex flex-col justify-center text-center">
                  {config.showArabic && (
                    <p className="font-arabic text-sm mb-2 leading-relaxed text-white">
                      بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                    </p>
                  )}
                  {config.showTranslation && config.size !== '2x2' && (
                    <p className="text-xs leading-tight text-white/95">
                      "In the name of Allah, the Most Gracious, the Most Merciful"
                    </p>
                  )}
                </div>
                
                <div className="flex justify-between items-end">
                  <div className="text-xs font-medium text-white/80">Al-Fatiha 1:1</div>
                  <div className="w-4 h-4 bg-white/30 rounded-full backdrop-blur-sm"></div>
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
                {t('widget.enable')}
              </Label>
              <p className="text-sm text-muted-foreground">
                {t('widget.enableDesc')}
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
                  {t('widget.size')}
                </Label>
                <Select value={config.size} onValueChange={(value) => updateConfig('size', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('widget.selectSize')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2x2">{t('widget.sizeSmall')}</SelectItem>
                    <SelectItem value="4x2">{t('widget.sizeMedium')}</SelectItem>
                    <SelectItem value="4x4">{t('widget.sizeLarge')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Update Frequency */}
              <div className="space-y-2">
                <Label className="text-base font-medium flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  {t('widget.frequency')}
                </Label>
                <Select value={config.updateFrequency} onValueChange={(value) => updateConfig('updateFrequency', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('widget.selectFrequency')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">{t('widget.frequencyDaily')}</SelectItem>
                    <SelectItem value="twice-daily">{t('widget.frequencyTwice')}</SelectItem>
                    <SelectItem value="hourly">{t('widget.frequencyHourly')}</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  {t('widget.frequencyNote')}
                </p>
              </div>

              {/* Widget Theme */}
              <div className="space-y-2">
                <Label className="text-base font-medium flex items-center">
                  <Palette className="h-4 w-4 mr-2" />
                  {t('widget.theme')}
                </Label>
                <Select value={config.theme} onValueChange={(value) => updateConfig('theme', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('widget.selectTheme')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="classic">{t('widget.themeClassic')}</SelectItem>
                    <SelectItem value="minimal">{t('widget.themeMinimal')}</SelectItem>
                    <SelectItem value="elegant">{t('widget.themeElegant')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Content Options */}
              <div className="space-y-4">
                <Label className="text-base font-medium">{t('widget.content')}</Label>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="show-arabic" className="text-sm font-medium">
                      {t('widget.showArabic')}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {t('widget.showArabicDesc')}
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
                      {t('widget.showTranslation')}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {t('widget.showTranslationDesc')}
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
            className="flex-1"
          >
            <Settings className="mr-2 h-4 w-4" />
            {t('widget.saveConfig')}
          </Button>
          
          {config.enabled && (
            <Button
              onClick={installWidget}
              variant="outline"
              className="flex-1"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              {t('widget.installWidget')}
            </Button>
          )}
        </div>

        {/* Installation Instructions */}
        {config.enabled && (
          <Card className="mt-6 p-4 bg-muted/50 border-primary/10">
            <h3 className="font-medium text-foreground mb-2">{t('widget.instructionsTitle')}</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><strong>iOS:</strong> {t('widget.instructionsIOS')}</p>
              <p><strong>Android:</strong> {t('widget.instructionsAndroid')}</p>
              <p className="text-xs mt-3 text-primary">
                {t('widget.tip')}
              </p>
            </div>
          </Card>
        )}
      </Card>
    </div>
  );
};

export default WidgetConfiguration;
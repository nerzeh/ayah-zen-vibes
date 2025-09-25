import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Palette, Smartphone, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import WallpaperCustomizer from "@/components/wallpaper/WallpaperCustomizer";
import { WallpaperGenerator as WallpaperEngine, WallpaperOptions, getDeviceScreenDimensions, downloadWallpaper } from "@/lib/wallpaperEngine";
import { useRandomVerse, useVerses, Verse } from "@/hooks/useVerses";
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import { useLanguage } from "@/contexts/LanguageContext";
const Customize = () => {
  const [searchParams] = useSearchParams();
  const [wallpaperEngine] = useState(() => new WallpaperEngine());
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWallpaper, setGeneratedWallpaper] = useState<string | null>(null);
  const [currentVerse, setCurrentVerse] = useState<Verse | null>(null);
  
  const verseId = searchParams.get('verseId');
  const { data: randomVerse } = useRandomVerse();
  const { data: allVerses } = useVerses();
  const { toast } = useToast();
  const { t } = useLanguage();

  // Effect to set the current verse based on URL parameter or use random verse
  useEffect(() => {
    if (verseId && allVerses) {
      const selectedVerse = allVerses.find(v => v.id === parseInt(verseId));
      if (selectedVerse) {
        setCurrentVerse(selectedVerse);
      }
    } else if (randomVerse && !verseId) {
      setCurrentVerse(randomVerse);
    }
  }, [verseId, allVerses, randomVerse]);

  const [wallpaperOptions, setWallpaperOptions] = useState<WallpaperOptions>(() => {
    const dimensions = getDeviceScreenDimensions();
    return {
      backgroundType: 'mountain_valley',
      width: dimensions.width,
      height: dimensions.height
    };
  });

  const generateWallpaperPreview = async () => {
    if (!currentVerse) return;
    
    setIsGenerating(true);
    try {
      const blob = await wallpaperEngine.generateWallpaper(currentVerse, wallpaperOptions);
      const url = URL.createObjectURL(blob);
      setGeneratedWallpaper(url);
      
      toast({
        title: t('wallpaper.generated', 'Preview generated'),
        description: t('wallpaper.previewReady', 'Your custom wallpaper preview is ready!'),
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('customize.previewError', 'Failed to generate preview. Please try again.'),
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadGeneratedWallpaper = async () => {
    if (!currentVerse) return;
    
    try {
      const blob = await wallpaperEngine.generateWallpaper(currentVerse, wallpaperOptions);
      const filename = `ayah-wallpaper-${Date.now()}.png`;
      downloadWallpaper(blob, filename);
      
      toast({
        title: t('wallpaper.downloaded'),
        description: t('wallpaper.savedToDevice'),
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('customize.downloadError', 'Failed to download wallpaper. Please try again.'),
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 pb-24 bg-background min-h-screen">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-2">
          <Palette className="h-8 w-8 text-primary mr-2" />
          <h1 className="text-3xl font-bold text-foreground">{t('customize.title')}</h1>
        </div>
        <p className="text-muted-foreground">{t('customize.subtitle')}</p>
      </div>

      {/* Preview Section */}
      <Card className="mb-8 p-6 bg-gradient-card border-primary/10">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <Smartphone className="h-6 w-6 text-primary mr-2" />
            <h2 className="text-xl font-semibold text-foreground">{t('customize.livePreview')}</h2>
          </div>
          
          {generatedWallpaper ? (
            <div className="relative inline-block">
              <img
                src={generatedWallpaper}
                alt={`${t('customize.title')} Preview`}
                className="max-w-full h-80 object-contain rounded-lg shadow-elegant border border-primary/10"
              />
              <Button
                onClick={() => setGeneratedWallpaper(null)}
                variant="secondary"
                size="sm"
                className="absolute top-2 right-2 bg-white/90 hover:bg-white"
              >
                {t('customize.reset')}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-6 border-2 border-dashed border-primary/20 rounded-lg">
              <Smartphone className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg mb-4">{t('customize.generateHint')}</p>
              <Button
                onClick={generateWallpaperPreview}
                disabled={isGenerating || !currentVerse}
                className="hover:bg-primary/90 text-primary-foreground"
              >
                {isGenerating ? t('customize.generating') : t('customize.generatePreview')}
              </Button>
            </div>
          )}
        </div>

        {/* Download Actions */}
        {generatedWallpaper && (
          <div className="flex gap-4 justify-center">
            <Button
              onClick={downloadGeneratedWallpaper}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              size="lg"
            >
              <Download className="mr-2 h-5 w-5" />
              {t('customize.download')}
            </Button>
            <Button
              onClick={generateWallpaperPreview}
              variant="outline"
              size="lg"
              className="border-primary/20 hover:bg-primary/5"
              disabled={isGenerating}
            >
              {t('customize.regenerate')}
            </Button>
          </div>
        )}
      </Card>

      {/* Customization Options */}
      <WallpaperCustomizer
        options={wallpaperOptions}
        onOptionsChange={setWallpaperOptions}
        onGenerate={generateWallpaperPreview}
        isGenerating={isGenerating}
      />

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Customize;
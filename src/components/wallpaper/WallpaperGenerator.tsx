import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCw, Download, Heart, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRandomVerse, useFavoriteVerse, type Verse } from "@/hooks/useVerses";
import { WallpaperGenerator as WallpaperEngine, WallpaperOptions, getDeviceScreenDimensions, downloadWallpaper } from "@/lib/wallpaperEngine";
import WallpaperCustomizer from "./WallpaperCustomizer";
import { useLanguage } from "@/contexts/LanguageContext";
const WallpaperView = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [generatedWallpaper, setGeneratedWallpaper] = useState<string | null>(null);
  const [wallpaperEngine] = useState(() => new WallpaperEngine());
  
  const { data: currentVerse, refetch, isLoading } = useRandomVerse();
  const favoriteVerse = useFavoriteVerse();
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const [wallpaperOptions, setWallpaperOptions] = useState<WallpaperOptions>(() => {
    const dimensions = getDeviceScreenDimensions();
    return {
      width: dimensions.width,
      height: dimensions.height,
      backgroundImage: undefined
    };
  });

  const generateNewVerse = async () => {
    setIsGenerating(true);
    try {
      await refetch();
      toast({
        title: t('wallpaper.generated'),
        description: t('wallpaper.previewReady'),
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('wallpaper.generateError', 'Failed to generate new verse. Please try again.'),
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateWallpaperPreview = async () => {
    if (!currentVerse) return;
    
    setIsGenerating(true);
    try {
      const blob = await wallpaperEngine.generateWallpaper(currentVerse, wallpaperOptions);
      const url = URL.createObjectURL(blob);
      setGeneratedWallpaper(url);
      
      toast({
        title: t('wallpaper.generated'),
        description: t('wallpaper.previewReady'),
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('wallpaper.generateError', 'Failed to generate wallpaper. Please try again.'),
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
      const filename = `islamic-wallpaper-${currentVerse.surah_number}-${currentVerse.ayah_number}.png`;
      downloadWallpaper(blob, filename);
      
      toast({
        title: t('wallpaper.downloaded'),
        description: t('wallpaper.savedToDevice'),
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('wallpaper.downloadError', 'Failed to download wallpaper. Please try again.'),
        variant: "destructive"
      });
    }
  };

  const handleFavorite = async () => {
    if (!currentVerse) return;
    
    try {
      await favoriteVerse.mutateAsync(currentVerse.id);
      toast({
        title: t('wallpaper.addedToFavorites'),
        description: t('wallpaper.savedToFavorites'),
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('wallpaper.signInToSave'),
        variant: "destructive"
      });
    }
  };

  if (isLoading || !currentVerse) {
    return (
      <div className="space-y-6">
        <Card className="relative overflow-hidden border-0 shadow-elegant">
            <div className="aspect-[9/16] bg-gradient-nature flex items-center justify-center">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Wallpaper Preview */}
      <Card className="islamic-card relative overflow-hidden border-0 shadow-card">
        {generatedWallpaper ? (
          <div className="relative" style={{ aspectRatio: wallpaperOptions.width / wallpaperOptions.height }}>
            <img
              src={generatedWallpaper}
              alt="Generated Islamic Wallpaper"
                className="w-full h-full object-contain rounded-lg"
              />
            <div className="absolute inset-0 bg-black/20 rounded-lg" />
            <div className="absolute top-4 right-4">
              <Button
                onClick={() => setGeneratedWallpaper(null)}
                variant="secondary"
                size="sm"
                className="glass-effect hover:bg-primary/20"
              >
                {t('customize.showOriginal')}
              </Button>
            </div>
          </div>
        ) : (
          <div 
            className="bg-gradient-nature bg-nature-pattern relative flex flex-col items-center justify-center p-8 text-center"
            style={{
              aspectRatio: wallpaperOptions.width / wallpaperOptions.height,
              background: `
                var(--gradient-hero),
                url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Cpath d='M40 0L60 20L80 0L80 40L60 60L80 80L40 80L20 60L0 80L0 40L20 20L0 0L40 0Z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
              `
            }}
          >
            {/* Modern Glass Border */}
            <div className="absolute inset-4 glass-effect rounded-3xl" />
            <div className="absolute inset-6 border border-primary/30 rounded-2xl" />
            
            {/* Arabic Text */}
            <div className="space-y-6 z-10">
              <p className={`font-quran text-2xl md:text-3xl lg:text-4xl text-white leading-relaxed ${isGenerating ? 'animate-pulse' : ''}`}>
                {currentVerse.arabic_text}
              </p>
              
              {/* Translation */}
              <div className="space-y-4">
                <p className="text-white/95 text-base md:text-lg font-light leading-relaxed italic">
                  "{currentVerse.translated_text || currentVerse.english_translation}"
                </p>
                <div className="flex items-center justify-center space-x-4">
                  <div className="w-12 h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
                  <p className="text-primary text-sm font-semibold px-4 py-2 glass-effect rounded-full">
                    {t('common.surah', 'Surah')} {currentVerse.surah_number}:{currentVerse.ayah_number}
                  </p>
                  <div className="w-12 h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
                </div>
              </div>
            </div>

            {/* Nature-inspired Decorative Elements */}
            <div className="absolute top-8 left-8 w-20 h-20 glass-effect rounded-full animate-float flex items-center justify-center">
              <div className="w-10 h-10 bg-primary/20 rounded-full animate-glow"></div>
            </div>
            <div className="absolute bottom-8 right-8 w-16 h-16 glass-effect rounded-full animate-float flex items-center justify-center" style={{ animationDelay: '1s' }}>
              <div className="w-8 h-8 bg-primary/30 rounded-full"></div>
            </div>
            <div className="absolute top-1/3 right-12 w-4 h-4 bg-primary/60 rounded-full animate-shimmer" style={{ animationDelay: '2s' }}></div>
            <div className="absolute bottom-1/4 left-12 w-3 h-3 bg-primary/70 rounded-full animate-shimmer" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute top-2/3 left-1/4 w-2 h-2 bg-primary/50 rounded-full animate-shimmer" style={{ animationDelay: '1.5s' }}></div>
          </div>
        )}
      </Card>

      {/* Wallpaper Customizer */}
      {showCustomizer && (
        <WallpaperCustomizer
          options={wallpaperOptions}
          onOptionsChange={setWallpaperOptions}
          onGenerate={generateWallpaperPreview}
          isGenerating={isGenerating}
        />
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        {/* Primary Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={generateNewVerse}
            disabled={isGenerating}
            className="text-card-foreground"
            size="lg"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? t('customize.generating') : t('wallpaper.newVerse')}
          </Button>
          
          <Button
            onClick={downloadGeneratedWallpaper}
            className="bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-glow"
            size="lg"
          >
            <Download className="mr-2 h-4 w-4" />
            {t('customize.download')}
          </Button>
          
          <Button
            onClick={handleFavorite}
            variant="outline"
            size="lg"
            className="glass-effect border-primary/30 hover:bg-primary/20 hover:shadow-glow"
            disabled={favoriteVerse.isPending}
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>

        {/* Secondary Actions */}
        <div className="flex gap-3">
          <Button
            onClick={() => setShowCustomizer(!showCustomizer)}
            className="flex-1 glass-effect border-primary/30 hover:bg-primary/10"
            size="lg"
          >
            <Settings className="mr-2 h-4 w-4" />
            {showCustomizer ? t('customize.hide') : t('customize.customize')} {t('common.wallpaper', 'Wallpaper')}
          </Button>
          
          {!generatedWallpaper && (
            <Button
              onClick={generateWallpaperPreview}
              disabled={isGenerating}
              variant="outline"
              className="flex-1 glass-effect border-primary/30 hover:bg-primary/20 hover:shadow-glow"
              size="lg"
            >
            {t('customize.generatePreview')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WallpaperView;
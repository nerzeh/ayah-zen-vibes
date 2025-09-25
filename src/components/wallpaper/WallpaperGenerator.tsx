import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCw, Download, Heart, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRandomVerse, useFavoriteVerse, type Verse } from "@/hooks/useVerses";
import { WallpaperGenerator as WallpaperEngine, WallpaperOptions, getDeviceScreenDimensions, downloadWallpaper } from "@/lib/wallpaperEngine";
import WallpaperCustomizer from "./WallpaperCustomizer";

const WallpaperView = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [generatedWallpaper, setGeneratedWallpaper] = useState<string | null>(null);
  const [wallpaperEngine] = useState(() => new WallpaperEngine());
  
  const { data: currentVerse, refetch, isLoading } = useRandomVerse();
  const favoriteVerse = useFavoriteVerse();
  const { toast } = useToast();
  
  const [wallpaperOptions, setWallpaperOptions] = useState<WallpaperOptions>(() => {
    const dimensions = getDeviceScreenDimensions();
    return {
      backgroundStyle: 'mosque',
      colorScheme: 'emerald',
      width: dimensions.width,
      height: dimensions.height
    };
  });

  const generateNewVerse = async () => {
    setIsGenerating(true);
    try {
      await refetch();
      toast({
        title: "New verse generated",
        description: "Your wallpaper has been updated with a beautiful new verse",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate new verse. Please try again.",
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
        title: "Wallpaper generated",
        description: "Your custom wallpaper preview is ready!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate wallpaper. Please try again.",
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
        title: "Wallpaper downloaded",
        description: "Your beautiful Islamic wallpaper has been saved to your device",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download wallpaper. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleFavorite = async () => {
    if (!currentVerse) return;
    
    try {
      await favoriteVerse.mutateAsync(currentVerse.id);
      toast({
        title: "Added to favorites",
        description: "This verse has been saved to your favorites",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Please sign in to save favorites",
        variant: "destructive"
      });
    }
  };

  if (isLoading || !currentVerse) {
    return (
      <div className="space-y-6">
        <Card className="relative overflow-hidden border-0 shadow-elegant">
          <div className="aspect-[9/16] bg-gradient-hero flex items-center justify-center">
            <RefreshCw className="h-8 w-8 animate-spin text-white" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Wallpaper Preview */}
      <Card className="relative overflow-hidden border-0 shadow-elegant">
        {generatedWallpaper ? (
          <div className="aspect-[9/16] relative">
            <img
              src={generatedWallpaper}
              alt="Generated Islamic Wallpaper"
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black/20 rounded-lg" />
            <div className="absolute top-4 right-4">
              <Button
                onClick={() => setGeneratedWallpaper(null)}
                variant="secondary"
                size="sm"
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30"
              >
                Show Original
              </Button>
            </div>
          </div>
        ) : (
          <div 
            className="aspect-[9/16] bg-gradient-hero bg-arabesque relative flex flex-col items-center justify-center p-8 text-center"
            style={{
              background: `
                var(--gradient-hero),
                url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M50 50m-20 0a20,20 0 1,1 40,0a20,20 0 1,1 -40,0M50 10m-5 0a5,5 0 1,1 10,0a5,5 0 1,1 -10,0M50 90m-5 0a5,5 0 1,1 10,0a5,5 0 1,1 -10,0M10 50m-5 0a5,5 0 1,1 10,0a5,5 0 1,1 -10,0M90 50m-5 0a5,5 0 1,1 10,0a5,5 0 1,1 -10,0'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
              `
            }}
          >
            {/* Decorative Islamic Border */}
            <div className="absolute inset-4 border-2 border-white/30 rounded-2xl" />
            <div className="absolute inset-6 border border-white/20 rounded-xl" />
            
            {/* Arabic Text */}
            <div className="space-y-6 z-10">
              <p className={`font-quran text-2xl md:text-3xl lg:text-4xl text-white leading-relaxed ${isGenerating ? 'animate-pulse' : ''}`}>
                {currentVerse.arabic_text}
              </p>
              
              {/* Translation */}
              <div className="space-y-3">
                <p className="text-white/95 text-base md:text-lg font-light leading-relaxed italic">
                  "{currentVerse.english_translation}"
                </p>
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-8 h-px bg-gradient-to-r from-transparent via-secondary to-transparent"></div>
                  <p className="text-secondary text-sm font-medium">
                    Surah {currentVerse.surah_number}:{currentVerse.ayah_number}
                  </p>
                  <div className="w-8 h-px bg-gradient-to-r from-transparent via-secondary to-transparent"></div>
                </div>
              </div>
            </div>

            {/* Decorative Islamic Elements */}
            <div className="absolute top-6 left-6 w-16 h-16 border-2 border-secondary/30 rounded-full animate-float flex items-center justify-center">
              <div className="w-8 h-8 border border-secondary/40 rounded-full"></div>
            </div>
            <div className="absolute bottom-6 right-6 w-12 h-12 bg-secondary/20 rounded-full animate-float flex items-center justify-center" style={{ animationDelay: '1s' }}>
              <div className="w-6 h-6 bg-secondary/30 rounded-full"></div>
            </div>
            <div className="absolute top-1/4 right-8 w-3 h-3 bg-secondary/40 rounded-full animate-shimmer" style={{ animationDelay: '2s' }}></div>
            <div className="absolute bottom-1/3 left-8 w-2 h-2 bg-secondary/50 rounded-full animate-shimmer" style={{ animationDelay: '0.5s' }}></div>
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
            variant="mosque"
            size="lg"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Generating...' : 'New Verse'}
          </Button>
          
          <Button
            onClick={downloadGeneratedWallpaper}
            variant="gold"
            size="lg"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Wallpaper
          </Button>
          
          <Button
            onClick={handleFavorite}
            variant="outline"
            size="lg"
            className="border-primary/30 hover:bg-primary/10 hover:shadow-glow"
            disabled={favoriteVerse.isPending}
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>

        {/* Secondary Actions */}
        <div className="flex gap-3">
          <Button
            onClick={() => setShowCustomizer(!showCustomizer)}
            variant="elegant"
            className="flex-1"
            size="lg"
          >
            <Settings className="mr-2 h-4 w-4" />
            {showCustomizer ? 'Hide' : 'Customize'} Wallpaper
          </Button>
          
          {!generatedWallpaper && (
            <Button
              onClick={generateWallpaperPreview}
              disabled={isGenerating}
              variant="outline"
              className="flex-1 border-primary/30 hover:bg-primary/10 hover:shadow-glow"
              size="lg"
            >
              Generate Preview
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WallpaperView;
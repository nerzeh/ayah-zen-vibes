import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCw, Download, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRandomVerse, useFavoriteVerse, type Verse } from "@/hooks/useVerses";
import { useQueryClient } from "@tanstack/react-query";

const WallpaperGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { data: currentVerse, refetch, isLoading } = useRandomVerse();
  const favoriteVerse = useFavoriteVerse();
  const queryClient = useQueryClient();
  const { toast } = useToast();

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

  const downloadWallpaper = () => {
    toast({
      title: "Wallpaper downloaded",
      description: "Your beautiful Islamic wallpaper has been saved to your device",
    });
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
        <div 
          className="aspect-[9/16] bg-gradient-hero bg-islamic-pattern relative flex flex-col items-center justify-center p-8 text-center"
          style={{
            background: `
              linear-gradient(135deg, hsl(155 85% 15% / 0.9) 0%, hsl(155 70% 30% / 0.8) 50%, hsl(45 100% 55% / 0.7) 100%),
              url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M30 0l30 30-30 30L0 30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
            `
          }}
        >
          {/* Decorative Border */}
          <div className="absolute inset-4 border-2 border-white/20 rounded-2xl" />
          
          {/* Arabic Text */}
          <div className="space-y-6 z-10">
            <p className={`font-arabic text-2xl md:text-3xl lg:text-4xl text-white leading-relaxed ${isGenerating ? 'animate-pulse' : ''}`}>
              {currentVerse.arabic_text}
            </p>
            
            {/* Translation */}
            <div className="space-y-2">
              <p className="text-white/90 text-base md:text-lg font-light leading-relaxed">
                "{currentVerse.english_translation}"
              </p>
              <p className="text-secondary text-sm font-medium">
                Surah {currentVerse.surah_number}:{currentVerse.ayah_number}
              </p>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-8 left-8 w-12 h-12 border-2 border-secondary/30 rounded-full animate-float" />
          <div className="absolute bottom-8 right-8 w-8 h-8 bg-secondary/20 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={generateNewVerse}
          disabled={isGenerating}
          className="flex-1 bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-glow"
          size="lg"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
          {isGenerating ? 'Generating...' : 'New Verse'}
        </Button>
        
        <Button
          onClick={downloadWallpaper}
          variant="secondary"
          className="flex-1 bg-gradient-secondary hover:opacity-90"
          size="lg"
        >
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
        
        <Button
          onClick={handleFavorite}
          variant="outline"
          size="lg"
          className="border-primary/20 hover:bg-primary/5"
          disabled={favoriteVerse.isPending}
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default WallpaperGenerator;
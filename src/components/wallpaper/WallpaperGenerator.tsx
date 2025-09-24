import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCw, Download, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Verse {
  arabic: string;
  translation: string;
  reference: string;
}

const sampleVerses: Verse[] = [
  {
    arabic: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا",
    translation: "And whoever fears Allah - He will make for him a way out",
    reference: "At-Talaq 65:2"
  },
  {
    arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
    translation: "For indeed, with hardship [will be] ease",
    reference: "Ash-Sharh 94:5"
  },
  {
    arabic: "وَاللَّهُ خَيْرٌ حَافِظًا وَهُوَ أَرْحَمُ الرَّاحِمِينَ",
    translation: "But Allah is the best guardian, and He is the most merciful of the merciful",
    reference: "Yusuf 12:64"
  },
  {
    arabic: "وَعَسَىٰ أَن تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَّكُمْ",
    translation: "But perhaps you hate a thing and it is good for you",
    reference: "Al-Baqarah 2:216"
  }
];

const WallpaperGenerator = () => {
  const [currentVerse, setCurrentVerse] = useState<Verse>(sampleVerses[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateNewVerse = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const randomVerse = sampleVerses[Math.floor(Math.random() * sampleVerses.length)];
      setCurrentVerse(randomVerse);
      setIsGenerating(false);
      toast({
        title: "New verse generated",
        description: "Your wallpaper has been updated with a beautiful new verse",
      });
    }, 1000);
  };

  const downloadWallpaper = () => {
    toast({
      title: "Wallpaper downloaded",
      description: "Your beautiful Islamic wallpaper has been saved to your device",
    });
  };

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
              {currentVerse.arabic}
            </p>
            
            {/* Translation */}
            <div className="space-y-2">
              <p className="text-white/90 text-base md:text-lg font-light leading-relaxed">
                "{currentVerse.translation}"
              </p>
              <p className="text-secondary text-sm font-medium">
                {currentVerse.reference}
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
          variant="outline"
          size="lg"
          className="border-primary/20 hover:bg-primary/5"
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default WallpaperGenerator;
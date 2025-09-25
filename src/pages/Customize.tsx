import { useState } from "react";
import { Palette, Smartphone, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import WallpaperCustomizer from "@/components/wallpaper/WallpaperCustomizer";
import { WallpaperGenerator as WallpaperEngine, WallpaperOptions, getDeviceScreenDimensions, downloadWallpaper } from "@/lib/wallpaperEngine";
import { useRandomVerse } from "@/hooks/useVerses";
import { useToast } from "@/hooks/use-toast";

const Customize = () => {
  const [wallpaperEngine] = useState(() => new WallpaperEngine());
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWallpaper, setGeneratedWallpaper] = useState<string | null>(null);
  const { data: currentVerse } = useRandomVerse();
  const { toast } = useToast();

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
        title: "Preview generated",
        description: "Your custom wallpaper preview is ready!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate preview. Please try again.",
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
        title: "Wallpaper downloaded",
        description: "Your beautiful Islamic wallpaper has been saved",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download wallpaper. Please try again.",
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
          <h1 className="text-3xl font-bold text-foreground">Customize Wallpaper</h1>
        </div>
        <p className="text-muted-foreground">Create your perfect Islamic wallpaper design</p>
      </div>

      {/* Preview Section */}
      <Card className="mb-8 p-6 bg-gradient-card border-primary/10">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <Smartphone className="h-6 w-6 text-primary mr-2" />
            <h2 className="text-xl font-semibold text-foreground">Live Preview</h2>
          </div>
          
          {generatedWallpaper ? (
            <div className="relative inline-block">
              <img
                src={generatedWallpaper}
                alt="Generated Islamic Wallpaper Preview"
                className="max-w-full h-80 object-contain rounded-lg shadow-elegant border border-primary/10"
              />
              <Button
                onClick={() => setGeneratedWallpaper(null)}
                variant="secondary"
                size="sm"
                className="absolute top-2 right-2 bg-white/90 hover:bg-white"
              >
                Reset
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-6 border-2 border-dashed border-primary/20 rounded-lg">
              <Smartphone className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg mb-4">Generate a preview to see your design</p>
              <Button
                onClick={generateWallpaperPreview}
                disabled={isGenerating || !currentVerse}
                className="bg-gradient-primary hover:opacity-90 text-primary-foreground"
              >
                {isGenerating ? "Generating..." : "Generate Preview"}
              </Button>
            </div>
          )}
        </div>

        {/* Download Actions */}
        {generatedWallpaper && (
          <div className="flex gap-4 justify-center">
            <Button
              onClick={downloadGeneratedWallpaper}
              className="bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-glow"
              size="lg"
            >
              <Download className="mr-2 h-5 w-5" />
              Download Wallpaper
            </Button>
            <Button
              onClick={generateWallpaperPreview}
              variant="outline"
              size="lg"
              className="border-primary/20 hover:bg-primary/5"
              disabled={isGenerating}
            >
              Regenerate
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

      {/* Quick Presets */}
      <Card className="mt-8 p-6 bg-gradient-card border-primary/10">
        <h3 className="text-lg font-semibold text-foreground mb-4">Islamic Style Presets</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="h-20 border-primary/20 hover:bg-primary/5 flex flex-col items-center justify-center"
            onClick={() => {
          setWallpaperOptions(prev => ({
            ...prev,
            backgroundStyle: 'nature',
            colorScheme: 'nature'
          }));
            }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-900 to-amber-500 rounded mb-2"></div>
            <span className="text-sm font-medium">Sacred Mosque</span>
          </Button>
          
          <Button
            variant="outline"
            className="h-20 border-primary/20 hover:bg-primary/5 flex flex-col items-center justify-center"
            onClick={() => {
          setWallpaperOptions(prev => ({
            ...prev,
            backgroundStyle: 'mountain',
            colorScheme: 'mountain'
          }));
            }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-amber-800 to-amber-400 rounded mb-2"></div>
            <span className="text-sm font-medium">Sacred Geometry</span>
          </Button>
          
          <Button
            variant="outline"
            className="h-20 border-primary/20 hover:bg-primary/5 flex flex-col items-center justify-center"
            onClick={() => {
          setWallpaperOptions(prev => ({
            ...prev,
            backgroundStyle: 'forest',
            colorScheme: 'forest'
          }));
            }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-purple-900 to-emerald-600 rounded mb-2"></div>
            <span className="text-sm font-medium">Royal Arabesque</span>
          </Button>
          
          <Button
            variant="outline"
            className="h-20 border-primary/20 hover:bg-primary/5 flex flex-col items-center justify-center"
            onClick={() => {
          setWallpaperOptions(prev => ({
            ...prev,
            backgroundStyle: 'sunset',
            colorScheme: 'sunset'
          }));
            }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-slate-900 to-blue-600 rounded mb-2"></div>
            <span className="text-sm font-medium">Night Prayer</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Customize;
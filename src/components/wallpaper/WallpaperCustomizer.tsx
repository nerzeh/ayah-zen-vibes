import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { WallpaperOptions } from "@/lib/wallpaperEngine";
import { PexelsService, PexelsPhoto } from "@/services/pexelsService";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WallpaperCustomizerProps {
  options: WallpaperOptions;
  onOptionsChange: (options: WallpaperOptions) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const WallpaperCustomizer = ({ 
  options, 
  onOptionsChange, 
  onGenerate, 
  isGenerating 
}: WallpaperCustomizerProps) => {
  const [backgroundPhotos, setBackgroundPhotos] = useState<PexelsPhoto[]>([]);
  const [isLoadingBackgrounds, setIsLoadingBackgrounds] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadBackgrounds();
  }, []);

  const updateOption = (key: keyof WallpaperOptions, value: any) => {
    onOptionsChange({ ...options, [key]: value });
  };

  const loadBackgrounds = async () => {
    setIsLoadingBackgrounds(true);
    try {
      const photos = await PexelsService.searchBackgrounds();
      setBackgroundPhotos(photos);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load background images",
        variant: "destructive",
      });
    } finally {
      setIsLoadingBackgrounds(false);
    }
  };

  return (
    <Card className="islamic-card p-6 space-y-6 bg-gradient-card border-primary/20">
      <h3 className="text-lg font-semibold text-foreground">Customize Your Wallpaper</h3>
      
      <div className="space-y-6">
        {/* Resolution */}
        <div className="space-y-2">
          <Label htmlFor="resolution" className="text-sm font-medium">
            Resolution
          </Label>
          <Select
            value={`${options.width}x${options.height}`}
            onValueChange={(value) => {
              const [width, height] = value.split('x').map(Number);
              updateOption('width', width);
              updateOption('height', height);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select resolution" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1080x1920">Mobile Portrait (1080x1920)</SelectItem>
              <SelectItem value="1440x2560">Mobile QHD (1440x2560)</SelectItem>
              <SelectItem value="1920x1080">Desktop FHD (1920x1080)</SelectItem>
              <SelectItem value="2560x1440">Desktop QHD (2560x1440)</SelectItem>
              <SelectItem value="1080x1080">Square (1080x1080)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Background Images */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Background Images</Label>
            <Button
              onClick={loadBackgrounds}
              disabled={isLoadingBackgrounds}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 ${isLoadingBackgrounds ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
            {/* Gradient Option */}
            <div
              className={`relative aspect-video rounded-lg cursor-pointer border-2 transition-all ${
                !options.backgroundImage 
                  ? 'border-primary shadow-md' 
                  : 'border-muted-foreground/20 hover:border-muted-foreground/40'
              }`}
              onClick={() => updateOption('backgroundImage', undefined)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 rounded-lg flex items-center justify-center">
                <span className="text-xs font-medium">Gradient</span>
              </div>
            </div>

            {/* Pexels Images */}
            {backgroundPhotos.map((photo) => (
              <div
                key={photo.id}
                className={`relative aspect-video rounded-lg cursor-pointer border-2 transition-all overflow-hidden ${
                  options.backgroundImage === photo.src.medium
                    ? 'border-primary shadow-md' 
                    : 'border-muted-foreground/20 hover:border-muted-foreground/40'
                }`}
                onClick={() => updateOption('backgroundImage', photo.src.medium)}
              >
                <img
                  src={photo.src.tiny}
                  alt={photo.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40" />
              </div>
            ))}
            
            {isLoadingBackgrounds && (
              <div className="aspect-video rounded-lg border-2 border-muted-foreground/20 flex items-center justify-center">
                <RefreshCw className="h-6 w-6 animate-spin" />
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Generate Button */}
        <Button
          onClick={onGenerate}
          disabled={isGenerating}
          className="w-full nature-button text-card-foreground"
          size="lg"
        >
          {isGenerating ? "Generating..." : "Generate Preview"}
        </Button>
      </div>
    </Card>
  );
};

export default WallpaperCustomizer;
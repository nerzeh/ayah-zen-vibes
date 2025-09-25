import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WallpaperOptions } from "@/lib/wallpaperEngine";

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
  const updateOption = (key: keyof WallpaperOptions, value: any) => {
    onOptionsChange({ ...options, [key]: value });
  };

  return (
    <Card className="islamic-card p-6 space-y-6 bg-gradient-card border-primary/20">
      <h3 className="text-lg font-semibold text-foreground">Customize Your Wallpaper</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Background Type */}
        <div className="space-y-2">
          <Label htmlFor="background-type" className="text-sm font-medium">
            Nature Background
          </Label>
          <Select
            value={options.backgroundType}
            onValueChange={(value) => updateOption('backgroundType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select nature background" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mountain_valley">Mountain Valley</SelectItem>
              <SelectItem value="sunset_water">Sunset Over Water</SelectItem>
              <SelectItem value="starry_night">Starry Night</SelectItem>
              <SelectItem value="desert_dunes">Desert Dunes</SelectItem>
              <SelectItem value="forest_path">Forest Path</SelectItem>
              <SelectItem value="ocean_cliffs">Ocean Cliffs</SelectItem>
            </SelectContent>
          </Select>
        </div>

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

        {/* Generate Button */}
        <div className="flex items-end col-span-2">
          <Button
            onClick={onGenerate}
            disabled={isGenerating}
            className="w-full nature-button text-card-foreground"
            size="lg"
          >
            {isGenerating ? "Generating..." : "Generate Preview"}
          </Button>
        </div>
      </div>

      {/* Style Preview */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Nature Backgrounds</Label>
        <div className="grid grid-cols-3 gap-3">
          {([
            { key: 'mountain_valley', label: 'Mountain Valley' },
            { key: 'sunset_water', label: 'Sunset Water' },
            { key: 'starry_night', label: 'Starry Night' },
            { key: 'desert_dunes', label: 'Desert Dunes' },
            { key: 'forest_path', label: 'Forest Path' },
            { key: 'ocean_cliffs', label: 'Ocean Cliffs' }
          ] as const).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => updateOption('backgroundType', key)}
              className={`aspect-square rounded-xl border-2 transition-all flex items-center justify-center text-xs font-medium ${
                options.backgroundType === key
                  ? 'border-primary shadow-glow glass-effect text-primary'
                  : 'border-border hover:border-primary/50 hover:glass-effect text-muted-foreground'
              }`}
            >
              <div
                className={`w-full h-full rounded-md flex items-center justify-center ${getBackgroundPreviewClass(key)}`}
              >
                <span className="text-white text-center p-2 font-semibold text-shadow">
                  {label}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
};

function getBackgroundPreviewClass(backgroundType: string): string {
  switch (backgroundType) {
    case 'mountain_valley':
      return 'bg-gradient-to-b from-blue-900 via-green-800 to-green-600';
    case 'sunset_water':
      return 'bg-gradient-to-b from-orange-500 via-yellow-500 to-blue-900';
    case 'starry_night':
      return 'bg-gradient-to-b from-purple-900 via-blue-900 to-black';
    case 'desert_dunes':
      return 'bg-gradient-to-b from-yellow-600 via-orange-500 to-red-600';
    case 'forest_path':
      return 'bg-gradient-to-b from-green-900 via-green-700 to-green-600';
    case 'ocean_cliffs':
      return 'bg-gradient-to-b from-blue-500 via-blue-700 to-blue-900';
    default:
      return 'bg-gradient-to-b from-blue-900 via-green-800 to-green-600';
  }
}

export default WallpaperCustomizer;
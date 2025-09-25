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
        {/* Background Style */}
        <div className="space-y-2">
          <Label htmlFor="background-style" className="text-sm font-medium">
            Background Style
          </Label>
          <Select
            value={options.backgroundStyle}
            onValueChange={(value) => updateOption('backgroundStyle', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select background style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nature">Nature Garden</SelectItem>
              <SelectItem value="mountain">Mountain Vista</SelectItem>
              <SelectItem value="forest">Forest Peace</SelectItem>
              <SelectItem value="ocean">Ocean Serenity</SelectItem>
              <SelectItem value="sunset">Sunset Glory</SelectItem>
              <SelectItem value="desert">Desert Calm</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Color Scheme */}
        <div className="space-y-2">
          <Label htmlFor="color-scheme" className="text-sm font-medium">
            Color Scheme
          </Label>
          <Select
            value={options.colorScheme}
            onValueChange={(value) => updateOption('colorScheme', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select color scheme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nature">Nature Green</SelectItem>
              <SelectItem value="mountain">Mountain Gray</SelectItem>
              <SelectItem value="forest">Forest Deep</SelectItem>
              <SelectItem value="ocean">Ocean Blue</SelectItem>
              <SelectItem value="sunset">Sunset Warm</SelectItem>
              <SelectItem value="desert">Desert Gold</SelectItem>
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
        <div className="flex items-end">
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
        <Label className="text-sm font-medium">Style Preview</Label>
        <div className="grid grid-cols-6 gap-3">
          {(['nature', 'mountain', 'forest', 'ocean', 'sunset', 'desert'] as const).map((style) => (
            <button
              key={style}
              onClick={() => updateOption('backgroundStyle', style)}
              className={`aspect-square rounded-xl border-2 transition-all ${
                options.backgroundStyle === style
                  ? 'border-primary shadow-glow glass-effect'
                  : 'border-border hover:border-primary/50 hover:glass-effect'
              }`}
            >
              <div
                className={`w-full h-full rounded-md ${getStylePreviewClass(style, options.colorScheme)}`}
              />
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
};

function getStylePreviewClass(style: string, colorScheme: string): string {
  const baseClasses = {
    nature: 'from-green-900 to-amber-500',
    mountain: 'from-gray-800 to-gray-400', 
    forest: 'from-green-900 to-green-600',
    ocean: 'from-blue-900 to-cyan-500',
    sunset: 'from-orange-800 to-amber-500',
    desert: 'from-yellow-800 to-amber-400'
  };

  switch (style) {
    case 'nature':
      return `bg-gradient-to-br ${baseClasses[colorScheme as keyof typeof baseClasses]}`;
    case 'mountain':
      return `bg-gradient-to-t ${baseClasses[colorScheme as keyof typeof baseClasses]}`;
    case 'forest':
      return `bg-gradient-to-br ${baseClasses[colorScheme as keyof typeof baseClasses]}`;
    case 'ocean':
      return `bg-gradient-to-br ${baseClasses[colorScheme as keyof typeof baseClasses]}`;
    case 'sunset':
      return `bg-gradient-to-r ${baseClasses[colorScheme as keyof typeof baseClasses]}`;
    case 'desert':
      return `bg-gradient-to-br ${baseClasses[colorScheme as keyof typeof baseClasses]}`;
    default:
      return `bg-gradient-to-br ${baseClasses.nature}`;
  }
}

export default WallpaperCustomizer;
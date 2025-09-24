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
    <Card className="p-6 space-y-6 bg-gradient-subtle border-primary/10">
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
              <SelectItem value="gradient">Gradient</SelectItem>
              <SelectItem value="geometric">Islamic Geometric</SelectItem>
              <SelectItem value="nature">Nature Inspired</SelectItem>
              <SelectItem value="solid">Solid Color</SelectItem>
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
              <SelectItem value="emerald">Emerald & Gold</SelectItem>
              <SelectItem value="teal">Teal & Ocean</SelectItem>
              <SelectItem value="gold">Gold & Amber</SelectItem>
              <SelectItem value="navy">Navy & Silver</SelectItem>
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
            className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground"
            size="lg"
          >
            {isGenerating ? "Generating..." : "Generate Preview"}
          </Button>
        </div>
      </div>

      {/* Style Preview */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Style Preview</Label>
        <div className="grid grid-cols-4 gap-3">
          {(['gradient', 'geometric', 'nature', 'solid'] as const).map((style) => (
            <button
              key={style}
              onClick={() => updateOption('backgroundStyle', style)}
              className={`aspect-square rounded-lg border-2 transition-all ${
                options.backgroundStyle === style
                  ? 'border-primary shadow-glow'
                  : 'border-border hover:border-primary/50'
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
    emerald: 'from-emerald-900 to-amber-500',
    teal: 'from-teal-900 to-teal-500',
    gold: 'from-amber-800 to-amber-400',
    navy: 'from-blue-900 to-blue-600'
  };

  switch (style) {
    case 'gradient':
      return `bg-gradient-to-br ${baseClasses[colorScheme as keyof typeof baseClasses]}`;
    case 'geometric':
      return `bg-gradient-to-br ${baseClasses[colorScheme as keyof typeof baseClasses]} opacity-90`;
    case 'nature':
      return `bg-radial-gradient ${baseClasses[colorScheme as keyof typeof baseClasses]}`;
    case 'solid':
      return `bg-gradient-to-r ${baseClasses[colorScheme as keyof typeof baseClasses]} bg-blend-multiply`;
    default:
      return `bg-gradient-to-br ${baseClasses.emerald}`;
  }
}

export default WallpaperCustomizer;
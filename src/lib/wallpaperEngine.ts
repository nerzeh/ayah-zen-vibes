import { Verse } from '@/hooks/useVerses';

export interface WallpaperOptions {
  backgroundType: 'mountain_valley' | 'sunset_water' | 'starry_night' | 'desert_dunes' | 'forest_path' | 'ocean_cliffs';
  width: number;
  height: number;
}

export class WallpaperGenerator {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    const context = this.canvas.getContext('2d');
    if (!context) {
      throw new Error('Could not get canvas context');
    }
    this.ctx = context;
  }

  async generateWallpaper(
    verse: Verse,
    options: WallpaperOptions
  ): Promise<Blob> {
    // Set canvas dimensions
    this.canvas.width = options.width;
    this.canvas.height = options.height;

    // Clear canvas
    this.ctx.clearRect(0, 0, options.width, options.height);

    // Generate background
    await this.generateBackground(options);

    // Render text content
    await this.renderText(verse, options);

    // Convert to blob
    return new Promise((resolve, reject) => {
      this.canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to generate wallpaper blob'));
        }
      }, 'image/png', 1.0);
    });
  }

  private async generateBackground(options: WallpaperOptions): Promise<void> {
    const { width, height, backgroundType } = options;

    try {
      // Generate AI background image
      const backgroundImage = await this.generateAINatureBackground(backgroundType);
      
      // Draw the background image
      this.ctx.drawImage(backgroundImage, 0, 0, width, height);
      
      // Add subtle overlay for better text readability
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      this.ctx.fillRect(0, 0, width, height);
      
    } catch (error) {
      console.error('Failed to generate AI background, using fallback:', error);
      // Fallback to simple gradient
      this.generateFallbackBackground(width, height, backgroundType);
    }
  }

  private async generateAINatureBackground(backgroundType: string): Promise<HTMLImageElement> {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    const response = await fetch(`${supabaseUrl}/functions/v1/generate-nature-background`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ backgroundType }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = data.image;
    });
  }

  private generateFallbackBackground(width: number, height: number, backgroundType: string): void {
    const gradient = this.ctx.createLinearGradient(0, 0, 0, height);
    
    switch (backgroundType) {
      case 'mountain_valley':
        gradient.addColorStop(0, 'hsl(210, 60%, 20%)');
        gradient.addColorStop(0.3, 'hsl(150, 40%, 30%)');
        gradient.addColorStop(0.7, 'hsl(120, 60%, 40%)');
        gradient.addColorStop(1, 'hsl(90, 80%, 50%)');
        break;
      case 'sunset_water':
        gradient.addColorStop(0, 'hsl(25, 90%, 55%)');
        gradient.addColorStop(0.5, 'hsl(45, 90%, 55%)');
        gradient.addColorStop(1, 'hsl(220, 60%, 20%)');
        break;
      case 'starry_night':
        gradient.addColorStop(0, 'hsl(220, 60%, 8%)');
        gradient.addColorStop(0.4, 'hsl(220, 50%, 12%)');
        gradient.addColorStop(1, 'hsl(220, 40%, 15%)');
        break;
      case 'desert_dunes':
        gradient.addColorStop(0, 'hsl(45, 80%, 70%)');
        gradient.addColorStop(0.5, 'hsl(35, 85%, 60%)');
        gradient.addColorStop(1, 'hsl(25, 90%, 50%)');
        break;
      case 'forest_path':
        gradient.addColorStop(0, 'hsl(120, 40%, 20%)');
        gradient.addColorStop(0.5, 'hsl(110, 50%, 30%)');
        gradient.addColorStop(1, 'hsl(100, 60%, 40%)');
        break;
      case 'ocean_cliffs':
        gradient.addColorStop(0, 'hsl(210, 70%, 40%)');
        gradient.addColorStop(0.5, 'hsl(200, 80%, 50%)');
        gradient.addColorStop(1, 'hsl(190, 90%, 60%)');
        break;
      default:
        gradient.addColorStop(0, 'hsl(210, 60%, 20%)');
        gradient.addColorStop(0.5, 'hsl(150, 40%, 30%)');
        gradient.addColorStop(1, 'hsl(120, 60%, 40%)');
    }

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, width, height);
  }


  private async renderText(verse: Verse, options: WallpaperOptions): Promise<void> {
    const { width, height } = options;
    
    // Calculate responsive font sizes based on screen dimensions
    const baseFontSize = Math.min(width, height) / 25;
    const arabicFontSize = baseFontSize * 1.6;
    const translationFontSize = baseFontSize * 0.85;
    const referenceFontSize = baseFontSize * 0.65;

    // Layout calculations
    const topMargin = height * 0.15;
    const bottomMargin = height * 0.15;
    const textSpacing = baseFontSize * 0.6;

    // Set text properties with enhanced styling
    this.ctx.textAlign = 'center';
    this.ctx.fillStyle = '#ffffff';
    
    // Enhanced text shadow for Islamic calligraphy effect
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    this.ctx.shadowBlur = 6;
    this.ctx.shadowOffsetX = 3;
    this.ctx.shadowOffsetY = 3;

    let currentY = topMargin + arabicFontSize;

    // Render Arabic text with Islamic calligraphy font
    this.ctx.font = `${arabicFontSize}px "Amiri", "Scheherazade New", serif`;
    this.ctx.textBaseline = 'middle';
    
    const arabicLines = this.wrapText(verse.arabic_text, width * 0.85, arabicFontSize);
    
    for (const line of arabicLines) {
      // Add golden glow for Arabic text
      this.ctx.shadowColor = 'rgba(212, 175, 55, 0.5)';
      this.ctx.shadowBlur = 12;
      this.ctx.fillText(line, width / 2, currentY);
      currentY += arabicFontSize * 1.4;
    }

    currentY += textSpacing * 2;

    // Render English translation with elegant styling
    this.ctx.font = `${translationFontSize}px "Inter", sans-serif`;
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    this.ctx.shadowBlur = 4;
    
    const translationLines = this.wrapText(`"${verse.english_translation}"`, width * 0.9, translationFontSize);
    
    for (const line of translationLines) {
      this.ctx.fillText(line, width / 2, currentY);
      currentY += translationFontSize * 1.4;
    }

    // Add decorative separator
    currentY += textSpacing;
    this.drawDecorativeSeparator(width / 2, currentY, width * 0.3);
    currentY += textSpacing * 1.5;

    // Render reference with golden accent
    this.ctx.font = `${referenceFontSize}px "Inter", sans-serif`;
    this.ctx.fillStyle = 'hsl(45, 90%, 70%)';
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    this.ctx.shadowBlur = 3;
    
    this.ctx.fillText(
      `Surah ${verse.surah_number}:${verse.ayah_number}`,
      width / 2,
      height - bottomMargin
    );

    // Reset shadow
    this.ctx.shadowColor = 'transparent';
    this.ctx.shadowBlur = 0;
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 0;
  }

  private drawDecorativeSeparator(centerX: number, centerY: number, width: number): void {
    this.ctx.strokeStyle = 'rgba(212, 175, 55, 0.6)';
    this.ctx.lineWidth = 2;
    this.ctx.shadowColor = 'rgba(212, 175, 55, 0.3)';
    this.ctx.shadowBlur = 4;

    // Draw ornamental line with Islamic motifs
    this.ctx.beginPath();
    this.ctx.moveTo(centerX - width/2, centerY);
    this.ctx.lineTo(centerX - 20, centerY);
    
    // Center ornament (stylized flower/star)
    this.drawCenterOrnament(centerX, centerY, 8);
    
    this.ctx.moveTo(centerX + 20, centerY);
    this.ctx.lineTo(centerX + width/2, centerY);
    this.ctx.stroke();
  }

  private drawCenterOrnament(x: number, y: number, size: number): void {
    this.ctx.fillStyle = 'rgba(212, 175, 55, 0.8)';
    
    // Draw small decorative star
    this.ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const radius = i % 2 === 0 ? size : size * 0.5;
      const px = x + Math.cos(angle) * radius;
      const py = y + Math.sin(angle) * radius;
      
      if (i === 0) this.ctx.moveTo(px, py);
      else this.ctx.lineTo(px, py);
    }
    this.ctx.closePath();
    this.ctx.fill();
  }

  private wrapText(text: string, maxWidth: number, fontSize: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = this.ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    
    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  }

  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }
}

// Utility function to get device screen dimensions
export function getDeviceScreenDimensions(): { width: number; height: number } {
  // Get the device pixel ratio for high-DPI screens
  const devicePixelRatio = window.devicePixelRatio || 1;
  
  // Get screen dimensions
  const screenWidth = window.screen.width * devicePixelRatio;
  const screenHeight = window.screen.height * devicePixelRatio;
  
  // Ensure minimum dimensions for quality
  const minDimension = 1080;
  const width = Math.max(screenWidth, minDimension);
  const height = Math.max(screenHeight, minDimension);
  
  return { width, height };
}

// Utility function to download the generated wallpaper
export function downloadWallpaper(blob: Blob, filename: string = 'islamic-wallpaper.png'): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
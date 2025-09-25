import { Verse } from '@/hooks/useVerses';
import { PexelsService } from '@/services/pexelsService';

export interface WallpaperOptions {
  width: number;
  height: number;
  backgroundImage?: string;
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
    const { width, height, backgroundImage } = options;

    if (backgroundImage) {
      try {
        // Load image with dark overlay from Pexels service
        const overlayCanvas = await PexelsService.loadImageWithOverlay(backgroundImage);
        
        // Scale and draw the background image
        this.ctx.drawImage(overlayCanvas, 0, 0, width, height);
        
        // Add additional overlay for better text readability
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.fillRect(0, 0, width, height);
      } catch (error) {
        console.error('Failed to load background image:', error);
        // Fallback to gradient
        this.generateGradientBackground(width, height);
      }
    } else {
      this.generateGradientBackground(width, height);
    }
  }

  private generateGradientBackground(width: number, height: number): void {
    // Simple elegant gradient background
    const gradient = this.ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'hsl(210, 60%, 15%)');
    gradient.addColorStop(0.5, 'hsl(220, 50%, 25%)');
    gradient.addColorStop(1, 'hsl(230, 40%, 35%)');

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, width, height);
    
    // Add subtle overlay for better text readability
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
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
import { Verse } from '@/hooks/useVerses';

export interface WallpaperOptions {
  backgroundStyle: 'gradient' | 'geometric' | 'nature' | 'solid';
  colorScheme: 'emerald' | 'teal' | 'gold' | 'navy';
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
    const { width, height, backgroundStyle, colorScheme } = options;

    switch (backgroundStyle) {
      case 'gradient':
        this.generateGradientBackground(width, height, colorScheme);
        break;
      case 'geometric':
        this.generateGeometricBackground(width, height, colorScheme);
        break;
      case 'nature':
        this.generateNatureBackground(width, height, colorScheme);
        break;
      case 'solid':
        this.generateSolidBackground(width, height, colorScheme);
        break;
    }
  }

  private generateGradientBackground(width: number, height: number, colorScheme: string): void {
    const gradient = this.ctx.createLinearGradient(0, 0, 0, height);
    
    switch (colorScheme) {
      case 'emerald':
        gradient.addColorStop(0, 'hsl(155, 85%, 15%)');
        gradient.addColorStop(0.5, 'hsl(155, 70%, 30%)');
        gradient.addColorStop(1, 'hsl(45, 100%, 55%)');
        break;
      case 'teal':
        gradient.addColorStop(0, 'hsl(180, 85%, 15%)');
        gradient.addColorStop(0.5, 'hsl(180, 70%, 30%)');
        gradient.addColorStop(1, 'hsl(180, 50%, 45%)');
        break;
      case 'gold':
        gradient.addColorStop(0, 'hsl(45, 85%, 25%)');
        gradient.addColorStop(0.5, 'hsl(45, 70%, 40%)');
        gradient.addColorStop(1, 'hsl(45, 100%, 60%)');
        break;
      case 'navy':
        gradient.addColorStop(0, 'hsl(220, 85%, 15%)');
        gradient.addColorStop(0.5, 'hsl(220, 70%, 25%)');
        gradient.addColorStop(1, 'hsl(220, 60%, 35%)');
        break;
    }

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, width, height);
  }

  private generateGeometricBackground(width: number, height: number, colorScheme: string): void {
    // First create the gradient base
    this.generateGradientBackground(width, height, colorScheme);

    // Add geometric patterns
    this.ctx.globalAlpha = 0.1;
    this.ctx.fillStyle = '#ffffff';

    const patternSize = Math.min(width, height) / 15;
    
    // Draw diamond pattern
    for (let x = 0; x < width + patternSize; x += patternSize * 2) {
      for (let y = 0; y < height + patternSize; y += patternSize * 2) {
        this.drawDiamond(x, y, patternSize / 2);
        this.drawDiamond(x + patternSize, y + patternSize, patternSize / 2);
      }
    }

    this.ctx.globalAlpha = 1;
  }

  private drawDiamond(x: number, y: number, size: number): void {
    this.ctx.beginPath();
    this.ctx.moveTo(x, y - size);
    this.ctx.lineTo(x + size, y);
    this.ctx.lineTo(x, y + size);
    this.ctx.lineTo(x - size, y);
    this.ctx.closePath();
    this.ctx.fill();
  }

  private generateNatureBackground(width: number, height: number, colorScheme: string): void {
    // Create a nature-inspired gradient
    const gradient = this.ctx.createRadialGradient(width / 2, height / 3, 0, width / 2, height / 3, Math.max(width, height));
    
    switch (colorScheme) {
      case 'emerald':
        gradient.addColorStop(0, 'hsl(155, 60%, 40%)');
        gradient.addColorStop(0.7, 'hsl(155, 80%, 20%)');
        gradient.addColorStop(1, 'hsl(155, 90%, 10%)');
        break;
      case 'teal':
        gradient.addColorStop(0, 'hsl(180, 60%, 40%)');
        gradient.addColorStop(0.7, 'hsl(180, 80%, 20%)');
        gradient.addColorStop(1, 'hsl(180, 90%, 10%)');
        break;
      case 'gold':
        gradient.addColorStop(0, 'hsl(45, 60%, 50%)');
        gradient.addColorStop(0.7, 'hsl(45, 80%, 30%)');
        gradient.addColorStop(1, 'hsl(45, 90%, 15%)');
        break;
      case 'navy':
        gradient.addColorStop(0, 'hsl(220, 60%, 35%)');
        gradient.addColorStop(0.7, 'hsl(220, 80%, 20%)');
        gradient.addColorStop(1, 'hsl(220, 90%, 10%)');
        break;
    }

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, width, height);

    // Add subtle texture
    this.ctx.globalAlpha = 0.05;
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const radius = Math.random() * 3;
      
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, Math.PI * 2);
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fill();
    }
    this.ctx.globalAlpha = 1;
  }

  private generateSolidBackground(width: number, height: number, colorScheme: string): void {
    let color: string;
    
    switch (colorScheme) {
      case 'emerald':
        color = 'hsl(155, 70%, 25%)';
        break;
      case 'teal':
        color = 'hsl(180, 70%, 25%)';
        break;
      case 'gold':
        color = 'hsl(45, 70%, 35%)';
        break;
      case 'navy':
        color = 'hsl(220, 70%, 20%)';
        break;
      default:
        color = 'hsl(155, 70%, 25%)';
    }

    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, width, height);
  }

  private async renderText(verse: Verse, options: WallpaperOptions): Promise<void> {
    const { width, height } = options;
    
    // Calculate responsive font sizes based on screen dimensions
    const baseFontSize = Math.min(width, height) / 25;
    const arabicFontSize = baseFontSize * 1.4;
    const translationFontSize = baseFontSize * 0.8;
    const referenceFontSize = baseFontSize * 0.6;

    // Layout calculations
    const topMargin = height * 0.2;
    const bottomMargin = height * 0.2;
    const contentHeight = height - topMargin - bottomMargin;
    const textSpacing = baseFontSize * 0.5;

    // Set text properties
    this.ctx.textAlign = 'center';
    this.ctx.fillStyle = '#ffffff';
    
    // Add text shadow for better readability
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    this.ctx.shadowBlur = 4;
    this.ctx.shadowOffsetX = 2;
    this.ctx.shadowOffsetY = 2;

    let currentY = topMargin;

    // Render Arabic text
    this.ctx.font = `bold ${arabicFontSize}px serif`;
    const arabicLines = this.wrapText(verse.arabic_text, width * 0.8, arabicFontSize);
    
    for (const line of arabicLines) {
      this.ctx.fillText(line, width / 2, currentY);
      currentY += arabicFontSize * 1.3;
    }

    currentY += textSpacing * 2;

    // Render English translation
    this.ctx.font = `${translationFontSize}px sans-serif`;
    const translationLines = this.wrapText(`"${verse.english_translation}"`, width * 0.85, translationFontSize);
    
    for (const line of translationLines) {
      this.ctx.fillText(line, width / 2, currentY);
      currentY += translationFontSize * 1.3;
    }

    // Render reference at bottom
    this.ctx.font = `${referenceFontSize}px sans-serif`;
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    this.ctx.fillText(
      `Surah ${verse.surah_number}:${verse.ayah_number}`,
      width / 2,
      height - bottomMargin / 2
    );

    // Reset shadow
    this.ctx.shadowColor = 'transparent';
    this.ctx.shadowBlur = 0;
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 0;
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
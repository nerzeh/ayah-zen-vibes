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
    
    // More conservative margins for different aspect ratios
    const topMargin = height * 0.08;
    const bottomMargin = height * 0.08;
    const availableHeight = height - topMargin - bottomMargin;
    const availableWidth = width * 0.9; // More generous width for text

    // Calculate responsive base font size
    const aspectRatio = width / height;
    let baseFontSize: number;
    
    if (aspectRatio > 1.5) {
      // Wide format (desktop)
      baseFontSize = Math.min(width, height) / 35;
    } else if (aspectRatio < 0.8) {
      // Tall format (mobile portrait)
      baseFontSize = Math.min(width, height) / 45;
    } else {
      // Square or balanced format
      baseFontSize = Math.min(width, height) / 40;
    }

    // Initial font size ratios
    let arabicFontSize = baseFontSize * 1.8;
    let translationFontSize = baseFontSize * 1.0;
    let referenceFontSize = baseFontSize * 0.8;

    // Set text properties
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    // Text fitting algorithm with more iterations
    let attempts = 0;
    let arabicLines: string[];
    let translationLines: string[];
    let totalTextHeight: number;
    const maxAttempts = 10;

    do {
      // Calculate text spacing based on current font sizes
      const textSpacing = Math.max(arabicFontSize * 0.4, 10);
      
      // Get text lines with current font sizes
      this.ctx.font = `${arabicFontSize}px "Amiri", "Scheherazade New", serif`;
      arabicLines = this.wrapText(verse.arabic_text, availableWidth, arabicFontSize);
      
      this.ctx.font = `${translationFontSize}px "Inter", sans-serif`;
      translationLines = this.wrapText(`"${verse.translated_text || verse.english_translation}"`, availableWidth, translationFontSize);

      // Calculate heights for each section
      const arabicHeight = arabicLines.length * arabicFontSize * 1.3;
      const translationHeight = translationLines.length * translationFontSize * 1.3;
      const referenceHeight = referenceFontSize * 1.2;
      const decorativeHeight = textSpacing * 2; // Space for separator
      
      // Total spacing between sections
      const sectionSpacing = textSpacing * 3; // Between Arabic, translation, and reference
      
      totalTextHeight = arabicHeight + translationHeight + referenceHeight + decorativeHeight + sectionSpacing;

      // If text doesn't fit, scale down more aggressively
      if (totalTextHeight > availableHeight && attempts < maxAttempts) {
        const scaleFactor = Math.max(0.8, Math.sqrt(availableHeight / totalTextHeight));
        arabicFontSize *= scaleFactor;
        translationFontSize *= scaleFactor;
        referenceFontSize *= scaleFactor;
        attempts++;
      } else {
        break;
      }
    } while (attempts < maxAttempts);

    // Ensure minimum font sizes for readability
    arabicFontSize = Math.max(arabicFontSize, 12);
    translationFontSize = Math.max(translationFontSize, 10);
    referenceFontSize = Math.max(referenceFontSize, 8);

    // Calculate final spacing
    const finalSpacing = Math.max(arabicFontSize * 0.4, 8);

    // Position text vertically centered
    let currentY = topMargin + (availableHeight - totalTextHeight) / 2;

    // Enhanced text shadow for Islamic calligraphy effect
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    this.ctx.shadowBlur = 6;
    this.ctx.shadowOffsetX = 2;
    this.ctx.shadowOffsetY = 2;

    // Render Arabic text
    this.ctx.font = `${arabicFontSize}px "Amiri", "Scheherazade New", serif`;
    this.ctx.fillStyle = '#ffffff';
    
    currentY += arabicFontSize * 0.7; // Start position adjustment
    
    for (const line of arabicLines) {
      // Add golden glow for Arabic text
      this.ctx.shadowColor = 'rgba(212, 175, 55, 0.6)';
      this.ctx.shadowBlur = 8;
      this.ctx.fillText(line, width / 2, currentY);
      currentY += arabicFontSize * 1.3;
    }

    currentY += finalSpacing * 1.5;

    // Render English translation
    this.ctx.font = `${translationFontSize}px "Inter", sans-serif`;
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    this.ctx.shadowBlur = 4;
    
    for (const line of translationLines) {
      this.ctx.fillText(line, width / 2, currentY);
      currentY += translationFontSize * 1.3;
    }

    // Add decorative separator
    currentY += finalSpacing;
    this.drawDecorativeSeparator(width / 2, currentY, Math.min(width * 0.3, 200));
    currentY += finalSpacing * 1.2;

    // Render reference
    this.ctx.font = `${referenceFontSize}px "Inter", sans-serif`;
    this.ctx.fillStyle = 'hsl(45, 90%, 75%)';
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    this.ctx.shadowBlur = 3;
    
    this.ctx.fillText(
      `Surah ${verse.surah_number}:${verse.ayah_number}`,
      width / 2,
      currentY
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
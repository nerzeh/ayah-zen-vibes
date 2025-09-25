import { Verse } from '@/hooks/useVerses';

export interface WallpaperOptions {
  backgroundStyle: 'nature' | 'mountain' | 'forest' | 'ocean' | 'sunset' | 'desert';
  colorScheme: 'nature' | 'mountain' | 'forest' | 'ocean' | 'sunset' | 'desert';
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
      case 'nature':
        this.generateMosqueBackground(width, height, colorScheme);
        break;
      case 'mountain':
        this.generateIslamicGeometric(width, height, colorScheme);
        break;
      case 'forest':
        this.generateArabesqueBackground(width, height, colorScheme);
        break;
      case 'ocean':
        this.generateCalligraphyBackground(width, height, colorScheme);
        break;
      case 'sunset':
        this.generateNightSkyBackground(width, height, colorScheme);
        break;
      case 'desert':
        this.generateCrescentBackground(width, height, colorScheme);
        break;
    }
  }

  private generateMosqueBackground(width: number, height: number, colorScheme: string): void {
    const gradient = this.ctx.createLinearGradient(0, 0, 0, height);
    
    switch (colorScheme) {
      case 'emerald':
        gradient.addColorStop(0, 'hsl(155, 85%, 15%)');
        gradient.addColorStop(0.3, 'hsl(155, 75%, 20%)');
        gradient.addColorStop(0.7, 'hsl(155, 65%, 35%)');
        gradient.addColorStop(1, 'hsl(45, 90%, 55%)');
        break;
      case 'gold':
        gradient.addColorStop(0, 'hsl(45, 80%, 25%)');
        gradient.addColorStop(0.5, 'hsl(45, 85%, 40%)');
        gradient.addColorStop(1, 'hsl(45, 95%, 65%)');
        break;
      case 'midnight':
        gradient.addColorStop(0, 'hsl(220, 60%, 10%)');
        gradient.addColorStop(0.4, 'hsl(220, 50%, 15%)');
        gradient.addColorStop(0.8, 'hsl(155, 60%, 25%)');
        gradient.addColorStop(1, 'hsl(45, 90%, 55%)');
        break;
      case 'sunset':
        gradient.addColorStop(0, 'hsl(25, 90%, 55%)');
        gradient.addColorStop(0.5, 'hsl(45, 90%, 55%)');
        gradient.addColorStop(1, 'hsl(155, 85%, 15%)');
        break;
      case 'royal':
        gradient.addColorStop(0, 'hsl(260, 80%, 20%)');
        gradient.addColorStop(0.5, 'hsl(155, 85%, 15%)');
        gradient.addColorStop(1, 'hsl(45, 90%, 55%)');
        break;
    }

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, width, height);

    // Add subtle mosque silhouette
    this.drawMosqueSilhouette(width, height);
  }

  private drawMosqueSilhouette(width: number, height: number): void {
    this.ctx.globalAlpha = 0.1;
    this.ctx.fillStyle = '#000000';

    const centerX = width / 2;
    const baseY = height * 0.85;
    const domeRadius = width * 0.15;

    // Main dome
    this.ctx.beginPath();
    this.ctx.arc(centerX, baseY - domeRadius, domeRadius, 0, Math.PI, true);
    this.ctx.fill();

    // Minaret
    const minaretWidth = width * 0.03;
    const minaretHeight = height * 0.4;
    this.ctx.fillRect(centerX + domeRadius, baseY - minaretHeight, minaretWidth, minaretHeight);

    // Crescent on minaret
    this.ctx.beginPath();
    this.ctx.arc(centerX + domeRadius + minaretWidth/2, baseY - minaretHeight, minaretWidth/2, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.globalAlpha = 1;
  }

  private generateIslamicGeometric(width: number, height: number, colorScheme: string): void {
    this.generateMosqueBackground(width, height, colorScheme);

    this.ctx.globalAlpha = 0.15;
    this.ctx.fillStyle = '#ffffff';

    const size = Math.min(width, height) / 12;
    
    // Draw Islamic star pattern
    for (let x = 0; x < width; x += size * 2) {
      for (let y = 0; y < height; y += size * 2) {
        this.drawIslamicStar(x + size, y + size, size * 0.4);
      }
    }

    this.ctx.globalAlpha = 1;
  }

  private drawIslamicStar(centerX: number, centerY: number, radius: number): void {
    const points = 8;
    const innerRadius = radius * 0.5;
    
    this.ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const angle = (i * Math.PI) / points;
      const r = i % 2 === 0 ? radius : innerRadius;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;
      
      if (i === 0) this.ctx.moveTo(x, y);
      else this.ctx.lineTo(x, y);
    }
    this.ctx.closePath();
    this.ctx.fill();
  }

  private generateArabesqueBackground(width: number, height: number, colorScheme: string): void {
    const gradient = this.ctx.createRadialGradient(width * 0.3, height * 0.3, 0, width * 0.7, height * 0.7, Math.max(width, height));
    
    switch (colorScheme) {
      case 'emerald':
        gradient.addColorStop(0, 'hsl(155, 70%, 25%)');
        gradient.addColorStop(0.6, 'hsl(155, 85%, 15%)');
        gradient.addColorStop(1, 'hsl(155, 90%, 8%)');
        break;
      case 'gold':
        gradient.addColorStop(0, 'hsl(45, 85%, 50%)');
        gradient.addColorStop(0.6, 'hsl(45, 90%, 35%)');
        gradient.addColorStop(1, 'hsl(45, 95%, 20%)');
        break;
      default:
        gradient.addColorStop(0, 'hsl(155, 70%, 25%)');
        gradient.addColorStop(0.6, 'hsl(155, 85%, 15%)');
        gradient.addColorStop(1, 'hsl(155, 90%, 8%)');
    }

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, width, height);

    // Add arabesque pattern
    this.drawArabesquePattern(width, height);
  }

  private drawArabesquePattern(width: number, height: number): void {
    this.ctx.globalAlpha = 0.08;
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 2;

    const spacing = Math.min(width, height) / 8;
    
    for (let x = spacing; x < width; x += spacing) {
      for (let y = spacing; y < height; y += spacing) {
        this.drawArabesqueMotif(x, y, spacing * 0.3);
      }
    }

    this.ctx.globalAlpha = 1;
  }

  private drawArabesqueMotif(x: number, y: number, size: number): void {
    this.ctx.beginPath();
    
    // Draw flowing curves typical of arabesque
    this.ctx.moveTo(x - size, y);
    this.ctx.bezierCurveTo(x - size/2, y - size, x + size/2, y - size, x + size, y);
    this.ctx.bezierCurveTo(x + size/2, y + size, x - size/2, y + size, x - size, y);
    
    // Add decorative swirls
    this.ctx.moveTo(x, y - size/2);
    this.ctx.bezierCurveTo(x + size/3, y - size/3, x + size/3, y + size/3, x, y + size/2);
    
    this.ctx.stroke();
  }

  private generateCalligraphyBackground(width: number, height: number, colorScheme: string): void {
    this.generateMosqueBackground(width, height, colorScheme);

    // Add subtle calligraphy-inspired flowing lines
    this.ctx.globalAlpha = 0.06;
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 3;

    for (let i = 0; i < 5; i++) {
      const startX = (width / 6) * (i + 1);
      const startY = height * 0.2;
      const endY = height * 0.8;

      this.ctx.beginPath();
      this.ctx.moveTo(startX, startY);
      
      for (let y = startY; y < endY; y += 20) {
        const wave = Math.sin((y - startY) / 100) * 30;
        this.ctx.lineTo(startX + wave, y);
      }
      
      this.ctx.stroke();
    }

    this.ctx.globalAlpha = 1;
  }

  private generateNightSkyBackground(width: number, height: number, colorScheme: string): void {
    const gradient = this.ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'hsl(220, 60%, 8%)');
    gradient.addColorStop(0.4, 'hsl(220, 50%, 12%)');
    gradient.addColorStop(0.8, 'hsl(220, 40%, 15%)');
    gradient.addColorStop(1, 'hsl(155, 30%, 20%)');

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, width, height);

    // Add stars
    this.drawStars(width, height);
    
    // Add crescent moon
    this.drawCrescent(width * 0.8, height * 0.2, width * 0.08);
  }

  private drawStars(width: number, height: number): void {
    this.ctx.fillStyle = '#ffffff';
    
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height * 0.7; // Keep stars in upper portion
      const radius = Math.random() * 2;
      
      this.ctx.globalAlpha = Math.random() * 0.8 + 0.2;
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    this.ctx.globalAlpha = 1;
  }

  private drawCrescent(x: number, y: number, radius: number): void {
    this.ctx.fillStyle = 'hsl(45, 90%, 75%)';
    this.ctx.globalAlpha = 0.9;
    
    // Draw outer circle
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Cut out inner circle to create crescent
    this.ctx.globalCompositeOperation = 'destination-out';
    this.ctx.beginPath();
    this.ctx.arc(x + radius * 0.3, y, radius * 0.8, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.globalAlpha = 1;
  }

  private generateCrescentBackground(width: number, height: number, colorScheme: string): void {
    const gradient = this.ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height) / 2);
    
    switch (colorScheme) {
      case 'emerald':
        gradient.addColorStop(0, 'hsl(155, 60%, 30%)');
        gradient.addColorStop(0.7, 'hsl(155, 80%, 15%)');
        gradient.addColorStop(1, 'hsl(155, 90%, 8%)');
        break;
      case 'gold':
        gradient.addColorStop(0, 'hsl(45, 70%, 40%)');
        gradient.addColorStop(0.7, 'hsl(45, 85%, 25%)');
        gradient.addColorStop(1, 'hsl(45, 95%, 15%)');
        break;
      default:
        gradient.addColorStop(0, 'hsl(155, 60%, 30%)');
        gradient.addColorStop(0.7, 'hsl(155, 80%, 15%)');
        gradient.addColorStop(1, 'hsl(155, 90%, 8%)');
    }

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, width, height);

    // Add large decorative crescent
    const centerX = width * 0.75;
    const centerY = height * 0.3;
    const crescentRadius = Math.min(width, height) * 0.2;
    
    this.ctx.globalAlpha = 0.1;
    this.drawCrescent(centerX, centerY, crescentRadius);
    this.ctx.globalAlpha = 1;
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
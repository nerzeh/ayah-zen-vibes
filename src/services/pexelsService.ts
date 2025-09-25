const PEXELS_API_KEY = "h4WLwBnvHXo7esORBwXu3xbbq3bmalmiZVOCrynA4EVj1kuWHyDrhfL8";
const PEXELS_BASE_URL = "https://api.pexels.com/v1";

export interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  liked: boolean;
  alt: string;
}

export interface PexelsSearchResponse {
  page: number;
  per_page: number;
  photos: PexelsPhoto[];
  total_results: number;
  next_page?: string;
}

export class PexelsService {
  private static readonly FILTERED_KEYWORDS = [
    // People and humans
    'people', 'person', 'man', 'woman', 'child', 'children', 'human', 'face', 'portrait',
    'boy', 'girl', 'male', 'female', 'adult', 'tourist', 'tourists', 'couple', 'couples',
    'family', 'group', 'crowd', 'silhouette', 'silhouettes', 'wedding', 'bride', 'groom',
    'dancer', 'dancing', 'walker', 'walking', 'runner', 'running', 'standing', 'sitting',
    
    // Text and writing
    'text', 'writing', 'sign', 'letter', 'word', 'alphabet', 'calligraphy',
    
    // Animals and wildlife
    'animal', 'animals', 'bird', 'birds', 'cat', 'cats', 'dog', 'dogs', 'wildlife', 'pet', 'pets',
    'horse', 'horses', 'cow', 'cows', 'sheep', 'goat', 'lion', 'elephant', 'tiger', 'deer',
    'fish', 'whale', 'dolphin', 'shark', 'eagle', 'owl', 'rabbit', 'fox', 'bear', 'wolf',
    'butterfly', 'bee', 'spider', 'snake', 'camel', 'camels', 'flamingo', 'seagull',
    
    // Statues and monuments
    'statue', 'statues', 'sculpture', 'monument', 'bust'
  ];

  private static readonly SEARCH_QUERIES = [
    'nature landscape', 
    'islamic architecture', 
    'mosque silhouette',
    'peaceful landscape',
    'sunset mountains',
    'ocean waves',
    'desert dunes',
    'forest path',
    'night sky stars'
  ];

  static async searchBackgrounds(query?: string, page: number = 1): Promise<PexelsPhoto[]> {
    try {
      const searchQuery = query || this.getRandomQuery();
      const response = await fetch(`${PEXELS_BASE_URL}/search?query=${encodeURIComponent(searchQuery)}&per_page=20&page=${page}`, {
        headers: {
          'Authorization': PEXELS_API_KEY
        }
      });

      if (!response.ok) {
        throw new Error(`Pexels API error: ${response.status}`);
      }

      const data: PexelsSearchResponse = await response.json();
      return this.filterPhotos(data.photos);
    } catch (error) {
      console.error('Error fetching Pexels photos:', error);
      return [];
    }
  }

  private static getRandomQuery(): string {
    return this.SEARCH_QUERIES[Math.floor(Math.random() * this.SEARCH_QUERIES.length)];
  }

  private static filterPhotos(photos: PexelsPhoto[]): PexelsPhoto[] {
    return photos.filter(photo => {
      const alt = photo.alt.toLowerCase();
      return !this.FILTERED_KEYWORDS.some(keyword => alt.includes(keyword));
    });
  }

  static async loadImageWithOverlay(imageUrl: string): Promise<HTMLCanvasElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the image
        ctx.drawImage(img, 0, 0);

        // Apply dark overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        resolve(canvas);
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = imageUrl;
    });
  }
}
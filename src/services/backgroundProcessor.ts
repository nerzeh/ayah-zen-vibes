import { WallpaperGenerator, getDeviceScreenDimensions, WallpaperOptions } from '@/lib/wallpaperEngine';
import { Verse } from '@/hooks/useVerses';
import { notificationService } from './notificationService';

export interface ProcessingJob {
  id: string;
  type: 'wallpaper' | 'widget' | 'notification';
  verse: Verse;
  options?: WallpaperOptions;
  priority: 'high' | 'normal' | 'low';
  createdAt: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: any;
  error?: string;
}

export class BackgroundProcessor {
  private static instance: BackgroundProcessor;
  private jobQueue: ProcessingJob[] = [];
  private isProcessing = false;
  private maxConcurrentJobs = 2;
  private worker: Worker | null = null;

  private constructor() {
    this.initializeWorker();
    this.startProcessing();
  }

  public static getInstance(): BackgroundProcessor {
    if (!BackgroundProcessor.instance) {
      BackgroundProcessor.instance = new BackgroundProcessor();
    }
    return BackgroundProcessor.instance;
  }

  private initializeWorker() {
    if (typeof Worker !== 'undefined') {
      try {
        // Create inline worker for wallpaper processing
        const workerCode = `
          self.onmessage = function(e) {
            const { type, data } = e.data;
            
            if (type === 'PROCESS_WALLPAPER') {
              // Simulate processing time
              setTimeout(() => {
                self.postMessage({
                  type: 'WALLPAPER_COMPLETE',
                  jobId: data.jobId,
                  result: { processed: true, timestamp: Date.now() }
                });
              }, 1000);
            }
          };
        `;
        
        const blob = new Blob([workerCode], { type: 'application/javascript' });
        this.worker = new Worker(URL.createObjectURL(blob));
        
        this.worker.onmessage = (e) => {
          this.handleWorkerMessage(e);
        };
        
        console.log('Background processor worker initialized');
      } catch (error) {
        console.warn('Web Worker not supported, falling back to main thread');
      }
    }
  }

  private handleWorkerMessage(event: MessageEvent) {
    const { type, jobId, result, error } = event.data;
    
    const job = this.jobQueue.find(j => j.id === jobId);
    if (!job) return;

    if (type === 'WALLPAPER_COMPLETE') {
      job.status = 'completed';
      job.result = result;
    } else if (type === 'WALLPAPER_ERROR') {
      job.status = 'failed';
      job.error = error;
    }

    this.processNext();
  }

  public addJob(job: Omit<ProcessingJob, 'id' | 'createdAt' | 'status'>): string {
    const fullJob: ProcessingJob = {
      ...job,
      id: this.generateJobId(),
      createdAt: new Date(),
      status: 'pending'
    };

    // Insert job based on priority
    const insertIndex = this.jobQueue.findIndex(j => 
      j.priority === 'low' && fullJob.priority !== 'low'
    );
    
    if (insertIndex === -1) {
      this.jobQueue.push(fullJob);
    } else {
      this.jobQueue.splice(insertIndex, 0, fullJob);
    }

    this.startProcessing();
    return fullJob.id;
  }

  public addWallpaperJob(verse: Verse, options?: Partial<WallpaperOptions>, priority: 'high' | 'normal' | 'low' = 'normal'): string {
    const dimensions = getDeviceScreenDimensions();
    const wallpaperOptions: WallpaperOptions = {
      width: dimensions.width,
      height: dimensions.height,
      ...options
    };

    return this.addJob({
      type: 'wallpaper',
      verse,
      options: wallpaperOptions,
      priority
    });
  }

  public addNotificationJob(verse: Verse, priority: 'high' | 'normal' | 'low' = 'normal'): string {
    return this.addJob({
      type: 'notification',
      verse,
      priority
    });
  }

  private async startProcessing() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    while (this.jobQueue.length > 0) {
      const pendingJobs = this.jobQueue.filter(j => j.status === 'pending');
      if (pendingJobs.length === 0) break;

      const job = pendingJobs[0];
      await this.processJob(job);
    }

    this.isProcessing = false;
  }

  private async processJob(job: ProcessingJob) {
    job.status = 'processing';
    
    try {
      switch (job.type) {
        case 'wallpaper':
          await this.processWallpaperJob(job);
          break;
        case 'notification':
          await this.processNotificationJob(job);
          break;
        case 'widget':
          await this.processWidgetJob(job);
          break;
      }
      
      if (job.status === 'processing') {
        job.status = 'completed';
      }
    } catch (error) {
      job.status = 'failed';
      job.error = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Job ${job.id} failed:`, error);
    }
  }

  private async processWallpaperJob(job: ProcessingJob) {
    if (!job.options) {
      throw new Error('Wallpaper options not provided');
    }

    const generator = new WallpaperGenerator();
    const wallpaperBlob = await generator.generateWallpaper(job.verse, job.options);
    
    // Cache the wallpaper
    const cacheKey = `wallpaper-${job.verse.id}-${Date.now()}`;
    await this.cacheBlob(cacheKey, wallpaperBlob);
    
    job.result = {
      cacheKey,
      blob: wallpaperBlob,
      dimensions: { width: job.options.width, height: job.options.height }
    };

    // Send notification about completion
    await notificationService.sendWallpaperReadyNotification();
  }

  private async processNotificationJob(job: ProcessingJob) {
    await notificationService.sendDailyVerseNotification(job.verse);
    job.result = { sent: true, timestamp: Date.now() };
  }

  private async processWidgetJob(job: ProcessingJob) {
    // Widget processing would happen here
    // This could involve generating widget-specific assets
    job.result = { processed: true, timestamp: Date.now() };
  }

  private async cacheBlob(key: string, blob: Blob): Promise<void> {
    if ('caches' in window) {
      try {
        const cache = await caches.open('wallpaper-cache');
        const response = new Response(blob);
        await cache.put(key, response);
      } catch (error) {
        console.warn('Failed to cache wallpaper:', error);
        // Fallback to memory storage (temporary)
        this.memoryCache.set(key, blob);
      }
    } else {
      // Fallback to memory storage
      this.memoryCache.set(key, blob);
    }
  }

  private memoryCache = new Map<string, Blob>();

  public async getCachedWallpaper(key: string): Promise<Blob | null> {
    if ('caches' in window) {
      try {
        const cache = await caches.open('wallpaper-cache');
        const response = await cache.match(key);
        if (response) {
          return await response.blob();
        }
      } catch (error) {
        console.warn('Failed to retrieve cached wallpaper:', error);
      }
    }
    
    // Check memory cache
    return this.memoryCache.get(key) || null;
  }

  private processNext() {
    // Continue processing queue
    setTimeout(() => this.startProcessing(), 100);
  }

  private generateJobId(): string {
    return `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  public getJobStatus(jobId: string): ProcessingJob | null {
    return this.jobQueue.find(j => j.id === jobId) || null;
  }

  public getQueueStatus() {
    return {
      total: this.jobQueue.length,
      pending: this.jobQueue.filter(j => j.status === 'pending').length,
      processing: this.jobQueue.filter(j => j.status === 'processing').length,
      completed: this.jobQueue.filter(j => j.status === 'completed').length,
      failed: this.jobQueue.filter(j => j.status === 'failed').length
    };
  }

  public clearCompletedJobs() {
    this.jobQueue = this.jobQueue.filter(j => 
      j.status !== 'completed' && j.status !== 'failed'
    );
  }
}

// Export singleton instance
export const backgroundProcessor = BackgroundProcessor.getInstance();
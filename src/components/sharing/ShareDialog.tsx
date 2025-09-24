import { useState } from "react";
import { Share2, Copy, MessageCircle, Twitter, Facebook, Instagram, Download, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Verse } from "@/hooks/useVerses";

interface ShareDialogProps {
  verse: Verse;
  wallpaperBlob?: Blob;
  trigger?: React.ReactNode;
}

const ShareDialog = ({ verse, wallpaperBlob, trigger }: ShareDialogProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const shareText = `"${verse.english_translation}"\n\n— Quran ${verse.surah_number}:${verse.ayah_number}\n\nShared via Ayah Wallpapers`;
  const shareUrl = window.location.origin;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied to clipboard",
        description: "Verse text has been copied to your clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please copy the text manually",
        variant: "destructive"
      });
    }
  };

  const shareVia = async (platform: string) => {
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(shareUrl);
    
    let url = '';
    
    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
      case 'telegram':
        url = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
    }
    
    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        const shareData: ShareData = {
          title: `Quran ${verse.surah_number}:${verse.ayah_number}`,
          text: shareText,
        };

        // If wallpaper is available, include it
        if (wallpaperBlob) {
          const file = new File([wallpaperBlob], `verse-${verse.surah_number}-${verse.ayah_number}.png`, {
            type: 'image/png'
          });
          shareData.files = [file];
        }

        await navigator.share(shareData);
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          toast({
            title: "Share failed",
            description: "Please try another sharing method",
            variant: "destructive"
          });
        }
      }
    } else {
      // Fallback for browsers without native sharing
      copyToClipboard();
    }
  };

  const downloadWallpaper = () => {
    if (wallpaperBlob) {
      const url = URL.createObjectURL(wallpaperBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ayah-wallpaper-${verse.surah_number}-${verse.ayah_number}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Wallpaper downloaded",
        description: "Your wallpaper has been saved to your device",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Share2 className="h-5 w-5 mr-2" />
            Share This Verse
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Verse Preview */}
          <div className="p-4 bg-gradient-card border-primary/10 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2 text-right font-arabic">
              {verse.arabic_text.substring(0, 50)}...
            </p>
            <p className="text-sm text-foreground italic">
              "{verse.english_translation.substring(0, 100)}..."
            </p>
            <p className="text-xs text-primary mt-2">
              — Quran {verse.surah_number}:{verse.ayah_number}
            </p>
          </div>

          {/* Download Wallpaper */}
          {wallpaperBlob && (
            <Button
              onClick={downloadWallpaper}
              className="w-full bg-gradient-primary text-primary-foreground hover:shadow-glow"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Wallpaper
            </Button>
          )}

          {/* Native Share */}
          {navigator.share && (
            <Button
              onClick={shareNative}
              variant="outline"
              className="w-full border-primary/20 hover:bg-primary/5"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share via System
            </Button>
          )}

          {/* Copy to Clipboard */}
          <Button
            onClick={copyToClipboard}
            variant="outline"
            className="w-full border-primary/20 hover:bg-primary/5"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2 text-success" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy Text
              </>
            )}
          </Button>

          {/* Social Media Platforms */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">Share on social media:</p>
            
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => shareVia('whatsapp')}
                variant="outline"
                className="border-green-500/20 hover:bg-green-500/5"
              >
                <MessageCircle className="h-4 w-4 mr-2 text-green-600" />
                WhatsApp
              </Button>
              
              <Button
                onClick={() => shareVia('twitter')}
                variant="outline"
                className="border-blue-500/20 hover:bg-blue-500/5"
              >
                <Twitter className="h-4 w-4 mr-2 text-blue-500" />
                Twitter
              </Button>
              
              <Button
                onClick={() => shareVia('facebook')}
                variant="outline"
                className="border-blue-600/20 hover:bg-blue-600/5"
              >
                <Facebook className="h-4 w-4 mr-2 text-blue-600" />
                Facebook
              </Button>
              
              <Button
                onClick={() => shareVia('telegram')}
                variant="outline"
                className="border-blue-400/20 hover:bg-blue-400/5"
              >
                <MessageCircle className="h-4 w-4 mr-2 text-blue-400" />
                Telegram
              </Button>
            </div>
          </div>

          {/* Attribution Note */}
          <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded">
            <p>Shared content includes attribution to Ayah Wallpapers app.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
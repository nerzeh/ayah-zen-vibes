import { useState, useEffect } from "react";
import { Heart, BookOpen, Trash2, Share2, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Verse } from "@/hooks/useVerses";

interface FavoriteVerse extends Verse {
  favorite_id: number;
  created_date: string;
}

const Favorites = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: favorites, isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return [];

      const { data, error } = await supabase
        .from('favorites')
        .select(`
          id,
          verse_id,
          created_date,
          verses (
            id,
            arabic_text,
            english_translation,
            surah_number,
            ayah_number,
            theme_category
          )
        `)
        .eq('user_id', user.user.id)
        .order('created_date', { ascending: false });

      if (error) throw error;

      return data?.map(fav => ({
        ...fav.verses,
        favorite_id: fav.id,
        created_date: fav.created_date
      })) as FavoriteVerse[];
    },
  });

  const removeFavorite = useMutation({
    mutationFn: async (favoriteId: number) => {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', favoriteId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      toast({
        title: "Removed from favorites",
        description: "This verse has been removed from your favorites",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove verse from favorites",
        variant: "destructive"
      });
    }
  });

  const shareVerse = async (verse: Verse) => {
    const shareText = `"${verse.english_translation}"\n\n— Quran ${verse.surah_number}:${verse.ayah_number}\n\nShared via Ayah Wallpapers`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Quran ${verse.surah_number}:${verse.ayah_number}`,
          text: shareText,
        });
      } catch (error) {
        // User cancelled sharing
        console.log('Share cancelled');
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "Copied to clipboard",
          description: "Verse text has been copied to your clipboard",
        });
      } catch (error) {
        toast({
          title: "Share not supported",
          description: "Please copy the verse text manually",
          variant: "destructive"
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 pb-24">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 pb-24 bg-background min-h-screen">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-2">
          <Heart className="h-8 w-8 text-accent mr-2 fill-current" />
          <h1 className="text-3xl font-bold text-foreground">My Favorites</h1>
        </div>
        <p className="text-muted-foreground">Your beloved Quranic verses</p>
      </div>

      {/* Empty State */}
      {!favorites || favorites.length === 0 ? (
        <Card className="p-12 text-center bg-gradient-card border-primary/10">
          <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No favorites yet</h3>
          <p className="text-muted-foreground mb-6">
            Start building your collection by adding verses to your favorites
          </p>
          <Button 
            onClick={() => window.history.back()}
            className="bg-gradient-primary text-primary-foreground hover:shadow-glow"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Browse Library
          </Button>
        </Card>
      ) : (
        <>
          {/* Stats */}
          <div className="mb-6">
            <Card className="p-4 bg-gradient-card border-primary/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-foreground">{favorites.length}</p>
                  <p className="text-sm text-muted-foreground">Favorite Verses</p>
                </div>
                <div className="bg-gradient-primary p-3 rounded-full">
                  <Heart className="h-6 w-6 text-primary-foreground fill-current" />
                </div>
              </div>
            </Card>
          </div>

          {/* Favorites List */}
          <div className="space-y-4">
            {favorites.map((verse) => (
              <Card
                key={verse.favorite_id}
                className="p-6 bg-gradient-card border-primary/10 hover:shadow-card transition-all duration-300 group"
              >
                <div className="flex justify-between items-start mb-4">
                  <Badge
                    variant="secondary"
                    className="bg-secondary/10 text-secondary-foreground border-secondary/20"
                  >
                    {verse.theme_category}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => shareVerse(verse)}
                      className="text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 transition-all duration-300"
                      aria-label="Share verse"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all duration-300"
                          aria-label="Remove from favorites"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove from favorites?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will remove the verse from your favorites collection. You can always add it back later.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => removeFavorite.mutate(verse.favorite_id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>

                {/* Arabic Text */}
                <div className="mb-4">
                  <p className="font-arabic text-2xl text-foreground leading-relaxed text-right">
                    {verse.arabic_text}
                  </p>
                </div>

                {/* English Translation */}
                <div className="mb-4">
                  <p className="text-muted-foreground text-lg italic leading-relaxed">
                    "{verse.english_translation}"
                  </p>
                </div>

                {/* Reference and Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-border">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-primary">
                      Surah {verse.surah_number}:{verse.ayah_number}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Added {new Date(verse.created_date).toLocaleDateString()}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-primary/20 text-primary hover:bg-primary/5"
                    onClick={() => {
                      // Navigate to customize page with this verse
                      const params = new URLSearchParams({
                        verse: JSON.stringify({
                          id: verse.id,
                          arabic_text: verse.arabic_text,
                          english_translation: verse.english_translation,
                          surah_number: verse.surah_number,
                          ayah_number: verse.ayah_number
                        })
                      });
                      window.location.href = `/customize?${params.toString()}`;
                    }}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Create Wallpaper
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Favorites;
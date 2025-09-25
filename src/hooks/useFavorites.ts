import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Verse } from './useVerses';
import { useVerseTranslations } from '@/hooks/useVerseTranslations';
import { useLanguage } from '@/contexts/LanguageContext';

interface FavoriteVerse extends Verse {
  favorite_id: number;
  created_date: string;
}

interface OfflineFavorite {
  verseId: number;
  action: 'add' | 'remove';
  timestamp: number;
}

export const useFavorites = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineQueue, setOfflineQueue] = useState<OfflineFavorite[]>([]);
  const { getTranslation } = useVerseTranslations();
  const { currentLanguage } = useLanguage();
  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncOfflineActions();
    };
    
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Real-time subscription for favorites
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('favorites-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'favorites',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['favorites'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  // Fetch favorites with proper error handling
  const { data: favorites, isLoading, error } = useQuery({
    queryKey: ['favorites', user?.id, currentLanguage],
    queryFn: async () => {
      if (!user) return [];

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
        .eq('user_id', user.id)
        .order('created_date', { ascending: false });

      if (error) throw error;

      return (data || []).map((fav) => ({
        ...fav.verses,
        translated_text: getTranslation(fav.verses.id, fav.verses.english_translation),
        favorite_id: fav.id,
        created_date: fav.created_date,
      })) as FavoriteVerse[];
    },
    enabled: !!user,
    staleTime: 30000, // 30 seconds
    retry: 3,
  });

  // Sync offline actions when coming back online
  const syncOfflineActions = async () => {
    if (!user || offlineQueue.length === 0) return;

    try {
      for (const action of offlineQueue) {
        if (action.action === 'add') {
          await supabase
            .from('favorites')
            .insert({
              verse_id: action.verseId,
              user_id: user.id
            });
        } else {
          await supabase
            .from('favorites')
            .delete()
            .eq('verse_id', action.verseId)
            .eq('user_id', user.id);
        }
      }
      
      setOfflineQueue([]);
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      
      toast({
        title: "Sync Complete",
        description: "Your favorites have been synchronized",
      });
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Some changes couldn't be synchronized. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Add favorite mutation with offline support
  const addFavorite = useMutation({
    mutationFn: async (verseId: number) => {
      if (!user) throw new Error('User not authenticated');

      if (!isOnline) {
        // Queue for offline sync
        setOfflineQueue(prev => [...prev, {
          verseId,
          action: 'add',
          timestamp: Date.now()
        }]);
        return null;
      }

      const { data, error } = await supabase
        .from('favorites')
        .insert({
          verse_id: verseId,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, verseId) => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      toast({
        title: "Added to favorites",
        description: isOnline ? "Verse saved to your favorites" : "Verse saved locally (will sync when online)",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add verse to favorites",
        variant: "destructive"
      });
    }
  });

  // Remove favorite mutation with offline support
  const removeFavorite = useMutation({
    mutationFn: async ({ favoriteId, verseId }: { favoriteId?: number; verseId?: number }) => {
      if (!user) throw new Error('User not authenticated');

      if (!isOnline) {
        // Queue for offline sync
        if (verseId) {
          setOfflineQueue(prev => [...prev, {
            verseId,
            action: 'remove',
            timestamp: Date.now()
          }]);
        }
        return null;
      }

      const query = favoriteId 
        ? supabase.from('favorites').delete().eq('id', favoriteId)
        : supabase.from('favorites').delete().eq('verse_id', verseId).eq('user_id', user.id);

      const { error } = await query;
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      toast({
        title: "Removed from favorites",
        description: isOnline ? "Verse removed from your favorites" : "Change saved locally (will sync when online)",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove verse from favorites",
        variant: "destructive"
      });
    }
  });

  // Check if a verse is favorited
  const isFavorited = (verseId: number) => {
    return favorites?.some(fav => fav.id === verseId) ?? false;
  };

  // Toggle favorite status
  const toggleFavorite = async (verse: Verse) => {
    const favorited = isFavorited(verse.id);
    
    if (favorited) {
      const favorite = favorites?.find(fav => fav.id === verse.id);
      removeFavorite.mutate({ 
        favoriteId: favorite?.favorite_id, 
        verseId: verse.id 
      });
    } else {
      addFavorite.mutate(verse.id);
    }
  };

  return {
    favorites: favorites || [],
    isLoading,
    error,
    isOnline,
    offlineQueue: offlineQueue.length,
    addFavorite: addFavorite.mutate,
    removeFavorite: removeFavorite.mutate,
    toggleFavorite,
    isFavorited,
    syncOfflineActions,
    isAddingFavorite: addFavorite.isPending,
    isRemovingFavorite: removeFavorite.isPending,
  };
};
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useVerseTranslations } from '@/hooks/useVerseTranslations';
import { useLanguage } from '@/contexts/LanguageContext';

export interface Verse {
  id: number;
  surah_number: number;
  ayah_number: number;
  arabic_text: string;
  english_translation: string;
  theme_category: string;
  translated_text?: string;
}

export const useVerses = () => {
  const { getTranslation } = useVerseTranslations();
  const { language } = useLanguage();
  
  return useQuery({
    queryKey: ['verses', language],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('verses')
        .select('*')
        .order('id');
      
      if (error) throw error;
      return (data as Verse[])?.map(verse => ({
        ...verse,
        translated_text: getTranslation(verse.id, verse.english_translation)
      })) || [];
    },
  });
};

export const useRandomVerse = () => {
  const { getTranslation } = useVerseTranslations();
  const { language } = useLanguage();
  
  return useQuery({
    queryKey: ['random-verse', language],
    queryFn: async () => {
      // First get the count of verses
      const { count } = await supabase
        .from('verses')
        .select('*', { count: 'exact', head: true });
      
      if (!count || count === 0) throw new Error('No verses found');
      
      // Get a random verse
      const randomId = Math.floor(Math.random() * count) + 1;
      const { data, error } = await supabase
        .from('verses')
        .select('*')
        .eq('id', randomId)
        .single();
      
      if (error) throw error;
      return {
        ...data,
        translated_text: getTranslation(data.id, data.english_translation)
      } as Verse;
    },
  });
};

export const useFavoriteVerse = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (verseId: number) => {
      const { data, error } = await supabase
        .from('favorites')
        .insert({
          verse_id: verseId,
          user_id: (await supabase.auth.getUser()).data.user?.id
        });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    }
  });
};

// Re-export enhanced hooks
export { useFavorites } from './useFavorites';
export { useEnhancedUserSettings } from './useEnhancedUserSettings';
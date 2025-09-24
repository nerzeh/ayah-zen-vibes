-- Create verses table
CREATE TABLE public.verses (
    id SERIAL PRIMARY KEY,
    surah_number INTEGER NOT NULL,
    ayah_number INTEGER NOT NULL,
    arabic_text TEXT NOT NULL,
    english_translation TEXT NOT NULL,
    theme_category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create favorites table
CREATE TABLE public.favorites (
    id SERIAL PRIMARY KEY,
    verse_id INTEGER NOT NULL REFERENCES public.verses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.verses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- RLS policies for verses (public read access)
CREATE POLICY "Verses are publicly readable" 
ON public.verses 
FOR SELECT 
USING (true);

-- RLS policies for favorites (user-specific)
CREATE POLICY "Users can view their own favorites" 
ON public.favorites 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own favorites" 
ON public.favorites 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" 
ON public.favorites 
FOR DELETE 
USING (auth.uid() = user_id);

-- Insert sample verses data
INSERT INTO public.verses (surah_number, ayah_number, arabic_text, english_translation, theme_category) VALUES
(1, 1, 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', 'In the name of Allah, the Most Gracious, the Most Merciful', 'blessing'),
(2, 255, 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ', 'Allah - there is no deity except Him, the Ever-Living, the Self-Sustaining', 'faith'),
(3, 26, 'قُلِ اللَّهُمَّ مَالِكَ الْمُلْكِ', 'Say, O Allah, Owner of Sovereignty', 'power'),
(24, 35, 'اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ', 'Allah is the light of the heavens and the earth', 'guidance'),
(55, 13, 'فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ', 'So which of the favors of your Lord would you deny?', 'gratitude'),
(112, 1, 'قُلْ هُوَ اللَّهُ أَحَدٌ', 'Say, He is Allah, who is One', 'faith'),
(113, 1, 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ', 'Say, I seek refuge in the Lord of daybreak', 'protection'),
(114, 1, 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ', 'Say, I seek refuge in the Lord of mankind', 'protection'),
(2, 286, 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا', 'Allah does not burden a soul beyond that it can bear', 'comfort'),
(9, 129, 'فَإِن تَوَلَّوْا فَقُلْ حَسْبِيَ اللَّهُ', 'But if they turn away, then say, Sufficient for me is Allah', 'trust');

-- Create indexes for better performance
CREATE INDEX idx_verses_surah_ayah ON public.verses(surah_number, ayah_number);
CREATE INDEX idx_verses_theme ON public.verses(theme_category);
CREATE INDEX idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX idx_favorites_verse_id ON public.favorites(verse_id);
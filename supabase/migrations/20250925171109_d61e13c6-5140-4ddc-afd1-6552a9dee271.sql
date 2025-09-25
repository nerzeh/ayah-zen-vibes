-- Add new language and text settings columns to user_settings table
ALTER TABLE public.user_settings 
ADD COLUMN translation_style TEXT DEFAULT 'interpretive',
ADD COLUMN arabic_text_size INTEGER DEFAULT 18,
ADD COLUMN date_format TEXT DEFAULT 'gregorian',
ADD COLUMN time_format TEXT DEFAULT '12h';

-- Add check constraints for valid values
ALTER TABLE public.user_settings 
ADD CONSTRAINT translation_style_check 
CHECK (translation_style IN ('literal', 'interpretive', 'simplified'));

ALTER TABLE public.user_settings 
ADD CONSTRAINT arabic_text_size_check 
CHECK (arabic_text_size >= 14 AND arabic_text_size <= 24);

ALTER TABLE public.user_settings 
ADD CONSTRAINT date_format_check 
CHECK (date_format IN ('gregorian', 'hijri', 'both'));

ALTER TABLE public.user_settings 
ADD CONSTRAINT time_format_check 
CHECK (time_format IN ('12h', '24h'));
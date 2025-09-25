-- Create a function to store environment variables for AI image generation
-- This will be used by the Edge Function for generating nature backgrounds

-- Create storage bucket for generated wallpaper backgrounds
INSERT INTO storage.buckets (id, name, public) VALUES ('wallpaper-backgrounds', 'wallpaper-backgrounds', true)
ON CONFLICT (id) DO NOTHING;

-- Create policies for wallpaper background storage
CREATE POLICY "Wallpaper backgrounds are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'wallpaper-backgrounds');

CREATE POLICY "Allow wallpaper background uploads from service" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'wallpaper-backgrounds');
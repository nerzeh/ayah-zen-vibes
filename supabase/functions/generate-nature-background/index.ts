import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { backgroundType = 'mountain_valley' } = await req.json()

    const hf = new HfInference(Deno.env.get('HUGGING_FACE_ACCESS_TOKEN'))

    // Nature-themed prompts inspired by the reference images
    const prompts = {
      mountain_valley: "Breathtaking mountain valley with dramatic peaks, lush green meadows, misty atmosphere, and a small house in the distance. Ultra high resolution, cinematic lighting, serene and peaceful Islamic landscape.",
      sunset_water: "Magnificent golden sunset over calm water, dramatic clouds, warm orange and amber light reflecting on the water surface. Ultra high resolution, peaceful and serene atmosphere.",
      starry_night: "Majestic starry night sky over mountain silhouettes, countless stars, peaceful night landscape. Ultra high resolution, mystical and contemplative atmosphere.",
      desert_dunes: "Beautiful sand dunes at golden hour, warm light, smooth curves of sand, peaceful desert landscape. Ultra high resolution, serene and meditative atmosphere.",
      forest_path: "Serene forest path with dappled sunlight, tall trees, peaceful woodland scene. Ultra high resolution, tranquil and spiritual atmosphere.",
      ocean_cliffs: "Dramatic ocean cliffs with waves crashing below, clear blue sky, peaceful coastal landscape. Ultra high resolution, powerful and serene.",
      islamic_aesthetic: "Aesthetic Islamic-inspired background photography. Crescent moon glowing in the night sky, Quran placed beautifully with flowers, peaceful Mecca view with glowing lights, serene rainy night streets with trees and lamps, elegant roses in soft light, calm ocean waves near rocks. Minimalist, cinematic, spiritual and elegant style. High quality, atmospheric, no text, no calligraphy, no people, no faces, no animals, no statues."
    }

    const selectedPrompt = prompts[backgroundType as keyof typeof prompts] || prompts.mountain_valley

    console.log(`Generating background: ${backgroundType}`)
    console.log(`Using prompt: ${selectedPrompt}`)

    const image = await hf.textToImage({
      inputs: selectedPrompt,
      model: 'black-forest-labs/FLUX.1-schnell',
    })

    // Convert the blob to a base64 string
    const arrayBuffer = await image.arrayBuffer()
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))

    return new Response(
      JSON.stringify({ 
        image: `data:image/png;base64,${base64}`,
        backgroundType,
        prompt: selectedPrompt 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error generating background:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate background image', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
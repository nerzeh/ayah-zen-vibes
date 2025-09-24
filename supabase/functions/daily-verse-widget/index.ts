import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WidgetVerseData {
  id: number;
  arabic_text: string;
  english_translation: string;
  surah_number: number;
  ayah_number: number;
  theme_category: string;
  formatted_reference: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { searchParams } = new URL(req.url)
    const widgetSize = searchParams.get('size') || '4x2'
    const theme = searchParams.get('theme') || 'classic'
    const maxLength = searchParams.get('maxLength')

    // Get a random verse for the widget
    const { data: verses, error } = await supabase
      .from('verses')
      .select('*')
      .order('id')

    if (error) {
      console.error('Database error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch verses' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    if (!verses || verses.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No verses found' }),
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Select verse based on current date to ensure daily consistency
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24)
    const selectedVerse = verses[dayOfYear % verses.length]

    // Format the verse data for widget consumption
    let widgetData: WidgetVerseData = {
      id: selectedVerse.id,
      arabic_text: selectedVerse.arabic_text,
      english_translation: selectedVerse.english_translation,
      surah_number: selectedVerse.surah_number,
      ayah_number: selectedVerse.ayah_number,
      theme_category: selectedVerse.theme_category,
      formatted_reference: `Surah ${selectedVerse.surah_number}:${selectedVerse.ayah_number}`
    }

    // Truncate text based on widget size and maxLength parameter
    if (maxLength) {
      const maxLen = parseInt(maxLength)
      if (widgetData.english_translation.length > maxLen) {
        widgetData.english_translation = widgetData.english_translation.substring(0, maxLen - 3) + '...'
      }
    } else {
      // Default truncation based on widget size
      switch (widgetSize) {
        case '2x2':
          // Very compact - Arabic only, short translation
          if (widgetData.english_translation.length > 30) {
            widgetData.english_translation = widgetData.english_translation.substring(0, 27) + '...'
          }
          break
        case '4x2':
          // Medium - Moderate truncation
          if (widgetData.english_translation.length > 80) {
            widgetData.english_translation = widgetData.english_translation.substring(0, 77) + '...'
          }
          break
        case '4x4':
          // Large - Full text allowed
          break
      }
    }

    // Add theme-specific styling information
    const themeConfig = {
      classic: {
        backgroundColor: '#1B4332',
        textColor: '#FFFFFF',
        accentColor: '#D4AF37',
        pattern: 'islamic-geometric'
      },
      minimal: {
        backgroundColor: '#2D3748',
        textColor: '#F7FAFC',
        accentColor: '#20C997',
        pattern: 'subtle-dots'
      },
      elegant: {
        backgroundColor: '#0F766E',
        textColor: '#FFFFFF',
        accentColor: '#FCD34D',
        pattern: 'elegant-lines'
      }
    }

    const response = {
      verse: widgetData,
      theme: themeConfig[theme as keyof typeof themeConfig] || themeConfig.classic,
      metadata: {
        generatedAt: new Date().toISOString(),
        widgetSize,
        theme,
        cacheUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // Cache for 24 hours
      }
    }

    console.log(`Widget verse generated for size: ${widgetSize}, theme: ${theme}`)

    return new Response(
      JSON.stringify(response),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=86400' // Cache for 24 hours
        }
      }
    )

  } catch (error) {
    console.error('Widget function error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
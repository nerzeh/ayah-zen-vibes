package com.ayahwallpapers.widget

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.graphics.*
import android.graphics.drawable.BitmapDrawable
import android.net.Uri
import android.os.Build
import android.text.Layout
import android.text.StaticLayout
import android.text.TextPaint
import android.util.Log
import android.widget.RemoteViews
import androidx.core.content.ContextCompat
import com.ayahwallpapers.R
import com.ayahwallpapers.MainActivity
import kotlinx.coroutines.*
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import java.io.BufferedReader
import java.io.InputStreamReader
import java.net.HttpURLConnection
import java.net.URL
import java.text.SimpleDateFormat
import java.util.*

@Serializable
data class VerseData(
    val id: Int,
    val arabic_text: String,
    val english_translation: String,
    val surah_number: Int,
    val ayah_number: Int,
    val theme_category: String,
    val formatted_reference: String
)

@Serializable
data class WidgetTheme(
    val backgroundColor: String,
    val textColor: String,
    val accentColor: String,
    val pattern: String
)

@Serializable
data class WidgetMetadata(
    val generatedAt: String,
    val widgetSize: String,
    val theme: String,
    val cacheUntil: String
)

@Serializable
data class WidgetVerseResponse(
    val verse: VerseData,
    val theme: WidgetTheme,
    val metadata: WidgetMetadata
)

class DailyVerseWidget : AppWidgetProvider() {

    companion object {
        private const val TAG = "DailyVerseWidget"
        private const val SUPABASE_FUNCTION_URL = "https://gatxeplorffzrepiwkdz.supabase.co/functions/v1/daily-verse-widget"
        private const val SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhdHhlcGxvcmZmenJlcGl3a2R6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3NDk3OTEsImV4cCI6MjA3NDMyNTc5MX0.lCVemo4bd5Kkiu3iZrxfDaBCiOZCIBvfm1YyfpNj36Q"
        
        private const val ACTION_UPDATE_WIDGET = "com.ayahwallpapers.widget.UPDATE_WIDGET"
        private const val ACTION_WIDGET_CLICK = "com.ayahwallpapers.widget.WIDGET_CLICK"
    }

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        Log.d(TAG, "onUpdate called for ${appWidgetIds.size} widgets")
        
        for (appWidgetId in appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId)
        }
    }

    override fun onReceive(context: Context, intent: Intent) {
        super.onReceive(context, intent)
        
        when (intent.action) {
            ACTION_UPDATE_WIDGET -> {
                Log.d(TAG, "Manual widget update requested")
                val appWidgetManager = AppWidgetManager.getInstance(context)
                val componentName = ComponentName(context, DailyVerseWidget::class.java)
                val appWidgetIds = appWidgetManager.getAppWidgetIds(componentName)
                onUpdate(context, appWidgetManager, appWidgetIds)
            }
            ACTION_WIDGET_CLICK -> {
                Log.d(TAG, "Widget clicked, opening app")
                val launchIntent = Intent(context, MainActivity::class.java).apply {
                    flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
                    data = Uri.parse("ayahwallpapers://verse/${intent.getIntExtra("verse_id", 1)}")
                }
                context.startActivity(launchIntent)
            }
        }
    }

    private fun updateAppWidget(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetId: Int
    ) {
        Log.d(TAG, "Updating widget $appWidgetId")
        
        // Get widget size
        val options = appWidgetManager.getAppWidgetOptions(appWidgetId)
        val widgetSize = getWidgetSize(options)
        
        // Load widget configuration
        val config = loadWidgetConfig(context, appWidgetId)
        
        // Show loading state
        val loadingViews = createLoadingViews(context, appWidgetId, widgetSize)
        appWidgetManager.updateAppWidget(appWidgetId, loadingViews)
        
        // Fetch verse data asynchronously
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val verseData = fetchVerseData(widgetSize, config.theme)
                
                withContext(Dispatchers.Main) {
                    val views = createWidgetViews(context, appWidgetId, verseData, widgetSize, config)
                    appWidgetManager.updateAppWidget(appWidgetId, views)
                    Log.d(TAG, "Widget $appWidgetId updated successfully")
                }
            } catch (e: Exception) {
                Log.e(TAG, "Failed to update widget", e)
                
                withContext(Dispatchers.Main) {
                    val errorViews = createErrorViews(context, appWidgetId, widgetSize)
                    appWidgetManager.updateAppWidget(appWidgetId, errorViews)
                }
            }
        }
    }

    private fun fetchVerseData(widgetSize: String, theme: String): WidgetVerseResponse {
        val url = URL("$SUPABASE_FUNCTION_URL?size=$widgetSize&theme=$theme")
        val connection = url.openConnection() as HttpURLConnection
        
        try {
            connection.requestMethod = "GET"
            connection.setRequestProperty("Content-Type", "application/json")
            connection.setRequestProperty("Authorization", "Bearer $SUPABASE_ANON_KEY")
            connection.connectTimeout = 10000
            connection.readTimeout = 10000
            
            val responseCode = connection.responseCode
            if (responseCode != HttpURLConnection.HTTP_OK) {
                throw Exception("HTTP $responseCode")
            }
            
            val reader = BufferedReader(InputStreamReader(connection.inputStream))
            val response = reader.readText()
            reader.close()
            
            return Json.decodeFromString(WidgetVerseResponse.serializer(), response)
        } finally {
            connection.disconnect()
        }
    }

    private fun createWidgetViews(
        context: Context,
        appWidgetId: Int,
        verseData: WidgetVerseResponse,
        widgetSize: String,
        config: WidgetConfig
    ): RemoteViews {
        val layoutId = when (widgetSize) {
            "2x2" -> R.layout.widget_small
            "4x2" -> R.layout.widget_medium
            "4x4" -> R.layout.widget_large
            else -> R.layout.widget_medium
        }
        
        val views = RemoteViews(context.packageName, layoutId)
        
        // Set background
        val backgroundColor = Color.parseColor(verseData.theme.backgroundColor)
        val backgroundBitmap = createBackgroundBitmap(context, backgroundColor, widgetSize, verseData.theme.pattern)
        views.setImageViewBitmap(R.id.widget_background, backgroundBitmap)
        
        // Set verse content
        if (config.showArabic) {
            views.setTextViewText(R.id.arabic_text, verseData.verse.arabic_text)
            views.setTextColor(R.id.arabic_text, Color.parseColor(verseData.theme.textColor))
            views.setViewVisibility(R.id.arabic_text, android.view.View.VISIBLE)
        } else {
            views.setViewVisibility(R.id.arabic_text, android.view.View.GONE)
        }
        
        if (config.showTranslation && widgetSize != "2x2") {
            views.setTextViewText(R.id.english_text, "\"${verseData.verse.english_translation}\"")
            views.setTextColor(R.id.english_text, Color.parseColor(verseData.theme.textColor))
            views.setViewVisibility(R.id.english_text, android.view.View.VISIBLE)
        } else {
            views.setViewVisibility(R.id.english_text, android.view.View.GONE)
        }
        
        // Set reference
        views.setTextViewText(R.id.verse_reference, verseData.verse.formatted_reference)
        views.setTextColor(R.id.verse_reference, Color.parseColor(verseData.theme.textColor))
        
        // Set header
        views.setTextViewText(R.id.widget_title, "Today's Verse")
        views.setTextColor(R.id.widget_title, Color.parseColor(verseData.theme.textColor))
        
        // Set click intent
        val clickIntent = Intent(context, DailyVerseWidget::class.java).apply {
            action = ACTION_WIDGET_CLICK
            putExtra("verse_id", verseData.verse.id)
        }
        val pendingIntent = PendingIntent.getBroadcast(
            context,
            appWidgetId,
            clickIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        views.setOnClickPendingIntent(R.id.widget_container, pendingIntent)
        
        return views
    }

    private fun createBackgroundBitmap(
        context: Context,
        backgroundColor: Int,
        widgetSize: String,
        pattern: String
    ): Bitmap {
        val (width, height) = when (widgetSize) {
            "2x2" -> Pair(200, 200)
            "4x2" -> Pair(400, 200)
            "4x4" -> Pair(400, 400)
            else -> Pair(400, 200)
        }
        
        val bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
        val canvas = Canvas(bitmap)
        
        // Fill background
        canvas.drawColor(backgroundColor)
        
        // Draw Islamic pattern
        when (pattern) {
            "islamic-geometric" -> drawGeometricPattern(canvas, width, height)
            "subtle-dots" -> drawDotPattern(canvas, width, height)
            "elegant-lines" -> drawLinePattern(canvas, width, height)
        }
        
        return bitmap
    }

    private fun drawGeometricPattern(canvas: Canvas, width: Int, height: Int) {
        val paint = Paint().apply {
            color = Color.WHITE
            alpha = 25 // 10% opacity
            style = Paint.Style.STROKE
            strokeWidth = 2f
            isAntiAlias = true
        }
        
        val spacing = 40f
        for (x in 0 until (width + spacing.toInt()) step spacing.toInt()) {
            for (y in 0 until (height + spacing.toInt()) step spacing.toInt()) {
                val path = Path().apply {
                    moveTo(x.toFloat(), y - 15f)
                    lineTo(x + 15f, y.toFloat())
                    lineTo(x.toFloat(), y + 15f)
                    lineTo(x - 15f, y.toFloat())
                    close()
                }
                canvas.drawPath(path, paint)
            }
        }
    }

    private fun drawDotPattern(canvas: Canvas, width: Int, height: Int) {
        val paint = Paint().apply {
            color = Color.WHITE
            alpha = 30 // 12% opacity
            style = Paint.Style.FILL
            isAntiAlias = true
        }
        
        val spacing = 30f
        for (x in 0 until width step spacing.toInt()) {
            for (y in 0 until height step spacing.toInt()) {
                canvas.drawCircle(x.toFloat(), y.toFloat(), 2f, paint)
            }
        }
    }

    private fun drawLinePattern(canvas: Canvas, width: Int, height: Int) {
        val paint = Paint().apply {
            color = Color.WHITE
            alpha = 20 // 8% opacity
            style = Paint.Style.STROKE
            strokeWidth = 1f
            isAntiAlias = true
        }
        
        val spacing = 25f
        for (i in 0 until (width / spacing).toInt()) {
            val x = i * spacing
            canvas.drawLine(x, 0f, x, height.toFloat(), paint)
        }
        for (i in 0 until (height / spacing).toInt()) {
            val y = i * spacing
            canvas.drawLine(0f, y, width.toFloat(), y, paint)
        }
    }

    private fun createLoadingViews(context: Context, appWidgetId: Int, widgetSize: String): RemoteViews {
        val layoutId = when (widgetSize) {
            "2x2" -> R.layout.widget_small
            "4x2" -> R.layout.widget_medium
            "4x4" -> R.layout.widget_large
            else -> R.layout.widget_medium
        }
        
        val views = RemoteViews(context.packageName, layoutId)
        views.setTextViewText(R.id.widget_title, "Loading...")
        views.setTextViewText(R.id.arabic_text, "...")
        views.setTextViewText(R.id.english_text, "Fetching today's verse...")
        views.setTextViewText(R.id.verse_reference, "")
        
        return views
    }

    private fun createErrorViews(context: Context, appWidgetId: Int, widgetSize: String): RemoteViews {
        val layoutId = when (widgetSize) {
            "2x2" -> R.layout.widget_small
            "4x2" -> R.layout.widget_medium
            "4x4" -> R.layout.widget_large
            else -> R.layout.widget_medium
        }
        
        val views = RemoteViews(context.packageName, layoutId)
        views.setTextViewText(R.id.widget_title, "Ayah Wallpapers")
        views.setTextViewText(R.id.arabic_text, "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ")
        views.setTextViewText(R.id.english_text, "Tap to open app")
        views.setTextViewText(R.id.verse_reference, "Al-Fatiha 1:1")
        
        return views
    }

    private fun getWidgetSize(options: android.os.Bundle): String {
        val minWidth = options.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_WIDTH)
        val minHeight = options.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_HEIGHT)
        
        return when {
            minWidth <= 180 && minHeight <= 180 -> "2x2"
            minWidth > 180 && minHeight <= 180 -> "4x2"
            minWidth > 180 && minHeight > 180 -> "4x4"
            else -> "4x2"
        }
    }

    private fun loadWidgetConfig(context: Context, appWidgetId: Int): WidgetConfig {
        val prefs = context.getSharedPreferences("widget_config", Context.MODE_PRIVATE)
        return WidgetConfig(
            enabled = prefs.getBoolean("enabled_$appWidgetId", true),
            theme = prefs.getString("theme_$appWidgetId", "classic") ?: "classic",
            showArabic = prefs.getBoolean("showArabic_$appWidgetId", true),
            showTranslation = prefs.getBoolean("showTranslation_$appWidgetId", true)
        )
    }
}

data class WidgetConfig(
    val enabled: Boolean,
    val theme: String,
    val showArabic: Boolean,
    val showTranslation: Boolean
)
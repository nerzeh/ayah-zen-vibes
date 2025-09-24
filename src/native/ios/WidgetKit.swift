import WidgetKit
import SwiftUI

// MARK: - Widget Configuration
struct AyahWidgetConfiguration: AppIntent {
    static var title: LocalizedStringResource = "Configure Ayah Widget"
    static var description = IntentDescription("Customize your daily verse widget appearance and content.")
    
    @Parameter(title: "Widget Size")
    var widgetSize: WidgetSizeOption
    
    @Parameter(title: "Theme")
    var theme: WidgetThemeOption
    
    @Parameter(title: "Show Arabic")
    var showArabic: Bool
    
    @Parameter(title: "Show Translation")
    var showTranslation: Bool
    
    init() {
        widgetSize = .medium
        theme = .classic
        showArabic = true
        showTranslation = true
    }
    
    func perform() async throws -> some IntentResult {
        return .result()
    }
}

enum WidgetSizeOption: String, CaseIterable, AppEnum {
    case small = "2x2"
    case medium = "4x2"
    case large = "4x4"
    
    static var typeDisplayRepresentation: TypeDisplayRepresentation = "Widget Size"
    static var caseDisplayRepresentations: [WidgetSizeOption: DisplayRepresentation] = [
        .small: "Small (2×2)",
        .medium: "Medium (4×2)",
        .large: "Large (4×4)"
    ]
}

enum WidgetThemeOption: String, CaseIterable, AppEnum {
    case classic = "classic"
    case minimal = "minimal"
    case elegant = "elegant"
    
    static var typeDisplayRepresentation: TypeDisplayRepresentation = "Theme"
    static var caseDisplayRepresentations: [WidgetThemeOption: DisplayRepresentation] = [
        .classic: "Classic Green & Gold",
        .minimal: "Minimal Dark",
        .elegant: "Elegant Teal"
    ]
}

// MARK: - Widget Data Models
struct VerseData: Codable {
    let id: Int
    let arabicText: String
    let englishTranslation: String
    let surahNumber: Int
    let ayahNumber: Int
    let themeCategory: String
    let formattedReference: String
    
    enum CodingKeys: String, CodingKey {
        case id
        case arabicText = "arabic_text"
        case englishTranslation = "english_translation"
        case surahNumber = "surah_number"
        case ayahNumber = "ayah_number"
        case themeCategory = "theme_category"
        case formattedReference = "formatted_reference"
    }
}

struct WidgetTheme: Codable {
    let backgroundColor: String
    let textColor: String
    let accentColor: String
    let pattern: String
    
    enum CodingKeys: String, CodingKey {
        case backgroundColor = "backgroundColor"
        case textColor = "textColor"
        case accentColor = "accentColor"
        case pattern = "pattern"
    }
}

struct WidgetVerseResponse: Codable {
    let verse: VerseData
    let theme: WidgetTheme
    let metadata: WidgetMetadata
}

struct WidgetMetadata: Codable {
    let generatedAt: String
    let widgetSize: String
    let theme: String
    let cacheUntil: String
    
    enum CodingKeys: String, CodingKey {
        case generatedAt = "generatedAt"
        case widgetSize = "widgetSize"
        case theme = "theme"
        case cacheUntil = "cacheUntil"
    }
}

// MARK: - Widget Timeline Provider
struct AyahWidgetProvider: AppIntentTimelineProvider {
    func placeholder(in context: Context) -> AyahWidgetEntry {
        AyahWidgetEntry(
            date: Date(),
            verse: VerseData(
                id: 1,
                arabicText: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
                englishTranslation: "In the name of Allah, the Most Gracious, the Most Merciful",
                surahNumber: 1,
                ayahNumber: 1,
                themeCategory: "blessing",
                formattedReference: "Al-Fatiha 1:1"
            ),
            theme: WidgetTheme(
                backgroundColor: "#1B4332",
                textColor: "#FFFFFF",
                accentColor: "#D4AF37",
                pattern: "islamic-geometric"
            ),
            configuration: AyahWidgetConfiguration()
        )
    }
    
    func snapshot(for configuration: AyahWidgetConfiguration, in context: Context) async -> AyahWidgetEntry {
        return placeholder(in: context)
    }
    
    func timeline(for configuration: AyahWidgetConfiguration, in context: Context) async -> Timeline<AyahWidgetEntry> {
        let currentDate = Date()
        
        // Fetch verse data from Supabase edge function
        guard let widgetData = await fetchWidgetData(for: configuration, context: context) else {
            // Return placeholder if fetch fails
            let entry = placeholder(in: context)
            return Timeline(entries: [entry], policy: .after(Calendar.current.date(byAdding: .hour, value: 1, to: currentDate)!))
        }
        
        let entry = AyahWidgetEntry(
            date: currentDate,
            verse: widgetData.verse,
            theme: widgetData.theme,
            configuration: configuration
        )
        
        // Schedule next update based on configuration
        let nextUpdate: Date
        switch configuration.widgetSize {
        case .small, .medium, .large:
            // Update daily at 6 AM
            let calendar = Calendar.current
            let tomorrow = calendar.date(byAdding: .day, value: 1, to: currentDate)!
            nextUpdate = calendar.date(bySettingHour: 6, minute: 0, second: 0, of: tomorrow)!
        }
        
        return Timeline(entries: [entry], policy: .after(nextUpdate))
    }
    
    private func fetchWidgetData(for configuration: AyahWidgetConfiguration, context: Context) async -> WidgetVerseResponse? {
        let urlString = "https://gatxeplorffzrepiwkdz.supabase.co/functions/v1/daily-verse-widget"
        guard let url = URL(string: urlString) else { return nil }
        
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhdHhlcGxvcmZmenJlcGl3a2R6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3NDk3OTEsImV4cCI6MjA3NDMyNTc5MX0.lCVemo4bd5Kkiu3iZrxfDaBCiOZCIBvfm1YyfpNj36Q", forHTTPHeaderField: "Authorization")
        
        // Add query parameters
        var components = URLComponents(url: url, resolvingAgainstBaseURL: false)
        components?.queryItems = [
            URLQueryItem(name: "size", value: configuration.widgetSize.rawValue),
            URLQueryItem(name: "theme", value: configuration.theme.rawValue)
        ]
        
        guard let finalURL = components?.url else { return nil }
        request.url = finalURL
        
        do {
            let (data, _) = try await URLSession.shared.data(for: request)
            let decoder = JSONDecoder()
            return try decoder.decode(WidgetVerseResponse.self, from: data)
        } catch {
            print("Error fetching widget data: \(error)")
            return nil
        }
    }
}

// MARK: - Widget Entry
struct AyahWidgetEntry: TimelineEntry {
    let date: Date
    let verse: VerseData
    let theme: WidgetTheme
    let configuration: AyahWidgetConfiguration
}

// MARK: - Widget Views
struct AyahWidgetSmallView: View {
    let entry: AyahWidgetEntry
    
    var body: some View {
        ZStack {
            // Background
            Color(hex: entry.theme.backgroundColor)
            
            // Islamic pattern overlay
            IslamicPatternView()
                .opacity(0.1)
            
            VStack(spacing: 4) {
                HStack {
                    Text("Today's Verse")
                        .font(.caption2)
                        .foregroundColor(Color(hex: entry.theme.textColor).opacity(0.8))
                    Spacer()
                }
                
                Spacer()
                
                if entry.configuration.showArabic {
                    Text(entry.verse.arabicText)
                        .font(.custom("AmiriQuran", size: 14))
                        .foregroundColor(Color(hex: entry.theme.textColor))
                        .multilineTextAlignment(.center)
                        .lineLimit(3)
                }
                
                Spacer()
                
                HStack {
                    Text(entry.verse.formattedReference)
                        .font(.caption2)
                        .foregroundColor(Color(hex: entry.theme.textColor).opacity(0.7))
                    Spacer()
                    Circle()
                        .fill(Color(hex: entry.theme.textColor).opacity(0.2))
                        .frame(width: 12, height: 12)
                }
            }
            .padding(12)
        }
        .cornerRadius(16)
    }
}

struct AyahWidgetMediumView: View {
    let entry: AyahWidgetEntry
    
    var body: some View {
        ZStack {
            // Background
            Color(hex: entry.theme.backgroundColor)
            
            // Islamic pattern overlay
            IslamicPatternView()
                .opacity(0.1)
            
            VStack(spacing: 6) {
                HStack {
                    Text("Today's Verse")
                        .font(.caption)
                        .foregroundColor(Color(hex: entry.theme.textColor).opacity(0.8))
                    Spacer()
                }
                
                Spacer()
                
                VStack(spacing: 4) {
                    if entry.configuration.showArabic {
                        Text(entry.verse.arabicText)
                            .font(.custom("AmiriQuran", size: 16))
                            .foregroundColor(Color(hex: entry.theme.textColor))
                            .multilineTextAlignment(.center)
                            .lineLimit(2)
                    }
                    
                    if entry.configuration.showTranslation {
                        Text("\"\(entry.verse.englishTranslation)\"")
                            .font(.caption)
                            .foregroundColor(Color(hex: entry.theme.textColor).opacity(0.9))
                            .multilineTextAlignment(.center)
                            .lineLimit(2)
                    }
                }
                
                Spacer()
                
                HStack {
                    Text(entry.verse.formattedReference)
                        .font(.caption)
                        .foregroundColor(Color(hex: entry.theme.textColor).opacity(0.7))
                    Spacer()
                    Circle()
                        .fill(Color(hex: entry.theme.accentColor))
                        .frame(width: 16, height: 16)
                }
            }
            .padding(16)
        }
        .cornerRadius(20)
    }
}

struct AyahWidgetLargeView: View {
    let entry: AyahWidgetEntry
    
    var body: some View {
        ZStack {
            // Background
            Color(hex: entry.theme.backgroundColor)
            
            // Islamic pattern overlay
            IslamicPatternView()
                .opacity(0.1)
            
            VStack(spacing: 12) {
                HStack {
                    Text("Today's Verse")
                        .font(.headline)
                        .foregroundColor(Color(hex: entry.theme.textColor).opacity(0.8))
                    Spacer()
                }
                
                Spacer()
                
                VStack(spacing: 8) {
                    if entry.configuration.showArabic {
                        Text(entry.verse.arabicText)
                            .font(.custom("AmiriQuran", size: 22))
                            .foregroundColor(Color(hex: entry.theme.textColor))
                            .multilineTextAlignment(.center)
                            .lineLimit(4)
                    }
                    
                    if entry.configuration.showTranslation {
                        Text("\"\(entry.verse.englishTranslation)\"")
                            .font(.body)
                            .foregroundColor(Color(hex: entry.theme.textColor).opacity(0.9))
                            .multilineTextAlignment(.center)
                            .lineLimit(4)
                    }
                }
                
                Spacer()
                
                HStack {
                    VStack(alignment: .leading) {
                        Text(entry.verse.formattedReference)
                            .font(.caption)
                            .foregroundColor(Color(hex: entry.theme.textColor).opacity(0.7))
                        Text(entry.verse.themeCategory.capitalized)
                            .font(.caption2)
                            .foregroundColor(Color(hex: entry.theme.accentColor))
                    }
                    Spacer()
                    Circle()
                        .fill(Color(hex: entry.theme.accentColor))
                        .frame(width: 20, height: 20)
                        .overlay(
                            Image(systemName: "book.quran")
                                .font(.caption2)
                                .foregroundColor(Color(hex: entry.theme.backgroundColor))
                        )
                }
            }
            .padding(20)
        }
        .cornerRadius(24)
    }
}

// MARK: - Supporting Views
struct IslamicPatternView: View {
    var body: some View {
        Canvas { context, size in
            let rect = CGRect(origin: .zero, size: size)
            let path = Path { path in
                let spacing: CGFloat = 30
                for x in stride(from: 0, through: size.width + spacing, by: spacing) {
                    for y in stride(from: 0, through: size.height + spacing, by: spacing) {
                        path.move(to: CGPoint(x: x, y: y - 15))
                        path.addLine(to: CGPoint(x: x + 15, y: y))
                        path.addLine(to: CGPoint(x: x, y: y + 15))
                        path.addLine(to: CGPoint(x: x - 15, y: y))
                        path.closeSubpath()
                    }
                }
            }
            context.stroke(path, with: .color(.white), lineWidth: 1)
        }
    }
}

// MARK: - Widget Definition
struct AyahWidget: Widget {
    let kind: String = "AyahWidget"
    
    var body: some WidgetConfiguration {
        AppIntentConfiguration(
            kind: kind,
            intent: AyahWidgetConfiguration.self,
            provider: AyahWidgetProvider()
        ) { entry in
            AyahWidgetView(entry: entry)
                .containerBackground(.fill.tertiary, for: .widget)
        }
        .configurationDisplayName("Daily Verse")
        .description("Display beautiful Quranic verses on your home screen with daily updates.")
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    }
}

struct AyahWidgetView: View {
    let entry: AyahWidgetEntry
    
    var body: some View {
        Group {
            switch entry.configuration.widgetSize {
            case .small:
                AyahWidgetSmallView(entry: entry)
            case .medium:
                AyahWidgetMediumView(entry: entry)
            case .large:
                AyahWidgetLargeView(entry: entry)
            }
        }
        .widgetURL(URL(string: "ayahwallpapers://verse/\(entry.verse.id)"))
    }
}

// MARK: - Color Extension
extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (1, 1, 1, 0)
        }
        
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}

// MARK: - Widget Bundle
@main
struct AyahWidgetBundle: WidgetBundle {
    var body: some Widget {
        AyahWidget()
    }
}
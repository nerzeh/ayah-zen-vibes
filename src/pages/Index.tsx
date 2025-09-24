import { Sparkles, Download, Heart, RefreshCw, Smartphone, Palette } from "lucide-react";
import Header from "@/components/layout/Header";
import WallpaperGenerator from "@/components/wallpaper/WallpaperGenerator";
import FeatureCard from "@/components/features/FeatureCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import heroPattern from "@/assets/islamic-hero-pattern.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-elegant">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${heroPattern})` }}
        />
        <div className="relative container px-4 py-16 text-center">
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Sparkles className="mr-2 h-4 w-4" />
              Beautiful Islamic Wallpapers
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Ayah Wallpapers
              </span>
            </h1>
            
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
              Transform your device with beautiful Islamic wallpapers featuring Quranic verses. 
              Get daily inspiration with stunning Arabic calligraphy and elegant designs.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button size="lg" className="bg-gradient-primary hover:opacity-90 shadow-glow">
                <Download className="mr-2 h-5 w-5" />
                Get Started
              </Button>
              <Button variant="outline" size="lg" className="border-primary/20 hover:bg-primary/5">
                <Heart className="mr-2 h-5 w-5" />
                View Gallery
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Wallpaper Generator Section */}
      <section className="container px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Generate Your Wallpaper
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Create beautiful wallpapers with random Quranic verses. Each design is crafted 
              with elegant typography and Islamic patterns.
            </p>
          </div>
          
          <WallpaperGenerator />
        </div>
      </section>

      {/* Features Section */}
      <section className="container px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Beautiful Islamic Design
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover the features that make Ayah Wallpapers the perfect companion 
            for your spiritual journey.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={RefreshCw}
            title="Daily Verses"
            description="Get a new inspiring Quranic verse every day with beautiful Arabic calligraphy and translations."
            gradient="bg-gradient-primary"
          />
          <FeatureCard
            icon={Palette}
            title="Custom Themes"
            description="Choose from elegant color schemes and patterns inspired by Islamic art and architecture."
            gradient="bg-gradient-secondary"
          />
          <FeatureCard
            icon={Smartphone}
            title="Mobile Optimized"
            description="Perfect wallpapers designed specifically for your phone's lock screen and home screen."
            gradient="bg-primary"
          />
        </div>
      </section>

      {/* Coming Soon Features */}
      <section className="container px-4 py-16">
        <Card className="mx-auto max-w-4xl bg-gradient-hero border-0 text-white">
          <div className="p-12 text-center space-y-6">
            <h3 className="text-2xl font-bold mb-4">
              Coming Soon: Enhanced Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-2">
                <h4 className="font-semibold text-secondary">📱 Widget Support</h4>
                <p className="text-white/80">Home screen widgets with daily verses</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-secondary">🌙 Prayer Times</h4>
                <p className="text-white/80">Integrated prayer time reminders</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-secondary">📚 Full Quran</h4>
                <p className="text-white/80">Complete Quranic verse database</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-secondary">🎨 Custom Fonts</h4>
                <p className="text-white/80">Multiple Arabic calligraphy styles</p>
              </div>
            </div>
            
            <p className="text-white/70 text-sm mt-6">
              To unlock these features, we'll need to connect to a database for storing verses and user preferences.
            </p>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background/50 backdrop-blur">
        <div className="container px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p className="mb-2">May Allah's blessings be with you always</p>
            <p className="text-sm">Built with love for the Muslim community ♡</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
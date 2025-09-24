import Header from "@/components/layout/Header";
import WallpaperGenerator from "@/components/wallpaper/WallpaperGenerator";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Download, Palette, BookOpen, Settings, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="text-center pt-8 pb-6 px-4">
        <div className="relative inline-block mb-4">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Today's Verse
          </h1>
          <Sparkles className="absolute -top-1 -right-6 h-6 w-6 text-secondary animate-pulse" />
        </div>
        <p className="text-muted-foreground max-w-md mx-auto">
          Beautiful Islamic wallpapers with daily Quranic inspiration
        </p>
      </div>

      <main className="container mx-auto px-4 pb-24">
        {/* Main Wallpaper Generator */}
        <section className="max-w-md mx-auto mb-8">
          <WallpaperGenerator />
        </section>

        {/* Quick Actions */}
        <section className="mb-8">
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <Link to="/library">
              <Button 
                variant="outline" 
                className="w-full h-16 border-primary/20 hover:bg-primary/5 flex flex-col items-center justify-center gap-1"
              >
                <BookOpen className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Library</span>
              </Button>
            </Link>
            
            <Link to="/customize">
              <Button 
                variant="outline" 
                className="w-full h-16 border-primary/20 hover:bg-primary/5 flex flex-col items-center justify-center gap-1"
              >
                <Palette className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Customize</span>
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Overview */}
        <section className="space-y-4 max-w-md mx-auto">
          <Card className="p-4 bg-gradient-card border-primary/10 hover:shadow-card transition-all duration-300">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-primary p-2 rounded-full">
                <Download className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground">High Resolution</h3>
                <p className="text-sm text-muted-foreground">Perfect quality for any device</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-card border-primary/10 hover:shadow-card transition-all duration-300">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-elegant p-2 rounded-full">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground">Daily Updates</h3>
                <p className="text-sm text-muted-foreground">Fresh verses every day</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-card border-primary/10 hover:shadow-card transition-all duration-300">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-secondary p-2 rounded-full">
                <Heart className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground">Save Favorites</h3>
                <p className="text-sm text-muted-foreground">Keep your beloved verses</p>
              </div>
            </div>
          </Card>
        </section>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Index;
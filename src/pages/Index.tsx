import Header from "@/components/layout/Header";
import WallpaperView from "@/components/wallpaper/WallpaperGenerator";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Download, Palette, BookOpen, Heart, LogIn, Star, Zap, Crown } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { usePremium } from "@/contexts/PremiumContext";
import { useLanguage } from "@/contexts/LanguageContext";
const Index = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { isPremium, wallpaperCount, wallpaperLimit } = usePremium();
  const displayName = user ? (user.user_metadata?.display_name || user.email?.split('@')[0]) : '';

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Welcome Section */}
      <div className="px-4 pt-6 pb-4">
        <div className="max-w-md mx-auto">
          {/* User Greeting */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {user 
                ? t('home.welcomeBack', 'Welcome back, {name}!').replace('{name}', displayName)
                : t('home.todayVerse', 'Today\'s Verse')
              }
            </h2>
            <p className="text-muted-foreground text-sm">
              {t('home.subtitle')}
            </p>
            
            {/* Usage indicator for users */}
            {user && (
              <div className="flex items-center justify-center gap-2 mt-3">
                {isPremium ? (
                  <Badge variant="default" className="gap-1 bg-gradient-to-r from-primary to-primary/80">
                    <Crown className="h-3 w-3" />
                    Premium
                  </Badge>
                ) : (
                  <Badge variant="outline" className="gap-1">
                    <Zap className="h-3 w-3" />
                    {wallpaperCount}/{wallpaperLimit} wallpapers
                  </Badge>
                )}
              </div>
            )}
          </div>
          
          {/* Sign in CTA for guests */}
          {!user && (
            <div className="mb-6">
              <Link to="/welcome">
                <Button className="w-full h-12 gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-lg">
                  <LogIn className="h-5 w-5" />
                  {t('home.signInCta', 'Sign in to unlock all features')}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      <main className="px-4 pb-24">
        <div className="max-w-md mx-auto space-y-6">
          {/* Main Wallpaper Generator */}
          <section>
            <WallpaperView />
          </section>

          {/* Quick Actions Grid */}
          <section>
            <h3 className="text-lg font-semibold mb-4 text-center">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/library">
                <Card className="p-4 hover:bg-muted/50 transition-colors border-primary/10 h-20 flex flex-col items-center justify-center">
                  <BookOpen className="h-6 w-6 text-primary mb-1" />
                  <span className="text-sm font-medium">{t('nav.library')}</span>
                </Card>
              </Link>
              
              <Link to="/favorites">
                <Card className="p-4 hover:bg-muted/50 transition-colors border-primary/10 h-20 flex flex-col items-center justify-center">
                  <Heart className="h-6 w-6 text-primary mb-1" />
                  <span className="text-sm font-medium">{t('nav.favorites')}</span>
                </Card>
              </Link>
            </div>
          </section>

          {/* Feature Highlights */}
          <section>
            <h3 className="text-lg font-semibold mb-4 text-center">Features</h3>
            <div className="space-y-3">
              <Card className="p-4 bg-gradient-to-r from-primary/5 to-transparent border-primary/20">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Download className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground text-sm">HD Wallpapers</h4>
                    <p className="text-xs text-muted-foreground">Perfect quality for any device</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-r from-primary/5 to-transparent border-primary/20">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground text-sm">Daily Updates</h4>
                    <p className="text-xs text-muted-foreground">Fresh verses every day</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-r from-primary/5 to-transparent border-primary/20">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Star className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground text-sm">Personalized</h4>
                    <p className="text-xs text-muted-foreground">Customize to your preference</p>
                  </div>
                </div>
              </Card>
            </div>
          </section>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Index;
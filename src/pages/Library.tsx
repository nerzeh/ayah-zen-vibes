import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Heart, BookOpen, Filter, Share2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useVerses, useFavoriteVerse } from "@/hooks/useVerses";
import { useToast } from "@/hooks/use-toast";
import ShareDialog from "@/components/sharing/ShareDialog";
import LoadingScreen from "@/components/ui/loading-screen";
import { useAccessibility } from "@/components/accessibility/AccessibilityProvider";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import { useLanguage } from "@/contexts/LanguageContext";
const categories = [
  { name: "All", value: "" },
  { name: "Faith", value: "faith" },
  { name: "Guidance", value: "guidance" },
  { name: "Comfort", value: "comfort" },
  { name: "Gratitude", value: "gratitude" },
  { name: "Protection", value: "protection" },
  { name: "Trust", value: "trust" },
  { name: "Power", value: "power" },
  { name: "Blessing", value: "blessing" }
];

const Library = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();
  const { data: verses, isLoading } = useVerses();
  const favoriteVerse = useFavoriteVerse();
  const { toast } = useToast();
  const { announceToScreenReader } = useAccessibility();
  const { t } = useLanguage();

  const filteredVerses = verses?.filter(verse => {
    const translated = (verse.translated_text || verse.english_translation || '').toLowerCase();
    const matchesSearch = verse.arabic_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         translated.includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || verse.theme_category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  const handleFavorite = async (verseId: number) => {
    try {
      await favoriteVerse.mutateAsync(verseId);
      announceToScreenReader("Verse added to favorites");
      toast({
        title: "Added to favorites",
        description: "This verse has been saved to your favorites",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Please sign in to save favorites",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Loading verses..." fullScreen />;
  }

  return (
    <div className="container mx-auto px-4 py-6 pb-24 bg-background min-h-screen">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-2">
          <BookOpen className="h-8 w-8 text-primary mr-2" />
          <h1 className="text-3xl font-bold text-foreground">{t('library.title')}</h1>
        </div>
        <p className="text-muted-foreground">{t('library.subtitle')}</p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder={t('library.search')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12 rounded-xl border-primary/20 focus:border-primary bg-card"
          aria-label="Search verses"
        />
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Filter className="h-5 w-5 text-primary mr-2" />
          <span className="font-medium text-foreground">{t('library.filter')}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "outline"}
              className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                selectedCategory === category.value
                  ? "bg-gradient-primary text-primary-foreground shadow-glow"
                  : "border-primary/30 hover:border-primary hover:bg-primary/5"
              }`}
              onClick={() => setSelectedCategory(category.value)}
            >
              {category.value === "" ? t('library.all') : category.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* Verses Grid */}
      <div className="space-y-4">
        {filteredVerses.length === 0 ? (
          <Card className="p-8 text-center bg-gradient-card border-primary/10">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No verses found matching your criteria</p>
          </Card>
        ) : (
          filteredVerses.map((verse) => (
            <Card
              key={verse.id}
              className="p-6 bg-gradient-card border-primary/10 hover:shadow-card transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="flex justify-between items-start mb-4">
                <Badge
                  variant="secondary"
                  className="bg-secondary/10 text-secondary-foreground border-secondary/20"
                >
                  {verse.theme_category}
                </Badge>
                <div className="flex items-center gap-2">
                  <ShareDialog 
                    verse={verse}
                    trigger={
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-primary"
                        aria-label="Share verse"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    }
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFavorite(verse.id)}
                    className="text-muted-foreground hover:text-accent"
                    disabled={favoriteVerse.isPending}
                    aria-label="Add to favorites"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Arabic Text */}
              <div className="mb-4">
                <p className="font-arabic text-2xl text-foreground leading-relaxed text-right">
                  {verse.arabic_text}
                </p>
              </div>

              {/* English Translation */}
        <div className="mb-4">
          <p className="text-muted-foreground text-lg italic leading-relaxed">
            "{verse.translated_text || verse.english_translation}"
          </p>
        </div>

              {/* Reference */}
              <div className="flex justify-between items-center pt-4 border-t border-border">
                <span className="text-sm font-medium text-primary">
                  Surah {verse.surah_number}:{verse.ayah_number}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-primary/20 text-primary hover:bg-primary/5"
                  onClick={() => navigate(`/customize?verseId=${verse.id}`)}
                >
          {t('library.generateWallpaper')}
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Results Count */}
      {filteredVerses.length > 0 && (
        <div className="mt-8 text-center">
          <p className="text-muted-foreground">
            Showing {filteredVerses.length} of {verses?.length || 0} verses
          </p>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Library;
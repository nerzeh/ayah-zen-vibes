import { NavLink, useLocation } from "react-router-dom";
import { Home, BookOpen, Palette, Settings, Heart, Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const BottomNavigation = () => {
  const location = useLocation();
  const { t } = useLanguage();

  const navItems = [
    { path: "/", icon: Home, label: t('nav.home') },
    { path: "/library", icon: BookOpen, label: t('nav.library') },
    { path: "/customize", icon: Plus, label: t('nav.create'), highlight: true },
    { path: "/favorites", icon: Heart, label: t('nav.favorites') },
    { path: "/settings", icon: Settings, label: t('nav.settings') },
  ];

  return (
    <>
      {/* Safe area for iOS home indicator */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border/50 z-50 pb-safe">
        <div className="flex items-center justify-around px-2 py-2 max-w-md mx-auto">
          {navItems.map(({ path, icon: Icon, label, highlight }) => {
            const isActive = location.pathname === path;
            
            return (
              <NavLink
                key={path}
                to={path}
                className={`relative flex flex-col items-center justify-center min-w-0 flex-1 px-2 py-2 rounded-2xl transition-all duration-300 group ${
                  isActive && !highlight
                    ? "bg-primary/10 text-primary"
                    : !isActive && highlight
                    ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
                aria-label={label}
              >
                {/* Highlight indicator for active non-highlight items */}
                {isActive && !highlight && (
                  <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-primary rounded-full" />
                )}
                
                <div className={`p-2 rounded-xl transition-all duration-300 ${
                  isActive && !highlight 
                    ? "bg-primary/20 scale-110" 
                    : highlight && !isActive
                    ? "bg-white/20"
                    : isActive && highlight
                    ? "bg-white/30 scale-110"
                    : "group-hover:bg-muted/30"
                }`}>
                  <Icon 
                    className={`h-5 w-5 transition-all duration-300 ${
                      isActive || highlight ? "" : "group-hover:scale-105"
                    }`} 
                  />
                </div>
                
                <span className={`text-[10px] font-medium mt-0.5 transition-all duration-300 leading-tight ${
                  isActive && !highlight 
                    ? "text-primary" 
                    : highlight
                    ? "text-white"
                    : ""
                }`}>
                  {label}
                </span>
              </NavLink>
            );
          })}
        </div>
      </div>
      
      {/* Spacer to prevent content from being hidden behind the bottom nav */}
      <div className="h-20 pb-safe" />
    </>
  );
};

export default BottomNavigation;
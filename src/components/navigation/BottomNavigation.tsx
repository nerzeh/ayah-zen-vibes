import { NavLink, useLocation } from "react-router-dom";
import { Home, BookOpen, Palette, Settings, Heart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const BottomNavigation = () => {
  const location = useLocation();
  const { t } = useLanguage();

  const navItems = [
    { path: "/", icon: Home, label: t('nav.home') },
    { path: "/library", icon: BookOpen, label: t('nav.library') },
    { path: "/favorites", icon: Heart, label: t('nav.favorites') },
    { path: "/customize", icon: Palette, label: t('nav.customize') },
    { path: "/settings", icon: Settings, label: t('nav.settings') },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex items-center justify-around px-1 py-3">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          
          return (
            <NavLink
              key={path}
              to={path}
              className={`flex flex-col items-center justify-center min-w-0 flex-1 px-1 py-1 rounded-xl transition-all duration-300 ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
              aria-label={label}
            >
               <div className={`p-2 rounded-full transition-all duration-300 ${
                 isActive ? "bg-primary/20" : ""
               }`}>
                <Icon 
                  className={`h-5 w-5 transition-all duration-300 ${
                    isActive ? "scale-110" : ""
                  }`} 
                />
              </div>
              <span className={`text-xs font-medium mt-1 transition-all duration-300 ${
                isActive ? "text-primary-foreground" : ""
              }`}>
                {navItems.length === 5 ? label.substring(0, 3) : label}
              </span>
            </NavLink>
          );
        })}
      </div>
      
      {/* Decorative border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-border" />
    </nav>
  );
};

export default BottomNavigation;
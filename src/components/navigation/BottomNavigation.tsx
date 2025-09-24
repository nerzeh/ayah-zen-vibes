import { NavLink, useLocation } from "react-router-dom";
import { Home, BookOpen, Palette, Settings } from "lucide-react";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/library", icon: BookOpen, label: "Library" },
  { path: "/customize", icon: Palette, label: "Customize" },
  { path: "/settings", icon: Settings, label: "Settings" },
];

const BottomNavigation = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex items-center justify-around px-2 py-3">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          
          return (
            <NavLink
              key={path}
              to={path}
              className={`flex flex-col items-center justify-center min-w-0 flex-1 px-2 py-1 rounded-xl transition-all duration-300 ${
                isActive
                  ? "bg-gradient-primary text-primary-foreground shadow-glow"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <div className={`p-2 rounded-full transition-all duration-300 ${
                isActive ? "bg-white/20 shadow-inner" : ""
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
                {label}
              </span>
            </NavLink>
          );
        })}
      </div>
      
      {/* Islamic decorative border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </nav>
  );
};

export default BottomNavigation;
import { Button } from "@/components/ui/button";
import { Download, Moon, Settings } from "lucide-react";
import AuthButton from "@/components/auth/AuthButton";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const Header = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">آ</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">{t('home.title')}</h1>
            <p className="text-xs text-muted-foreground">{t('home.subtitle')}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => navigate('/settings')}
          >
            <Settings className="h-4 w-4" />
          </Button>
          <AuthButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
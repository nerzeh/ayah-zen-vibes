import { Button } from "@/components/ui/button";
import { Settings, Menu } from "lucide-react";
import AuthButton from "@/components/auth/AuthButton";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { usePremium } from "@/contexts/PremiumContext";
import PremiumBadge from "@/components/premium/PremiumBadge";

const Header = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  const { isPremium } = usePremium();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex h-14 items-center justify-between px-4">
        {/* Left side - App branding */}
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
            <span className="text-sm font-bold text-primary-foreground">آ</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-semibold text-foreground">{t('home.title')}</h1>
              {user && isPremium && <PremiumBadge />}
            </div>
          </div>
        </div>
        
        {/* Right side - Actions */}
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 rounded-full"
            onClick={() => navigate('/settings')}
          >
            <Settings className="h-5 w-5" />
          </Button>
          <AuthButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
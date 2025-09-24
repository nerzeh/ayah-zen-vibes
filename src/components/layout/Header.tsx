import { Button } from "@/components/ui/button";
import { Download, Moon, Settings } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
            <span className="text-sm font-bold text-primary-foreground">آ</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Ayah Wallpapers</h1>
            <p className="text-xs text-muted-foreground">Islamic Verse Generator</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Moon className="h-4 w-4" />
          </Button>
          <Button variant="default" size="sm" className="h-8">
            <Download className="mr-1 h-3 w-3" />
            Download
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
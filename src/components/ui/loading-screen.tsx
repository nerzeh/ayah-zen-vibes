import { Loader2, Star, Moon } from "lucide-react";

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
}

const LoadingScreen = ({ message = "Loading...", fullScreen = false }: LoadingScreenProps) => {
  const containerClasses = fullScreen 
    ? "fixed inset-0 bg-background/80 backdrop-blur-sm z-50" 
    : "w-full h-full min-h-[200px]";

  return (
    <div className={`${containerClasses} flex items-center justify-center`}>
      <div className="text-center space-y-4">
        {/* Islamic-inspired loading animation */}
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary mx-auto"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Moon className="h-6 w-6 text-primary animate-pulse" />
          </div>
        </div>
        
        {/* Decorative stars */}
        <div className="flex justify-center items-center space-x-4">
          <Star className="h-3 w-3 text-secondary animate-pulse" style={{ animationDelay: '0ms' }} />
          <Star className="h-2 w-2 text-secondary animate-pulse" style={{ animationDelay: '200ms' }} />
          <Star className="h-4 w-4 text-secondary animate-pulse" style={{ animationDelay: '400ms' }} />
          <Star className="h-2 w-2 text-secondary animate-pulse" style={{ animationDelay: '600ms' }} />
          <Star className="h-3 w-3 text-secondary animate-pulse" style={{ animationDelay: '800ms' }} />
        </div>

        {/* Loading message */}
        <div className="space-y-2">
          <p className="text-foreground font-medium">{message}</p>
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
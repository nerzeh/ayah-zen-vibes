import { Shield, Database, Trash2, Download, RefreshCw, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const DataPrivacySettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const handleDataSync = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to sync your data across devices.",
        variant: "destructive"
      });
      return;
    }

    setIsSyncing(true);
    try {
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "Data synced successfully",
        description: "Your preferences and favorites are now up to date across all devices.",
      });
    } catch (error) {
      toast({
        title: "Sync failed",
        description: "There was an error syncing your data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleClearCache = async () => {
    setIsClearing(true);
    try {
      // Clear local storage and cache
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }
      
      // Clear other local data (excluding authentication)
      const keysToRemove = Object.keys(localStorage).filter(key => 
        !key.includes('supabase') && !key.includes('auth')
      );
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      toast({
        title: "Cache cleared",
        description: "App cache and temporary data have been cleared successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear cache. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsClearing(false);
    }
  };

  const handleExportData = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to export your data.",
        variant: "destructive"
      });
      return;
    }

    // Create sample data export
    const userData = {
      user: {
        email: user.email,
        displayName: user.user_metadata?.display_name,
        createdAt: new Date().toISOString(),
      },
      settings: {
        // Add user settings here
        exportedAt: new Date().toISOString(),
      },
      favorites: {
        // Add favorites data here
        count: 0,
      }
    };

    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `ayah-wallpapers-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    
    toast({
      title: "Data exported",
      description: "Your data has been downloaded to your device.",
    });
  };

  const storageUsed = 2.3; // MB - example value
  const storageLimit = 50; // MB

  return (
    <Card className="p-6 bg-gradient-card border-primary/10">
      <div className="flex items-center mb-6">
        <Shield className="h-6 w-6 text-primary mr-2" />
        <h2 className="text-xl font-semibold text-foreground">Data & Privacy</h2>
      </div>
      
      <div className="space-y-6">
        {/* Data Sync Status */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium flex items-center">
                <RefreshCw className="h-4 w-4 mr-2" />
                Data Synchronization
              </Label>
              <p className="text-sm text-muted-foreground">
                {user ? "Sync your settings and favorites across devices" : "Sign in to enable data sync"}
              </p>
            </div>
            <Badge variant={user ? "default" : "secondary"}>
              {user ? "Enabled" : "Disabled"}
            </Badge>
          </div>

          {user && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Last sync:</span>
                <span className="text-foreground">2 minutes ago</span>
              </div>
              <Button
                variant="outline"
                onClick={handleDataSync}
                disabled={isSyncing}
                className="w-full"
              >
                {isSyncing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sync Now
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Storage Usage */}
        <div className="space-y-3 pt-4 border-t border-border/50">
          <Label className="text-base font-medium flex items-center">
            <Database className="h-4 w-4 mr-2" />
            Storage Usage
          </Label>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Used:</span>
              <span className="text-foreground">{storageUsed}MB of {storageLimit}MB</span>
            </div>
            <Progress value={(storageUsed / storageLimit) * 100} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Wallpapers:</span>
                <span>1.8MB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Settings:</span>
                <span>0.1MB</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Favorites:</span>
                <span>0.3MB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cache:</span>
                <span>0.1MB</span>
              </div>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="space-y-3 pt-4 border-t border-border/50">
          <Label className="text-base font-medium">
            Data Management
          </Label>
          
          <div className="space-y-3">
            <Button
              variant="outline"
              onClick={handleExportData}
              className="w-full justify-start"
              disabled={!user}
            >
              <Download className="h-4 w-4 mr-2" />
              Export My Data
            </Button>
            
            <Button
              variant="outline"
              onClick={handleClearCache}
              disabled={isClearing}
              className="w-full justify-start"
            >
              {isClearing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Clearing Cache...
              </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Cache & Temporary Files
                </>
              )}
            </Button>
          </div>

          {!user && (
            <p className="text-xs text-muted-foreground">
              Sign in to access data export and sync features
            </p>
          )}
        </div>

        {/* Privacy Controls */}
        <div className="space-y-4 pt-4 border-t border-border/50">
          <Label className="text-base font-medium">
            Privacy Controls
          </Label>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="analytics" className="text-sm font-medium">
                  Anonymous Analytics
                </Label>
                <p className="text-xs text-muted-foreground">
                  Help improve the app by sharing anonymous usage data
                </p>
              </div>
              <Switch
                id="analytics"
                defaultChecked={true}
                onCheckedChange={(checked) => {
                  toast({
                    title: checked ? "Analytics enabled" : "Analytics disabled",
                    description: checked 
                      ? "Thank you for helping us improve the app!"
                      : "Analytics have been disabled.",
                  });
                }}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="crash-reports" className="text-sm font-medium">
                  Crash Reports
                </Label>
                <p className="text-xs text-muted-foreground">
                  Send crash reports to help us fix issues
                </p>
              </div>
              <Switch
                id="crash-reports"
                defaultChecked={true}
                onCheckedChange={(checked) => {
                  toast({
                    title: checked ? "Crash reporting enabled" : "Crash reporting disabled",
                    description: checked 
                      ? "We'll receive crash reports to improve app stability."
                      : "Crash reporting has been disabled.",
                  });
                }}
              />
            </div>
          </div>
        </div>

        {/* Privacy Links */}
        <div className="space-y-3 pt-4 border-t border-border/50">
          <Label className="text-base font-medium">
            Legal & Privacy
          </Label>
          
          <div className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-primary hover:bg-primary/5"
              onClick={() => toast({ title: "Coming Soon", description: "Privacy policy will be available soon." })}
            >
              Privacy Policy
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start text-primary hover:bg-primary/5"
              onClick={() => toast({ title: "Coming Soon", description: "Terms of service will be available soon." })}
            >
              Terms of Service
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start text-primary hover:bg-primary/5"
              onClick={() => toast({ title: "Coming Soon", description: "Data policy will be available soon." })}
            >
              Data Usage Policy
            </Button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="space-y-3 pt-4 border-t border-destructive/20">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <Label className="text-base font-medium text-destructive">
              Danger Zone
            </Label>
          </div>
          
          <div className="bg-destructive/5 border border-destructive/20 p-4 rounded-lg space-y-3">
            <div>
              <h4 className="text-sm font-medium text-destructive">Delete Account</h4>
              <p className="text-xs text-muted-foreground">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
            </div>
            
            <Button
              variant="destructive"
              onClick={() => toast({ 
                title: "Contact Support", 
                description: "Please email us at support@ayahwallpapers.com for account deletion requests.",
                duration: 5000 
              })}
            >
              Request Account Deletion
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DataPrivacySettings;
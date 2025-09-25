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
import { useLanguage } from "@/contexts/LanguageContext";

const DataPrivacySettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const { t } = useLanguage();
  const handleDataSync = async () => {
    if (!user) {
      toast({
        title: t('privacy.signInRequired', 'Sign in required'),
        description: t('privacy.signInToSync', 'Please sign in to sync your data across devices.'),
        variant: "destructive"
      });
      return;
    }

    setIsSyncing(true);
    try {
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: t('privacy.syncSuccess'),
        description: t('privacy.syncSuccessDesc'),
      });
    } catch (error) {
      toast({
        title: t('privacy.syncFailed'),
        description: t('privacy.syncFailedDesc'),
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
        title: t('privacy.cacheCleared'),
        description: t('privacy.cacheClearedDesc'),
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('privacy.cacheClearError'),
        variant: "destructive"
      });
    } finally {
      setIsClearing(false);
    }
  };

  const handleExportData = () => {
    if (!user) {
      toast({
        title: t('privacy.signInRequired', 'Sign in required'),
        description: t('privacy.signInToExport', 'Please sign in to export your data.'),
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
      title: t('privacy.dataExported'),
      description: t('privacy.dataExportedDesc'),
    });
  };

  const storageUsed = 2.3; // MB - example value
  const storageLimit = 50; // MB

  return (
    <Card className="p-6 bg-gradient-card border-primary/10">
      <div className="flex items-center mb-6">
        <Shield className="h-6 w-6 text-primary mr-2" />
        <h2 className="text-xl font-semibold text-foreground">{t('settings.privacy')}</h2>
      </div>
      
      <div className="space-y-6">
        {/* Data Sync Status */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium flex items-center">
                <RefreshCw className="h-4 w-4 mr-2" />
                {t('privacy.dataSync')}
              </Label>
              <p className="text-sm text-muted-foreground">
                {user ? t('privacy.dataSyncDesc') : t('privacy.dataSyncDisabled')}
              </p>
            </div>
            <Badge variant={user ? "default" : "secondary"}>
              {user ? t('privacy.enabled') : t('privacy.disabled')}
            </Badge>
          </div>

          {user && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t('privacy.lastSync')}</span>
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
                      {t('privacy.syncing')}
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      {t('privacy.syncNow')}
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
            {t('privacy.storage')}
          </Label>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t('privacy.used')}</span>
              <span className="text-foreground">{storageUsed}MB of {storageLimit}MB</span>
            </div>
            <Progress value={(storageUsed / storageLimit) * 100} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('privacy.wallpapers')}</span>
                <span>1.8MB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('privacy.settings')}</span>
                <span>0.1MB</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('privacy.favorites')}</span>
                <span>0.3MB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('privacy.cache')}</span>
                <span>0.1MB</span>
              </div>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="space-y-3 pt-4 border-t border-border/50">
          <Label className="text-base font-medium">
            {t('privacy.dataManagement')}
          </Label>
          
          <div className="space-y-3">
            <Button
              variant="outline"
              onClick={handleExportData}
              className="w-full justify-start"
              disabled={!user}
            >
              <Download className="h-4 w-4 mr-2" />
              {t('privacy.exportData')}
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
                {t('privacy.clearingCache')}
              </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t('privacy.clearCache')}
                </>
              )}
            </Button>
          </div>

          {!user && (
            <p className="text-xs text-muted-foreground">
              {t('privacy.signInToExport')}
            </p>
          )}
        </div>

        {/* Privacy Controls */}
        <div className="space-y-4 pt-4 border-t border-border/50">
          <Label className="text-base font-medium">
            {t('privacy.privacyControls')}
          </Label>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="analytics" className="text-sm font-medium">
                  {t('privacy.analytics')}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {t('privacy.analyticsDesc')}
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
                  {t('privacy.crashReports')}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {t('privacy.crashReportsDesc')}
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
            {t('privacy.legal')}
          </Label>
          
          <div className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-primary hover:bg-primary/5"
              onClick={() => toast({ title: t('privacy.comingSoon'), description: t('privacy.policyComingSoon') })}
            >
              {t('privacy.privacyPolicy')}
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start text-primary hover:bg-primary/5"
              onClick={() => toast({ title: t('privacy.comingSoon'), description: t('privacy.termsComingSoon') })}
            >
              {t('privacy.termsOfService')}
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start text-primary hover:bg-primary/5"
              onClick={() => toast({ title: t('privacy.comingSoon'), description: t('privacy.dataComingSoon') })}
            >
              {t('privacy.dataPolicy')}
            </Button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="space-y-3 pt-4 border-t border-destructive/20">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <Label className="text-base font-medium text-destructive">
              {t('privacy.dangerZone')}
            </Label>
          </div>
          
          <div className="bg-destructive/5 border border-destructive/20 p-4 rounded-lg space-y-3">
            <div>
              <h4 className="text-sm font-medium text-destructive">{t('privacy.deleteAccount')}</h4>
              <p className="text-xs text-muted-foreground">
                {t('privacy.deleteAccountDesc')}
              </p>
            </div>
            
            <Button
              variant="destructive"
              onClick={() => toast({ 
                title: t('account.contactSupport'), 
                description: t('account.deletionRequest'),
                duration: 5000 
              })}
            >
              {t('privacy.requestDeletion')}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DataPrivacySettings;
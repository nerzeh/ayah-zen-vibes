import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User, Mail, Camera, LogOut, Edit2, Check, X } from 'lucide-react';

const AccountSettings = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.user_metadata?.display_name || '');

  if (!user) return null;

  const userInitials = (user.user_metadata?.display_name || user.email?.split('@')[0] || 'U')
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
  };

  const handleSaveProfile = async () => {
    if (!user || !displayName.trim()) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          display_name: displayName.trim(),
          email: user.email
        });

      if (error) {
        console.error('Error updating profile:', error);
        toast({
          title: "Error",
          description: "Failed to update profile. Please try again.",
          variant: "destructive"
        });
        return;
      }

      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your display name has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setDisplayName(user?.user_metadata?.display_name || '');
  };

  return (
    <Card className="p-6 bg-gradient-card border-primary/10">
      <div className="flex items-center mb-6">
        <User className="h-6 w-6 text-primary mr-2" />
        <h2 className="text-xl font-semibold text-foreground">Account</h2>
      </div>
      
      <div className="space-y-6">
        {/* Profile Picture Section */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.user_metadata?.avatar_url} alt={displayName} />
              <AvatarFallback className="text-lg bg-primary/10 text-primary">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <Button
              size="sm"
              variant="outline"
              className="absolute -bottom-1 -right-1 h-8 w-8 p-0 rounded-full bg-background border-2"
              onClick={() => toast({ title: "Coming Soon", description: "Profile picture upload will be available soon!" })}
            >
              <Camera className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="flex-1">
            <h3 className="font-medium text-foreground">Profile Picture</h3>
            <p className="text-sm text-muted-foreground">
              Add a photo to personalize your account
            </p>
          </div>
        </div>

        {/* Display Name */}
        <div className="space-y-2">
          <Label htmlFor="display-name" className="text-base font-medium">
            Display Name
          </Label>
          {isEditing ? (
            <div className="flex space-x-2">
              <Input
                id="display-name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your display name"
                className="flex-1"
              />
              <Button size="sm" onClick={handleSaveProfile}>
                <Check className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <p className="text-foreground flex-1">
                {user.user_metadata?.display_name || 'No display name set'}
              </p>
              <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label className="text-base font-medium flex items-center">
            <Mail className="h-4 w-4 mr-2" />
            Email Address
          </Label>
          <div className="flex items-center justify-between">
            <p className="text-foreground">{user.email}</p>
            <Button size="sm" variant="outline" disabled>
              Verified
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Email changes require verification and will be available soon
          </p>
        </div>

        {/* Account Actions */}
        <div className="pt-4 border-t border-border/50">
          <div className="space-y-3">
            <Button 
              variant="outline" 
              onClick={handleSignOut}
              className="w-full justify-start border-destructive/20 text-destructive hover:bg-destructive/5"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start border-muted text-muted-foreground"
              onClick={() => toast({ 
                title: "Contact Support", 
                description: "Please email us at support@ayahwallpapers.com for account deletion requests." 
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

export default AccountSettings;
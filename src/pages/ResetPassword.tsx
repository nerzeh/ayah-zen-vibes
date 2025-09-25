import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { usePasswordReset } from '@/hooks/usePasswordReset';
import { useAuth } from '@/contexts/AuthContext';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { updatePassword, isLoading } = usePasswordReset();
  const { user } = useAuth();

  useEffect(() => {
    // Check if we have the required tokens
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    const type = searchParams.get('type');

    if (type !== 'recovery' || !accessToken || !refreshToken) {
      // Invalid reset link
      navigate('/signin', { 
        replace: true,
        state: { error: 'Invalid or expired reset link' }
      });
    }
  }, [searchParams, navigate]);

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    
    return {
      minLength,
      hasUpper,
      hasLower,
      hasNumber,
      isValid: minLength && hasUpper && hasLower && hasNumber
    };
  };

  const passwordValidation = validatePassword(password);
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordValidation.isValid || !passwordsMatch) return;

    const result = await updatePassword(password, confirmPassword);
    
    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 3000);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/80 to-primary/5 flex items-center justify-center px-4">
        <Card className="w-full max-w-md p-8 text-center bg-gradient-card border-primary/10">
          <div className="mb-6">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Password Updated Successfully
            </h1>
            <p className="text-muted-foreground mb-6">
              Your password has been reset. You will be redirected to the homepage shortly.
            </p>
            <Button 
              onClick={() => navigate('/')}
              className="w-full bg-gradient-primary text-primary-foreground hover:shadow-glow"
            >
              Continue to App
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/80 to-primary/5 flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8 bg-gradient-card border-primary/10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Reset Your Password</h1>
            <p className="text-muted-foreground mt-2">
              Enter your new password below
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* New Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Password Requirements */}
          {password && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Password requirements:</p>
              <div className="space-y-1">
                {[
                  { key: 'minLength', text: 'At least 8 characters' },
                  { key: 'hasUpper', text: 'One uppercase letter' },
                  { key: 'hasLower', text: 'One lowercase letter' },
                  { key: 'hasNumber', text: 'One number' }
                ].map(({ key, text }) => (
                  <div key={key} className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        passwordValidation[key as keyof typeof passwordValidation]
                          ? 'bg-green-500'
                          : 'bg-muted'
                      }`}
                    />
                    <span
                      className={`text-xs ${
                        passwordValidation[key as keyof typeof passwordValidation]
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {confirmPassword && !passwordsMatch && (
              <p className="text-xs text-destructive">Passwords do not match</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-gradient-primary text-primary-foreground hover:shadow-glow"
            disabled={isLoading || !passwordValidation.isValid || !passwordsMatch}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Updating Password...
              </div>
            ) : (
              <>
                <Lock className="h-4 w-4 mr-2" />
                Update Password
              </>
            )}
          </Button>
        </form>

        <div className="text-center mt-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/signin')}
            className="text-sm text-muted-foreground hover:text-primary"
          >
            Back to Sign In
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ResetPassword;
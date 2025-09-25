import { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { usePasswordReset } from '@/hooks/usePasswordReset';

interface PasswordResetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PasswordResetDialog = ({ open, onOpenChange }: PasswordResetDialogProps) => {
  const [email, setEmail] = useState('');
  const { requestPasswordReset, isLoading, emailSent, setEmailSent } = usePasswordReset();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    await requestPasswordReset(email);
  };

  const handleClose = () => {
    setEmail('');
    setEmailSent(false);
    onOpenChange(false);
  };

  const handleBackToForm = () => {
    setEmailSent(false);
    setEmail('');
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            {emailSent ? 'Check Your Email' : 'Reset Password'}
          </DialogTitle>
          <DialogDescription>
            {emailSent 
              ? "We've sent you a password reset link. Check your email and follow the instructions."
              : "Enter your email address and we'll send you a link to reset your password."
            }
          </DialogDescription>
        </DialogHeader>

        {!emailSent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email Address</Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="w-full"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isLoading || !email.trim()}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Sending...
                  </div>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Reset Link
                  </>
                )}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="text-center py-6">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Email Sent Successfully
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                We've sent a password reset link to:
              </p>
              <p className="font-medium text-primary">{email}</p>
            </div>

            <div className="space-y-2">
              <Button
                onClick={handleClose}
                className="w-full"
              >
                Done
              </Button>
              <Button
                variant="ghost"
                onClick={handleBackToForm}
                className="w-full"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Try Different Email
              </Button>
            </div>

            <div className="text-xs text-muted-foreground text-center space-y-1">
              <p>Didn't receive the email? Check your spam folder.</p>
              <p>The reset link will expire in 1 hour.</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
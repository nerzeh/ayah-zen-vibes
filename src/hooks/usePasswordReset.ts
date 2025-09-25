import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address').trim(),
});

const passwordResetSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const usePasswordReset = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  const requestPasswordReset = async (email: string) => {
    setIsLoading(true);
    
    try {
      // Validate email
      const validEmail = emailSchema.parse({ email });
      
      const { error } = await supabase.auth.resetPasswordForEmail(validEmail.email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        if (error.message.includes('rate_limit')) {
          throw new Error('Too many password reset attempts. Please wait before trying again.');
        }
        throw error;
      }

      setEmailSent(true);
      toast({
        title: "Password Reset Email Sent",
        description: "Check your email for password reset instructions",
      });

      return { success: true };
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to send password reset email';
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });

      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (password: string, confirmPassword: string) => {
    setIsLoading(true);
    
    try {
      // Validate passwords
      const validPasswords = passwordResetSchema.parse({ password, confirmPassword });
      
      const { error } = await supabase.auth.updateUser({
        password: validPasswords.password
      });

      if (error) {
        if (error.message.includes('same as the old password')) {
          throw new Error('New password must be different from your current password');
        }
        throw error;
      }

      toast({
        title: "Password Updated",
        description: "Your password has been successfully updated",
      });

      return { success: true };
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to update password';
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });

      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    requestPasswordReset,
    updatePassword,
    isLoading,
    emailSent,
    setEmailSent,
  };
};
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, BookOpen, Heart, Download, Clock, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Welcome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/" replace />;
  }

  const benefits = [
    {
      icon: Heart,
      title: 'Save Favorites',
      description: 'Keep your beloved verses close to your heart'
    },
    {
      icon: Clock,
      title: 'Daily Inspiration',
      description: 'Receive fresh Quranic verses every day'
    },
    {
      icon: Download,
      title: 'High Quality',
      description: 'Download beautiful wallpapers in HD quality'
    },
    {
      icon: Shield,
      title: 'Sync Across Devices',
      description: 'Access your preferences anywhere, anytime'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-primary mb-4">
              <span className="text-2xl font-bold text-primary-foreground">آ</span>
            </div>
            <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-secondary animate-pulse" />
          </div>
          
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
              Ayah Wallpapers
            </h1>
            <p className="text-lg text-muted-foreground">
              Beautiful Islamic wallpapers with daily Quranic inspiration
            </p>
          </div>
        </div>

        {/* Islamic Pattern Background */}
        <Card className="relative p-8 bg-gradient-card border-primary/20 overflow-hidden">
          {/* Decorative Islamic Pattern */}
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M30 0l30 30-30 30L0 30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          
          <div className="relative space-y-6">
            {/* Benefits Grid */}
            <div className="grid grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center space-y-2">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-foreground">{benefit.title}</h3>
                    <p className="text-xs text-muted-foreground leading-tight">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Sample Verse Preview */}
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-4 rounded-lg border border-primary/10">
              <p className="text-center font-arabic text-lg text-foreground mb-2">
                وَمَن يَتَّقِ ٱللَّهَ يَجْعَل لَّهُۥ مَخْرَجًۭا
              </p>
              <p className="text-center text-sm text-muted-foreground italic">
                "And whoever fears Allah, He will make for him a way out."
              </p>
              <p className="text-center text-xs text-primary mt-1">
                Quran 65:2
              </p>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link to="/signup">
            <Button 
              className="w-full"
              size="lg"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Get Started - Sign Up
            </Button>
          </Link>
          
          <Link to="/signin">
            <Button 
              variant="outline" 
              className="w-full border-primary/20 hover:bg-primary/5"
              size="lg"
            >
              Sign In
            </Button>
          </Link>
          
          <Button 
            variant="ghost" 
            className="w-full text-muted-foreground hover:text-foreground"
            onClick={() => navigate('/')}
          >
            Continue as Guest
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            By continuing, you agree to our{' '}
            <button className="underline hover:text-foreground">Terms of Service</button>
            {' '}and{' '}
            <button className="underline hover:text-foreground">Privacy Policy</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
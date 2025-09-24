import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AccessibilitySettings {
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  highContrast: boolean;
  reducedMotion: boolean;
  screenReaderMode: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (settings: Partial<AccessibilitySettings>) => void;
  announceToScreenReader: (message: string) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

const defaultSettings: AccessibilitySettings = {
  fontSize: 'medium',
  highContrast: false,
  reducedMotion: false,
  screenReaderMode: false
};

interface AccessibilityProviderProps {
  children: ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    const stored = localStorage.getItem('accessibilitySettings');
    return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
  });

  const [announcement, setAnnouncement] = useState<string>('');

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
  }, [settings]);

  // Apply CSS classes based on settings
  useEffect(() => {
    const root = document.documentElement;
    
    // Font size
    root.classList.remove('text-sm', 'text-base', 'text-lg', 'text-xl');
    switch (settings.fontSize) {
      case 'small':
        root.classList.add('text-sm');
        break;
      case 'medium':
        root.classList.add('text-base');
        break;
      case 'large':
        root.classList.add('text-lg');
        break;
      case 'extra-large':
        root.classList.add('text-xl');
        break;
    }

    // High contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Reduced motion
    if (settings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    // Screen reader mode
    if (settings.screenReaderMode) {
      root.classList.add('screen-reader-mode');
    } else {
      root.classList.remove('screen-reader-mode');
    }
  }, [settings]);

  // Detect system preferences
  useEffect(() => {
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
    
    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setSettings(prev => ({ ...prev, reducedMotion: e.matches }));
    };

    const handleHighContrastChange = (e: MediaQueryListEvent) => {
      setSettings(prev => ({ ...prev, highContrast: e.matches }));
    };

    reducedMotionQuery.addEventListener('change', handleReducedMotionChange);
    highContrastQuery.addEventListener('change', handleHighContrastChange);

    // Set initial values
    if (reducedMotionQuery.matches) {
      setSettings(prev => ({ ...prev, reducedMotion: true }));
    }
    if (highContrastQuery.matches) {
      setSettings(prev => ({ ...prev, highContrast: true }));
    }

    return () => {
      reducedMotionQuery.removeEventListener('change', handleReducedMotionChange);
      highContrastQuery.removeEventListener('change', handleHighContrastChange);
    };
  }, []);

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const announceToScreenReader = (message: string) => {
    setAnnouncement(message);
    // Clear announcement after screen reader has time to read it
    setTimeout(() => setAnnouncement(''), 1000);
  };

  return (
    <AccessibilityContext.Provider value={{ settings, updateSettings, announceToScreenReader }}>
      {children}
      
      {/* Screen reader announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>
      
      {/* Skip to main content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium transition-all duration-200"
      >
        Skip to main content
      </a>
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
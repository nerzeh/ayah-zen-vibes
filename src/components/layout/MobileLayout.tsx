import React from 'react';
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

interface MobileLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  navigation?: React.ReactNode;
  className?: string;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ 
  children, 
  header, 
  navigation,
  className 
}) => {
  return (
    <div className={cn("min-h-screen flex flex-col bg-background", className)}>
      {/* Header */}
      {header}
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          {children}
        </div>
      </main>
      
      {/* Bottom Navigation */}
      {navigation}
    </div>
  );
};

export default MobileLayout;
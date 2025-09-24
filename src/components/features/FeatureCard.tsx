import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient?: string;
}

const FeatureCard = ({ icon: Icon, title, description, gradient = "bg-gradient-primary" }: FeatureCardProps) => {
  return (
    <Card className="group relative overflow-hidden border-border/40 bg-card/50 backdrop-blur-sm hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
      <div className="p-6 space-y-4">
        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${gradient} shadow-glow group-hover:animate-glow`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      
      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 bg-islamic-pattern opacity-5 group-hover:opacity-10 transition-opacity" />
    </Card>
  );
};

export default FeatureCard;
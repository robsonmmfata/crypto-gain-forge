import React from 'react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Shield, Zap, Users } from 'lucide-react';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-surface to-surface-elevated">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary))_0%,transparent_20%)] opacity-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--accent))_0%,transparent_20%)] opacity-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--success))_0%,transparent_30%)] opacity-5" />
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-8">
            <Shield className="w-4 h-4 text-primary mr-2" />
            <span className="text-sm font-medium text-primary">Secure & Regulated Platform</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-primary via-accent to-success bg-clip-text text-transparent">
              Maximize Your
            </span>
            <br />
            <span className="text-foreground">Crypto Returns</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of investors earning daily returns with our 
            AI-powered investment strategies. Start with as little as $100.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-card/50 backdrop-blur border border-card-border rounded-xl p-4">
              <div className="text-2xl font-bold text-accent">$2.5M+</div>
              <div className="text-sm text-muted-foreground">Total Invested</div>
            </div>
            <div className="bg-card/50 backdrop-blur border border-card-border rounded-xl p-4">
              <div className="text-2xl font-bold text-success">15.2%</div>
              <div className="text-sm text-muted-foreground">Average ROI</div>
            </div>
            <div className="bg-card/50 backdrop-blur border border-card-border rounded-xl p-4">
              <div className="text-2xl font-bold text-primary">5,000+</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="bg-card/50 backdrop-blur border border-card-border rounded-xl p-4">
              <div className="text-2xl font-bold text-accent">24/7</div>
              <div className="text-sm text-muted-foreground">Support</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button 
              variant="hero" 
              size="lg"
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto text-lg px-8 py-4"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              Start Investing Today
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/plans')}
              className="w-full sm:w-auto text-lg px-8 py-4"
            >
              View Investment Plans
            </Button>
          </div>

          {/* Feature Icons */}
          <div className="flex items-center justify-center space-x-8 text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-primary" />
              <span className="text-sm">Instant Deposits</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-success" />
              <span className="text-sm">Secure Platform</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-accent" />
              <span className="text-sm">24/7 Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-20 w-16 h-16 bg-success/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }} />
    </section>
  );
};

export default HeroSection;
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import {
  AlertTriangle,
  Wifi,
  RefreshCw,
  Home,
  ArrowLeft,
  Zap,
  Shield,
  Bug,
  Server,
  Globe
} from 'lucide-react';

interface ErrorComponentProps {
  type?: '404' | '500' | 'network' | 'auth' | 'generic';
  title?: string;
  message?: string;
  onRetry?: () => void;
  onGoHome?: () => void;
  onGoBack?: () => void;
  showRetry?: boolean;
  showHome?: boolean;
  showBack?: boolean;
}

const ErrorComponent: React.FC<ErrorComponentProps> = ({
  type = 'generic',
  title,
  message,
  onRetry,
  onGoHome,
  onGoBack,
  showRetry = true,
  showHome = true,
  showBack = true
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    // Generate floating particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3
    }));
    setParticles(newParticles);

    // Trigger animation
    setTimeout(() => setIsAnimating(true), 100);
  }, []);

  const getErrorConfig = () => {
    switch (type) {
      case '404':
        return {
          icon: <Globe className="w-24 h-24 text-blue-500" />,
          defaultTitle: 'Página Não Encontrada',
          defaultMessage: 'A página que você está procurando não existe ou foi movida.',
          gradient: 'from-blue-500 to-cyan-500'
        };
      case '500':
        return {
          icon: <Server className="w-24 h-24 text-red-500" />,
          defaultTitle: 'Erro do Servidor',
          defaultMessage: 'Ocorreu um erro interno no servidor. Tente novamente mais tarde.',
          gradient: 'from-red-500 to-pink-500'
        };
      case 'network':
        return {
          icon: <Wifi className="w-24 h-24 text-orange-500" />,
          defaultTitle: 'Problema de Conexão',
          defaultMessage: 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.',
          gradient: 'from-orange-500 to-yellow-500'
        };
      case 'auth':
        return {
          icon: <Shield className="w-24 h-24 text-purple-500" />,
          defaultTitle: 'Acesso Negado',
          defaultMessage: 'Você não tem permissão para acessar esta página.',
          gradient: 'from-purple-500 to-indigo-500'
        };
      default:
        return {
          icon: <Bug className="w-24 h-24 text-gray-500" />,
          defaultTitle: 'Algo Deu Errado',
          defaultMessage: 'Ocorreu um erro inesperado. Tente novamente.',
          gradient: 'from-gray-500 to-slate-500'
        };
    }
  };

  const config = getErrorConfig();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={`absolute w-2 h-2 bg-primary/20 rounded-full animate-pulse`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: '3s'
            }}
          />
        ))}
      </div>

      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/5 rounded-full animate-bounce"
             style={{ animationDelay: '0.5s', animationDuration: '4s' }} />
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-accent/5 rotate-45 animate-pulse"
             style={{ animationDelay: '1s', animationDuration: '3s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-16 h-16 bg-secondary/5 rounded-lg animate-spin"
             style={{ animationDelay: '2s', animationDuration: '5s' }} />
      </div>

      {/* Main Error Card */}
      <div className={`relative z-10 max-w-2xl w-full bg-card/80 backdrop-blur-xl rounded-3xl border border-border shadow-2xl p-8 md:p-12 transition-all duration-1000 ${
        isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}>

        {/* Error Icon with Gradient Background */}
        <div className="flex justify-center mb-8">
          <div className={`relative p-6 rounded-full bg-gradient-to-r ${config.gradient} shadow-lg`}>
            <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse" />
            <div className="relative">
              {config.icon}
            </div>
          </div>
        </div>

        {/* Error Title */}
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent mb-4">
            {title || config.defaultTitle}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto">
            {message || config.defaultMessage}
          </p>
        </div>

        {/* Error Code Display */}
        <div className="flex justify-center mb-8">
          <div className="bg-muted/50 rounded-lg px-6 py-3 font-mono text-2xl font-bold text-muted-foreground">
            {type === '404' ? '404' : type === '500' ? '500' : 'ERROR'}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {showRetry && onRetry && (
            <Button
              onClick={onRetry}
              className="group relative overflow-hidden bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <RefreshCw className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-500" />
              Tentar Novamente
            </Button>
          )}

          {showBack && onGoBack && (
            <Button
              onClick={onGoBack}
              variant="outline"
              className="group px-8 py-3 rounded-xl font-semibold border-2 hover:bg-muted/50 transition-all duration-300 transform hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
              Voltar
            </Button>
          )}

          {showHome && onGoHome && (
            <Button
              onClick={onGoHome}
              variant="outline"
              className="group px-8 py-3 rounded-xl font-semibold border-2 hover:bg-muted/50 transition-all duration-300 transform hover:scale-105"
            >
              <Home className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
              Página Inicial
            </Button>
          )}
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <Zap className="w-4 h-4" />
            <span>Se o problema persistir, entre em contato com o suporte</span>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 opacity-10">
          <AlertTriangle className="w-16 h-16 text-destructive animate-pulse" />
        </div>
        <div className="absolute bottom-4 left-4 opacity-10">
          <Bug className="w-12 h-12 text-muted-foreground animate-bounce" />
        </div>
      </div>

      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-accent/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background to-muted/20" />
      </div>
    </div>
  );
};

export default ErrorComponent;

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, TrendingUp, Users, Gift, Wallet } from 'lucide-react';

const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      path: '/dashboard',
      icon: Home,
      label: 'Dashboard'
    },
    {
      path: '/dashboard',
      icon: TrendingUp,
      label: 'Trading'
    },
    {
      path: '/investors',
      icon: Users,
      label: 'Investidores'
    },
    {
      path: '/referral',
      icon: Gift,
      label: 'Indicações'
    },
    {
      path: '/wallet',
      icon: Wallet,
      label: 'Carteira'
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex justify-around items-center py-2 px-4">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                active 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, Shield, TrendingUp } from 'lucide-react';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-card/80 backdrop-blur-xl border-b border-card-border sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              CryptoVault Pro
            </h1>
            <p className="text-xs text-muted-foreground">Investment Platform</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className="text-foreground hover:text-primary transition-colors duration-300"
          >
            Home
          </Link>
          <Link 
            to="/plans" 
            className="text-foreground hover:text-primary transition-colors duration-300"
          >
            Investment Plans
          </Link>
          <Link 
            to="/about" 
            className="text-foreground hover:text-primary transition-colors duration-300"
          >
            About
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <div className="hidden md:flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Balance: ${user?.balance.toLocaleString()}
                  </p>
                </div>
                {user?.isAdmin && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/admin')}
                  >
                    <Shield className="w-4 h-4" />
                    Admin
                  </Button>
                )}
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => navigate('/dashboard')}
                >
                  <User className="w-4 h-4" />
                  Dashboard
                </Button>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Logout</span>
              </Button>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
              <Button 
                variant="hero" 
                size="sm"
                onClick={() => navigate('/register')}
              >
                Get Started
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
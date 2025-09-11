import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { apiService } from '@/services/apiService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (from localStorage)
    const token = localStorage.getItem('cryptovault_token');
    const savedUser = localStorage.getItem('cryptovault_user');

    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        // Set token in apiService
        apiService.setToken(token);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('cryptovault_token');
        localStorage.removeItem('cryptovault_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiService.login({ email, password });

      if (response.token && response.user) {
        setUser(response.user);
        localStorage.setItem('cryptovault_token', response.token);
        localStorage.setItem('cryptovault_user', JSON.stringify(response.user));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      const response = await apiService.register({
        username: email,
        email,
        password,
        full_name: name
      });

      if (response.token && response.user) {
        setUser(response.user);
        localStorage.setItem('cryptovault_token', response.token);
        localStorage.setItem('cryptovault_user', JSON.stringify(response.user));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cryptovault_token');
    localStorage.removeItem('cryptovault_user');
    apiService.logout();
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('cryptovault_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
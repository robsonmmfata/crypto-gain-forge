import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users data
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@cryptovault.com',
    name: 'Admin User',
    balance: 50000,
    totalInvested: 25000,
    totalEarnings: 8500,
    createdAt: '2024-01-01',
    isAdmin: true
  },
  {
    id: '2',
    email: 'investor@example.com',
    name: 'John Doe',
    balance: 12500,
    totalInvested: 10000,
    totalEarnings: 2500,
    createdAt: '2024-01-15'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is logged in (from localStorage)
    const savedUser = localStorage.getItem('cryptovault_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login logic
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && password === 'password123') {
      setUser(foundUser);
      localStorage.setItem('cryptovault_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    // Mock registration logic
    if (mockUsers.find(u => u.email === email)) {
      return false; // User already exists
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      balance: 0,
      totalInvested: 0,
      totalEarnings: 0,
      createdAt: new Date().toISOString(),
    };

    mockUsers.push(newUser);
    setUser(newUser);
    localStorage.setItem('cryptovault_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cryptovault_user');
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
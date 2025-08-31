import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types/auth';

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signOut: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let mockUser: User;
    
    // Check for specific live users
    if (email === 'scott@steinmetz.ltd' && password === 'Lions2006*') {
      mockUser = {
        id: 'scott-steinmetz',
        email: 'scott@steinmetz.ltd',
        role: 'user',
        first_name: 'Scott',
        last_name: 'Steinmetz',
        created_at: '2024-01-01T00:00:00Z',
        subscription_status: 'active',
        account_type: 'paid'
      };
    } else {
      // Default demo user logic
      mockUser = {
        id: '1',
        email,
        role: email.includes('admin') ? 'admin' : 'user',
        first_name: 'John',
        last_name: 'Doe',
        created_at: new Date().toISOString(),
        subscription_status: 'active',
        account_type: 'paid'
      };
    }

    setUser(mockUser);
    setIsLoading(false);
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      role: 'user',
      first_name: firstName,
      last_name: lastName,
      created_at: new Date().toISOString(),
      subscription_status: 'trial',
      account_type: 'paid'
    };

    setUser(mockUser);
    setIsLoading(false);
  };

  const signOut = () => {
    setUser(null);
  };

  const value = {
    user,
    signIn,
    signUp,
    signOut,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

export type UserRole = 'farmer' | 'distributor' | 'agent';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  profileCompletion: number;
  address?: string;
  aadhaarVerified?: boolean;
  twoFactorEnabled?: boolean;
  language: 'en' | 'te';
  createdAt: Date;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  signup: (userData: SignupData) => Promise<boolean>;
  logout: () => void;
  verifyOTP: (otp: string, type: 'phone' | 'email') => Promise<boolean>;
  sendOTP: (type: 'phone' | 'email') => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  uploadAvatar: (file: File) => Promise<boolean>;
  deleteAccount: () => Promise<boolean>;
  refreshAuth: () => Promise<void>;
}

export interface SignupData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  agreedToTerms: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing auth on app load
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Simulate checking for stored auth token
      const storedAuth = localStorage.getItem('auth_token');
      if (storedAuth) {
        // Simulate user data fetch
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockUser: User = {
          id: '1',
          name: 'John Farmer',
          email: 'john@example.com',
          phone: '+919876543210',
          role: 'farmer',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          isEmailVerified: true,
          isPhoneVerified: true,
          profileCompletion: 85,
          address: 'Guntur, Andhra Pradesh',
          aadhaarVerified: true,
          twoFactorEnabled: false,
          language: 'en',
          createdAt: new Date()
        };
        setUser(mockUser);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string, rememberMe = false): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock validation
      if (email === 'farmer@test.com' && password === 'password') {
        const mockUser: User = {
          id: '1',
          name: 'John Farmer',
          email,
          phone: '+919876543210',
          role: 'farmer',
          isEmailVerified: true,
          isPhoneVerified: true,
          profileCompletion: 85,
          language: 'en',
          createdAt: new Date()
        };
        
        setUser(mockUser);
        localStorage.setItem('auth_token', 'mock_token_123');
        if (rememberMe) {
          localStorage.setItem('remember_me', 'true');
        }
        
        toast({
          title: "Welcome back!",
          description: `Successfully logged in as ${mockUser.name}`,
        });
        return true;
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Login Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: SignupData): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        isEmailVerified: false,
        isPhoneVerified: false,
        profileCompletion: 25,
        language: 'en',
        createdAt: new Date()
      };
      
      setUser(newUser);
      toast({
        title: "Account Created!",
        description: "Please verify your email and phone number",
      });
      return true;
    } catch (error) {
      toast({
        title: "Signup Failed",
        description: "Unable to create account. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('remember_me');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  const verifyOTP = async (otp: string, type: 'phone' | 'email'): Promise<boolean> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (otp === '123456') {
        setUser(prev => prev ? {
          ...prev,
          isEmailVerified: type === 'email' ? true : prev.isEmailVerified,
          isPhoneVerified: type === 'phone' ? true : prev.isPhoneVerified,
          profileCompletion: prev.profileCompletion + 15
        } : null);
        
        toast({
          title: "Verification Success",
          description: `${type === 'email' ? 'Email' : 'Phone'} verified successfully`,
        });
        return true;
      } else {
        toast({
          title: "Invalid OTP",
          description: "Please check the code and try again",
          variant: "destructive"
        });
        return false;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const sendOTP = async (type: 'phone' | 'email'): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "OTP Sent",
        description: `Verification code sent to your ${type}`,
      });
      return true;
    } catch (error) {
      toast({
        title: "Failed to Send OTP",
        description: "Please try again later",
        variant: "destructive"
      });
      return false;
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        title: "Reset Link Sent",
        description: "Check your email for password reset instructions",
      });
      return true;
    } catch (error) {
      toast({
        title: "Reset Failed",
        description: "Unable to send reset link",
        variant: "destructive"
      });
      return false;
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser(prev => prev ? { ...prev, ...data } : null);
      toast({
        title: "Profile Updated",
        description: "Your changes have been saved successfully",
      });
      return true;
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Unable to save changes",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const uploadAvatar = async (file: File): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const mockUrl = URL.createObjectURL(file);
      setUser(prev => prev ? { ...prev, avatar: mockUrl } : null);
      toast({
        title: "Avatar Updated",
        description: "Profile picture uploaded successfully",
      });
      return true;
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Unable to upload image",
        variant: "destructive"
      });
      return false;
    }
  };

  const deleteAccount = async (): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setUser(null);
      localStorage.clear();
      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted",
      });
      return true;
    } catch (error) {
      toast({
        title: "Deletion Failed",
        description: "Unable to delete account",
        variant: "destructive"
      });
      return false;
    }
  };

  const refreshAuth = async (): Promise<void> => {
    await checkAuthStatus();
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    verifyOTP,
    sendOTP,
    resetPassword,
    updateProfile,
    uploadAvatar,
    deleteAccount,
    refreshAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

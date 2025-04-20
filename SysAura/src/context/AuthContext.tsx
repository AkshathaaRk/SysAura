import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the context type
interface AuthContextType {
  userRole: 'admin' | 'user' | null;
  loading: boolean;
  adminId: string | null;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, role: 'admin' | 'user', adminKey?: string) => Promise<{ error: Error | null }>;
  signInWithOAuth: (provider: 'google' | 'github' | 'facebook') => Promise<{ error: Error | null }>;
  signOut: () => void;
  connectToAdmin: (adminId: string) => Promise<{ error: Error | null }>;
  disconnectFromAdmin: () => Promise<{ error: Error | null }>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Props for the AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

// Create the AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null);
  const [adminId, setAdminId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Initialize state from localStorage on mount
  useEffect(() => {
    const storedRole = localStorage.getItem('userRole') as 'admin' | 'user' | null;
    const storedAdminId = localStorage.getItem('adminId');

    if (storedRole) {
      setUserRole(storedRole);
    }

    if (storedAdminId) {
      setAdminId(storedAdminId);
    } else if (storedRole === 'admin') {
      // Generate admin ID if user is admin but doesn't have one
      const newAdminId = `ADMIN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      setAdminId(newAdminId);
      localStorage.setItem('adminId', newAdminId);
    }
  }, []);

  // Mock sign in function
  const signIn = async (email: string, password: string): Promise<{ error: Error | null }> => {
    setLoading(true);

    return new Promise((resolve) => {
      // Simulate API call
      setTimeout(() => {
        try {
          // For demo purposes, set admin role if email contains 'admin'
          const role = email.includes('admin') ? 'admin' : 'user';
          setUserRole(role);
          localStorage.setItem('userRole', role);

          // Generate a mock admin ID if the user is an admin
          if (role === 'admin') {
            const mockAdminId = `ADMIN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
            setAdminId(mockAdminId);
            localStorage.setItem('adminId', mockAdminId);
          }

          // Token is handled by the App component

          resolve({ error: null });
        } catch (error) {
          resolve({ error: error as Error });
        } finally {
          setLoading(false);
        }
      }, 1000);
    });
  };

  // Mock sign up function
  const signUp = async (email: string, password: string, role: 'admin' | 'user', adminKey?: string): Promise<{ error: Error | null }> => {
    setLoading(true);

    return new Promise((resolve) => {
      // Simulate API call
      setTimeout(() => {
        try {
          // For user role, validate admin key if provided
          if (role === 'user' && adminKey) {
            // In a real app, you would validate this key against the database
            // For now, we'll just check if it has the expected format
            if (!adminKey.startsWith('ADMIN-')) {
              throw new Error('Invalid admin key format. Keys should start with "ADMIN-"');
            }

            // Store the admin key for connecting to the admin's system
            localStorage.setItem('connectedAdminId', adminKey);
            console.log(`User connected to admin with ID: ${adminKey}`);
          }

          setUserRole(role);
          localStorage.setItem('userRole', role);

          // Generate a mock admin ID if the user is an admin
          if (role === 'admin') {
            const mockAdminId = `ADMIN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
            setAdminId(mockAdminId);
            localStorage.setItem('adminId', mockAdminId);
            console.log(`Generated admin ID: ${mockAdminId}`);
          }

          // Store token in localStorage
          localStorage.setItem('token', 'mock-token-' + Date.now());

          resolve({ error: null });
        } catch (error) {
          resolve({ error: error as Error });
        } finally {
          setLoading(false);
        }
      }, 1000);
    });
  };

  // Mock OAuth sign in function
  const signInWithOAuth = async (provider: 'google' | 'github' | 'facebook'): Promise<{ error: Error | null }> => {
    setLoading(true);

    return new Promise((resolve) => {
      // Simulate API call
      setTimeout(() => {
        try {
          // For demo purposes, always set user role for OAuth
          const role = 'user';
          setUserRole(role);
          localStorage.setItem('userRole', role);

          // Store token in localStorage
          localStorage.setItem('token', 'mock-token-' + Date.now());

          resolve({ error: null });
        } catch (error) {
          resolve({ error: error as Error });
        } finally {
          setLoading(false);
        }
      }, 1000);
    });
  };

  // Mock sign out function
  const signOut = () => {
    setUserRole(null);
    setAdminId(null);
    localStorage.removeItem('userRole');
    localStorage.removeItem('adminId');
    localStorage.removeItem('token');
  };

  // Mock connect to admin function
  const connectToAdmin = async (adminId: string): Promise<{ error: Error | null }> => {
    setLoading(true);

    return new Promise((resolve) => {
      // Simulate API call
      setTimeout(() => {
        try {
          // Store the connection in localStorage
          localStorage.setItem('connectedAdminId', adminId);

          resolve({ error: null });
        } catch (error) {
          resolve({ error: error as Error });
        } finally {
          setLoading(false);
        }
      }, 1000);
    });
  };

  // Mock disconnect from admin function
  const disconnectFromAdmin = async (): Promise<{ error: Error | null }> => {
    setLoading(true);

    return new Promise((resolve) => {
      // Simulate API call
      setTimeout(() => {
        try {
          // Remove the connection from localStorage
          localStorage.removeItem('connectedAdminId');

          resolve({ error: null });
        } catch (error) {
          resolve({ error: error as Error });
        } finally {
          setLoading(false);
        }
      }, 1000);
    });
  };

  // Create the auth value
  const value = {
    userRole,
    adminId,
    loading,
    signIn,
    signUp,
    signInWithOAuth,
    signOut,
    connectToAdmin,
    disconnectFromAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;

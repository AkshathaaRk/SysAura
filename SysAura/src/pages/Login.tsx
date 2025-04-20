import React, { useState, useEffect } from 'react';
import { FaGoogle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

type LoginProps = {
  onLogin: (role: 'admin' | 'user', email?: string) => void;
};

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [view, setView] = useState<'login' | 'signup' | 'role' | 'admin-key'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signIn, signUp, signInWithOAuth, userRole } = useAuth();

  // Effect to handle successful authentication
  useEffect(() => {
    if (userRole) {
      onLogin(userRole, email);
    }
  }, [userRole, onLogin, email]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Directly call onLogin with the role based on email
      const role = email.includes('admin') ? 'admin' : 'user';
      onLogin(role, email);
    } catch (error: any) {
      console.error('Error signing in:', error);
      setError(error.message || 'Error signing in. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      // For signup, we'll first collect the email and password, then ask for role
      setView('role');
    } catch (error: any) {
      console.error('Error in signup process:', error);
      setError(error.message || 'Error in signup process. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelect = async (role: 'admin' | 'user') => {
    setLoading(true);
    setError('');

    try {
      // Sign up with the selected role
      const { error } = await signUp(email, password, role);

      if (error) {
        throw error;
      }

      // Auth context will handle the redirect via the useEffect above
    } catch (error: any) {
      console.error('Error signing up:', error);
      setError(error.message || 'Error creating account. Please try again.');
      setView('signup'); // Go back to signup if there's an error
    } finally {
      setLoading(false);
    }
  };

  const handleAdminKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate admin key format (for example, it should be a UUID)
      if (!adminKey.trim()) {
        throw new Error('Admin key is required');
      }

      // Here you would typically validate the admin key against the database
      // For now, we'll just accept any key for demonstration purposes
      console.log('Admin key submitted:', adminKey);

      // Sign up as a user with the admin key
      const { error } = await signUp(email, password, 'user', adminKey);

      if (error) {
        throw error;
      }

      // Auth context will handle the redirect via the useEffect above
    } catch (error: any) {
      console.error('Error with admin key:', error);
      setError(error.message || 'Error validating admin key. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'github' | 'facebook') => {
    setLoading(true);
    setError('');

    try {
      const { error } = await signInWithOAuth(provider);

      if (error) {
        throw error;
      }

      // Auth context will handle the redirect via the useEffect above
    } catch (error: any) {
      console.error(`Error signing in with ${provider}:`, error);
      setError(error.message || `Error signing in with ${provider}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
            SysAura
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            System Monitoring Solution
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          {view === 'login' && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                Sign In
              </h2>

              {error && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-md text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin}>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => handleOAuthSignIn('google')}
                    disabled={loading}
                    className="flex items-center justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaGoogle className="h-5 w-5 text-red-600 mr-2" />
                    Sign in with Google
                  </button>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Don't have an account?{' '}
                  <button
                    onClick={() => setView('signup')}
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </>
          )}

          {view === 'signup' && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                Create Account
              </h2>

              {error && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-md text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSignUp}>
                <div className="mb-4">
                  <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="signup-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    id="signup-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    required
                    minLength={8}
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    required
                    minLength={8}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating account...' : 'Continue'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Already have an account?{' '}
                  <button
                    onClick={() => setView('login')}
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </>
          )}

          {view === 'role' && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                Select Account Type
              </h2>

              {error && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <button
                  onClick={() => handleRoleSelect('admin')}
                  disabled={loading}
                  className="w-full flex items-center justify-between p-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-left focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Admin</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Create and manage systems, view all connected users
                    </p>
                  </div>
                  <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </button>

                <button
                  onClick={() => setView('admin-key')}
                  disabled={loading}
                  className="w-full flex items-center justify-between p-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-left focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">User</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Monitor your systems, connect to admin accounts
                    </p>
                  </div>
                  <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </button>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setView('signup')}
                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium"
                >
                  &larr; Back to signup
                </button>
              </div>
            </>
          )}

          {view === 'admin-key' && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                Enter Admin Key
              </h2>

              {error && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-md text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleAdminKeySubmit}>
                <div className="mb-6">
                  <label htmlFor="admin-key" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Admin Key
                  </label>
                  <input
                    type="text"
                    id="admin-key"
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    placeholder="Enter the admin key (e.g., ADMIN-ABC123)"
                    className="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Ask your admin for their unique ID to connect to their system.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Connecting...' : 'Connect to Admin'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setView('role')}
                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium"
                >
                  &larr; Back to account type selection
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;

import React, { useState, memo, useEffect } from 'react';
import {
  SunIcon,
  MoonIcon,
  KeyIcon,
  AlertCircleIcon,
  EyeIcon,
  EyeOffIcon,
  LinkIcon,
  CheckCircleIcon,
  CopyIcon,
  UsersIcon
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

type SettingsProps = {
  userRole: 'admin' | 'user' | null;
};

const Settings: React.FC<SettingsProps> = ({ userRole }) => {
  const { theme, setTheme } = useTheme();
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [adminId, setAdminId] = useState('');
  const [adminIdInput, setAdminIdInput] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionSuccess, setConnectionSuccess] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const secretKey = 'sk_sysaura_9876543210abcdef';

  // Get admin ID and connection status from auth context
  const { user, adminId: contextAdminId, connectToAdmin, disconnectFromAdmin } = useAuth();

  // Set admin ID from context
  useEffect(() => {
    if (userRole === 'admin' && contextAdminId) {
      setAdminId(contextAdminId);
    }
  }, [userRole, contextAdminId]);

  // Check if user is connected to an admin
  useEffect(() => {
    const checkConnection = async () => {
      if (userRole === 'user' && user) {
        try {
          // Query the connections table
          const { data, error } = await supabase
            .from('connections')
            .select('admin_id')
            .eq('user_id', user.id)
            .single();

          if (data && data.admin_id) {
            setAdminIdInput(data.admin_id);
            setConnectionSuccess(true);
          }
        } catch (error) {
          console.error('Error checking connection:', error);
        }
      }
    };

    checkConnection();
  }, [userRole, user]);

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setShowSecretKey(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  // Handle admin ID connection for regular users
  const handleConnectToAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);

    try {
      // Verify admin ID format
      if (!adminIdInput || !adminIdInput.startsWith('ADMIN-') || !adminIdInput.endsWith('-SYSAURA')) {
        setError('Invalid Admin ID format');
        setConnectionSuccess(false);
        return;
      }

      // Connect to admin using auth context
      const { error } = await connectToAdmin(adminIdInput);

      if (error) {
        throw error;
      }

      setConnectionSuccess(true);
      setError('');
    } catch (error: any) {
      console.error('Error connecting to admin:', error);
      setError(error.message || 'Error connecting to admin. Please try again.');
      setConnectionSuccess(false);
    } finally {
      setIsConnecting(false);
    }
  };

  // Handle copy admin ID to clipboard
  const handleCopyAdminId = () => {
    navigator.clipboard.writeText(adminId);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Appearance
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Theme
                </label>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleThemeChange('light')}
                    className={`flex-1 flex items-center justify-center p-3 border rounded-md ${
                      theme === 'light'
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                        : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <SunIcon className="h-5 w-5 mr-2" />
                    Light
                  </button>
                  <button
                    onClick={() => handleThemeChange('dark')}
                    className={`flex-1 flex items-center justify-center p-3 border rounded-md ${
                      theme === 'dark'
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                        : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <MoonIcon className="h-5 w-5 mr-2" />
                    Dark
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mt-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Notifications
            </h2>
            <div className="space-y-4">
              <div>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Enable desktop notifications
                  </span>
                </label>
              </div>
              <div>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Send email alerts for critical events
                  </span>
                </label>
              </div>
              <div>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Send SMS alerts for critical events
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Admin ID Section */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mt-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <UsersIcon className="h-5 w-5 mr-2" />
              {userRole === 'admin' ? 'Admin ID' : 'Connect to Admin'}
            </h2>

            {userRole === 'admin' ? (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Share this ID with users who need to connect to your system. They will be able to see their metrics in your dashboard.
                </p>

                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex-1 bg-gray-100 dark:bg-gray-700 p-3 rounded-md font-mono text-sm">
                    {showSecretKey ? adminId : '••••••••••••••••••••••'}
                  </div>

                  <button
                    onClick={handleCopyAdminId}
                    className="p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                    title="Copy to clipboard"
                    disabled={!showSecretKey}
                  >
                    {copySuccess ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    ) : (
                      <CopyIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>

                <form onSubmit={handlePasswordSubmit} className="mt-4">
                  <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Enter password to view Admin ID
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Enter your password"
                      />
                    </div>
                    {error && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    View Admin ID
                  </button>
                </form>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Enter the Admin ID provided by your administrator to connect to their system.
                </p>

                <form onSubmit={handleConnectToAdmin}>
                  <div className="mb-4">
                    <label htmlFor="adminIdInput" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Admin ID
                    </label>
                    <input
                      type="text"
                      id="adminIdInput"
                      value={adminIdInput}
                      onChange={(e) => setAdminIdInput(e.target.value)}
                      className="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      placeholder="ADMIN-XXXXXX-SYSAURA"
                      disabled={connectionSuccess}
                    />
                    {error && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
                    )}
                  </div>

                  {connectionSuccess ? (
                    <div className="flex items-center text-green-600 dark:text-green-400 mb-4">
                      <CheckCircleIcon className="h-5 w-5 mr-2" />
                      <span>Connected to admin system</span>
                    </div>
                  ) : (
                    <button
                      type="submit"
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      disabled={isConnecting}
                    >
                      {isConnecting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Connecting...
                        </>
                      ) : (
                        <>
                          <LinkIcon className="h-5 w-5 mr-2" />
                          Connect to Admin
                        </>
                      )}
                    </button>
                  )}

                  {connectionSuccess && (
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          const { error } = await disconnectFromAdmin();

                          if (error) {
                            throw error;
                          }

                          setConnectionSuccess(false);
                          setAdminIdInput('');
                        } catch (error: any) {
                          console.error('Error disconnecting from admin:', error);
                          alert(error.message || 'Error disconnecting from admin. Please try again.');
                        }
                      }}
                      className="w-full mt-2 flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Disconnect
                    </button>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Security
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                  <KeyIcon className="h-4 w-4 mr-1" />
                  API Secret Key
                </h3>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-100 dark:bg-gray-700 p-3 rounded-md font-mono text-sm">
                    {showSecretKey ? secretKey : '••••••••••••••••••••••'}
                  </div>
                  <button
                    onClick={() => setShowSecretKey(!showSecretKey)}
                    className="p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                  >
                    {showSecretKey ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  This key is used to authenticate API requests. Keep it secure.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                  <AlertCircleIcon className="h-4 w-4 mr-1" />
                  Password
                </h3>
                <div>
                  <button className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

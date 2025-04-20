import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DownloadIcon, ShieldIcon, AlertTriangleIcon } from 'lucide-react';

const AccountSettings: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [password, setPassword] = useState('');
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  
  const navigate = useNavigate();

  const handleExportData = () => {
    setIsExporting(true);
    setMessage({ type: 'info', text: 'Preparing your data export...' });
    
    // In a real application, you would request data export from your backend
    // For this demo, we'll simulate a successful export after a short delay
    setTimeout(() => {
      setMessage({ type: 'success', text: 'Your data has been exported. Check your email for download link.' });
      setIsExporting(false);
    }, 2000);
  };

  const handleDeactivateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDeactivating(true);
    
    // Basic validation
    if (!password) {
      setMessage({ type: 'error', text: 'Please enter your password to confirm' });
      setIsDeactivating(false);
      return;
    }

    // In a real application, you would send this request to your backend
    // For this demo, we'll simulate a successful deactivation after a short delay
    setTimeout(() => {
      setMessage({ type: 'success', text: 'Your account has been deactivated. You will be logged out shortly.' });
      setIsDeactivating(false);
      
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }, 1500);
  };

  return (
    <div className="container mx-auto max-w-3xl py-6">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Account</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Control your account settings and preferences</p>
        </div>
        
        <div className="p-6">
          {message && (
            <div className={`mb-6 p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300' : message.type === 'error' ? 'bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'}`}>
              {message.text}
            </div>
          )}
          
          <div className="space-y-6">
            {/* Privacy Settings */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <ShieldIcon className="h-6 w-6 text-indigo-500 dark:text-indigo-400" />
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Privacy Settings</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Control how your information is used and shared
                  </p>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="analytics"
                          name="analytics"
                          type="checkbox"
                          defaultChecked
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="analytics" className="font-medium text-gray-700 dark:text-gray-300">
                          Usage Analytics
                        </label>
                        <p className="text-gray-500 dark:text-gray-400">
                          Allow us to collect anonymous usage data to improve our services
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="marketing"
                          name="marketing"
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="marketing" className="font-medium text-gray-700 dark:text-gray-300">
                          Marketing Communications
                        </label>
                        <p className="text-gray-500 dark:text-gray-400">
                          Receive emails about new features and offers
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Data Export */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <DownloadIcon className="h-6 w-6 text-indigo-500 dark:text-indigo-400" />
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Export Your Data</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Download a copy of your data including profile information, activity logs, and settings
                  </p>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={handleExportData}
                      disabled={isExporting}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isExporting ? 'Processing...' : 'Export Data'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Account Deactivation */}
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <AlertTriangleIcon className="h-6 w-6 text-red-500 dark:text-red-400" />
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-lg font-medium text-red-800 dark:text-red-300">Deactivate Account</h3>
                  <p className="mt-1 text-sm text-red-700 dark:text-red-400">
                    Temporarily disable your account. You can reactivate it anytime by logging in.
                  </p>
                  <div className="mt-4">
                    {!showDeactivateConfirm ? (
                      <button
                        type="button"
                        onClick={() => setShowDeactivateConfirm(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Deactivate Account
                      </button>
                    ) : (
                      <form onSubmit={handleDeactivateAccount} className="space-y-4">
                        <p className="text-sm font-medium text-red-700 dark:text-red-400">
                          Please enter your password to confirm account deactivation:
                        </p>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
                          placeholder="Enter your password"
                        />
                        <div className="flex space-x-4">
                          <button
                            type="button"
                            onClick={() => setShowDeactivateConfirm(false)}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isDeactivating}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isDeactivating ? 'Processing...' : 'Confirm Deactivation'}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
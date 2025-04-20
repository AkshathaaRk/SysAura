import React, { useState } from 'react';
import { ShieldIcon, UsersIcon, KeyIcon, AlertCircleIcon } from 'lucide-react';
type RoleSelectionProps = {
  email: string;
  onRoleSelected: (role: 'admin' | 'user') => void;
};
const RoleSelection: React.FC<RoleSelectionProps> = ({
  email,
  onRoleSelected
}) => {
  const [selectedRole, setSelectedRole] = useState<'admin' | 'user' | null>(null);
  const [adminCode, setAdminCode] = useState('');
  const [error, setError] = useState('');
  const handleContinue = () => {
    if (!selectedRole) {
      setError('Please select a role');
      return;
    }
    
    // Check admin code for user role
    if (selectedRole === 'user' && (!adminCode || adminCode !== 'admin123')) {
      setError('Invalid admin code');
      return;
    }
    
    // If user is using the admin code, store system information
    if (selectedRole === 'user' && adminCode === 'admin123') {
      // Get existing systems or initialize empty array
      const existingSystems = JSON.parse(localStorage.getItem('connectedSystems') || '[]');
      
      // Create a new system entry
      const newSystem = {
        id: Date.now().toString(),
        name: navigator.platform || 'Unknown Device',
        email: email,
        ipAddress: '192.168.1.' + Math.floor(Math.random() * 255), // Mock IP for demo
        lastConnected: new Date().toLocaleString(),
        status: 'online'
      };
      
      // Add to systems array and save to localStorage
      existingSystems.push(newSystem);
      localStorage.setItem('connectedSystems', JSON.stringify(existingSystems));
    }
    
    onRoleSelected(selectedRole);
  };
  return <div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 text-center">
        Choose Your Role
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
        Select how you want to use SysAura
      </p>
      {error && <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md flex items-center text-red-800 dark:text-red-300">
          <AlertCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>}
      <div className="grid grid-cols-1 gap-4 mb-6">
        <button type="button" onClick={() => setSelectedRole('admin')} className={`p-4 border rounded-lg flex items-center transition-all ${selectedRole === 'admin' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-700'}`}>
          <div className={`p-2 rounded-full mr-3 ${selectedRole === 'admin' ? 'bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
            <ShieldIcon className="h-6 w-6" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-medium text-gray-900 dark:text-white">Admin</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Monitor all systems and manage users
            </p>
          </div>
        </button>
        <button type="button" onClick={() => setSelectedRole('user')} className={`p-4 border rounded-lg flex items-center transition-all ${selectedRole === 'user' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-700'}`}>
          <div className={`p-2 rounded-full mr-3 ${selectedRole === 'user' ? 'bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
            <UsersIcon className="h-6 w-6" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-medium text-gray-900 dark:text-white">
              Regular User
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Monitor your system only
            </p>
          </div>
        </button>
      </div>
      {selectedRole === 'user' && <div className="mb-6">
          <label htmlFor="adminCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Admin Authorization Code
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <KeyIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input id="adminCode" type="password" value={adminCode} onChange={e => setAdminCode(e.target.value)} className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white" placeholder="Enter admin authorization code" />
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Regular users need authorization. For demo, use "admin123"
          </p>
        </div>}
      <div>
        <button type="button" onClick={handleContinue} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
          Continue
        </button>
      </div>
    </div>;
};
export default RoleSelection;
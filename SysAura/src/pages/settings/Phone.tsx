import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PhoneIcon } from 'lucide-react';

const PhoneSettings: React.FC = () => {
  const [currentPhone, setCurrentPhone] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    // In a real application, you would fetch the user's phone from your backend
    // For this demo, we'll simulate getting the phone from localStorage
    const userPhone = localStorage.getItem('userPhoneNumber') || '+1 (555) 123-4567';
    setCurrentPhone(userPhone);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Basic validation
    if (!newPhone || !password) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      setIsSubmitting(false);
      return;
    }

    // In a real application, you would send this data to your backend
    // For this demo, we'll simulate a successful update after a short delay
    setTimeout(() => {
      setMessage({ type: 'success', text: 'Phone number updated successfully!' });
      setIsSubmitting(false);
      
      // Store updated phone
      localStorage.setItem('userPhoneNumber', newPhone);
      setCurrentPhone(newPhone);
      setNewPhone('');
      setPassword('');
    }, 1000);
  };

  return (
    <div className="container mx-auto max-w-3xl py-6">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Change Phone Number</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Update your phone number</p>
        </div>
        
        <div className="p-6">
          {message && (
            <div className={`mb-6 p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300'}`}>
              {message.text}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="currentPhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Current Phone Number
              </label>
              <div className="flex items-center">
                <div className="mr-3 text-gray-400">
                  <PhoneIcon className="h-5 w-5" />
                </div>
                <input
                  id="currentPhone"
                  type="tel"
                  value={currentPhone}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600"
                  readOnly
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="newPhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                New Phone Number
              </label>
              <input
                id="newPhone"
                type="tel"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="+1 (555) 987-6543"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Current Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter your current password"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">For security, please enter your current password</p>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="mr-4 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : 'Update Phone Number'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PhoneSettings;
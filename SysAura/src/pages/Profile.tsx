import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CopyIcon, CheckIcon, CameraIcon } from 'lucide-react';

type ProfileProps = {
  userRole: 'admin' | 'user' | null;
};

const Profile: React.FC<ProfileProps> = () => {
  const { userRole, adminId } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profileImage, setProfileImage] = useState(localStorage.getItem('userProfileImage') || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copied, setCopied] = useState(false);

  // Reference to the file input element
  const fileInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  // Function to handle copying admin ID
  const handleCopyAdminId = () => {
    if (adminId) {
      navigator.clipboard.writeText(adminId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Function to handle profile image upload
  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Function to handle profile image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setProfileImage(imageUrl);
        localStorage.setItem('userProfileImage', imageUrl);

        // Dispatch a custom event to notify other components that the profile has been updated
        const profileUpdatedEvent = new Event('profileUpdated');
        window.dispatchEvent(profileUpdatedEvent);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    // In a real application, you would fetch the user's profile data from your backend
    // For this demo, we'll load profile data from localStorage
    const userEmail = localStorage.getItem('userEmail');
    const userFirstName = localStorage.getItem('userFirstName');
    const userLastName = localStorage.getItem('userLastName');
    const userPhoneNumber = localStorage.getItem('userPhoneNumber');
    const userProfileImage = localStorage.getItem('userProfileImage');

    if (userEmail) {
      setEmail(userEmail);
    }

    if (userFirstName) {
      setFirstName(userFirstName);
    }

    if (userLastName) {
      setLastName(userLastName);
    }

    if (userPhoneNumber) {
      setPhoneNumber(userPhoneNumber);
    }

    if (userProfileImage) {
      setProfileImage(userProfileImage);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic validation
    if (!firstName || !lastName || !email || !phoneNumber) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      setIsSubmitting(false);
      return;
    }

    // In a real application, you would send this data to your backend
    // For this demo, we'll simulate a successful update after a short delay
    setTimeout(() => {
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsSubmitting(false);

      // Store updated profile data
      localStorage.setItem('userFirstName', firstName);
      localStorage.setItem('userLastName', lastName);
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userPhoneNumber', phoneNumber);
      localStorage.setItem('userProfileImage', profileImage);

      // Dispatch a custom event to notify other components that the profile has been updated
      const profileUpdatedEvent = new Event('profileUpdated');
      window.dispatchEvent(profileUpdatedEvent);
    }, 1000);
  };

  return (
    <div className="container mx-auto max-w-3xl py-6">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your Profile</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Update your personal information</p>
            </div>
            <div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${userRole === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'}`}>
                {userRole === 'admin' ? 'Admin' : 'User'}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6">
          {message && (
            <div className={`mb-6 p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300'}`}>
              {message.text}
            </div>
          )}

          {/* Admin ID Section - Only visible for admin users */}
          {userRole === 'admin' && adminId && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Your Admin ID</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Share this ID with users who need to connect to your system.
              </p>

              <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
                <code className="font-mono text-sm sm:text-base text-indigo-600 dark:text-indigo-400 break-all">
                  {adminId}
                </code>
                <button
                  onClick={handleCopyAdminId}
                  className="ml-3 flex items-center space-x-1 p-2 text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 focus:outline-none"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <>
                      <CheckIcon className="h-5 w-5" />
                      <span className="text-xs">Copied!</span>
                    </>
                  ) : (
                    <>
                      <CopyIcon className="h-5 w-5" />
                      <span className="text-xs">Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Profile Image Section */}
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div
                  className="h-32 w-32 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden cursor-pointer"
                  onClick={handleImageClick}
                >
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleImageClick}
                  className="absolute bottom-0 right-0 bg-indigo-600 rounded-full p-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <CameraIcon className="h-5 w-5" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="John"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white bg-gray-100 dark:bg-gray-600"
                placeholder="john.doe@example.com"
                readOnly
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">This is the email you used to login</p>
            </div>

            <div className="mb-6">
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone Number
              </label>
              <input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="+1 (555) 123-4567"
              />
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
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
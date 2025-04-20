import React, { useEffect, useState } from 'react';
import { UserIcon, SettingsIcon, CameraIcon, EditIcon, MailIcon, KeyIcon, PhoneIcon, LogOutIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
type ProfileDropdownProps = {
  onClose: () => void;
  userRole: 'admin' | 'user' | null;
};
const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  onClose,
  userRole
}) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  // Get user profile data from localStorage
  const [firstName, setFirstName] = useState(localStorage.getItem('userFirstName') || 'John');
  const [lastName, setLastName] = useState(localStorage.getItem('userLastName') || 'Doe');
  const [email, setEmail] = useState(localStorage.getItem('userEmail') || 'john.doe@example.com');
  const [profileImage, setProfileImage] = useState(localStorage.getItem('userProfileImage') || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80');

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.profile-dropdown')) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Add an effect to update state when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setFirstName(localStorage.getItem('userFirstName') || 'John');
      setLastName(localStorage.getItem('userLastName') || 'Doe');
      setEmail(localStorage.getItem('userEmail') || 'john.doe@example.com');
      setProfileImage(localStorage.getItem('userProfileImage') || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80');
    };

    // Listen for storage events (when localStorage changes)
    window.addEventListener('storage', handleStorageChange);

    // Custom event for profile updates
    window.addEventListener('profileUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profileUpdated', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    // Use the signOut function from AuthContext
    signOut();
    // Redirect to login page
    navigate('/login');
    onClose();
  };
  return <div className="profile-dropdown absolute right-0 mt-2 w-60 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="relative">
            <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <img src={profileImage} alt="Profile" className="h-full w-full object-cover" />
            </div>
            <button className="absolute bottom-0 right-0 bg-indigo-600 rounded-full p-1 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <CameraIcon className="h-4 w-4" />
            </button>
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              {firstName} {lastName}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {email}
            </p>
            <button
              onClick={() => {
                navigate('/profile');
                onClose();
              }}
              className="mt-1 flex items-center text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
            >
              <EditIcon className="h-3 w-3 mr-1" />
              Edit Profile
            </button>
          </div>
        </div>
      </div>
      <div className="py-1">
        <button
          onClick={() => {
            navigate('/profile');
            onClose();
          }}
          className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <UserIcon className="h-4 w-4 mr-3 text-gray-400" />
          Your Profile
        </button>

        <button
          onClick={() => {
            navigate('/settings/email');
            onClose();
          }}
          className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <MailIcon className="h-4 w-4 mr-3 text-gray-400" />
          Change Email
        </button>

        <button
          onClick={() => {
            navigate('/settings/password');
            onClose();
          }}
          className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <KeyIcon className="h-4 w-4 mr-3 text-gray-400" />
          Change Password
        </button>

        <button
          onClick={() => {
            navigate('/settings/phone');
            onClose();
          }}
          className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <PhoneIcon className="h-4 w-4 mr-3 text-gray-400" />
          Change Phone Number
        </button>

        {userRole === 'admin' && (
          <button
            onClick={() => {
              navigate('/settings/account');
              onClose();
            }}
            className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <SettingsIcon className="h-4 w-4 mr-3 text-gray-400" />
            Manage Account
          </button>
        )}

        <button
          onClick={handleLogout}
          className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <LogOutIcon className="h-4 w-4 mr-3 text-red-500" />
          Logout
        </button>
      </div>
    </div>;
};
export default ProfileDropdown;
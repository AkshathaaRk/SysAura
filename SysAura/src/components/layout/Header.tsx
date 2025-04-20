import React, { useState, useEffect } from 'react';
import { BellIcon, MenuIcon, SunIcon, MoonIcon } from 'lucide-react';
import NotificationDropdown from '../alerts/NotificationDropdown';
import ProfileDropdown from '../profile/ProfileDropdown';
type HeaderProps = {
  toggleSideMenu: () => void;
  userRole: 'admin' | 'user' | null;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
};
const Header: React.FC<HeaderProps> = ({
  toggleSideMenu,
  userRole,
  theme,
  toggleTheme
}) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(localStorage.getItem('userProfileImage') || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80');
  const notificationCount = 3; // This would come from your notification system

  // Update profile image when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const storedImage = localStorage.getItem('userProfileImage');
      if (storedImage) {
        setProfileImage(storedImage);
      }
    };

    // Listen for the custom profileUpdated event
    window.addEventListener('profileUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('profileUpdated', handleStorageChange);
    };
  }, []);
  return <header className="h-16 bg-white dark:bg-gray-800 shadow-sm flex items-center justify-between px-4 z-10">
      <div className="flex items-center space-x-4">
        <button onClick={toggleSideMenu} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <MenuIcon className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
          SysAura
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        <button onClick={toggleTheme} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          {theme === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
        </button>
        <div className="relative">
          <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className="relative p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <BellIcon className="h-6 w-6" />
            {notificationCount > 0 && <span className="absolute top-0 right-0 h-5 w-5 rounded-full bg-red-500 flex items-center justify-center text-xs text-white font-medium">
                {notificationCount}
              </span>}
          </button>
          {isNotificationsOpen && <NotificationDropdown onClose={() => setIsNotificationsOpen(false)} />}
        </div>
        <div className="relative">
          <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            <img src={profileImage} alt="Profile" className="h-full w-full object-cover" />
          </button>
          {isProfileOpen && <ProfileDropdown onClose={() => setIsProfileOpen(false)} userRole={userRole} />}
        </div>
      </div>
    </header>;
};
export default Header;
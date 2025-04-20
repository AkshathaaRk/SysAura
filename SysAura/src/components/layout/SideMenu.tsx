import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboardIcon, ServerIcon, AlertTriangleIcon, FileTextIcon, SettingsIcon, LogOutIcon, XIcon } from 'lucide-react';
type SideMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  userRole: 'admin' | 'user' | null;
  onLogout: () => void;
};
const SideMenu: React.FC<SideMenuProps> = ({
  isOpen,
  onClose,
  userRole,
  onLogout
}) => {
  return <>
      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-20" onClick={onClose}></div>}
      {/* Side menu */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg z-30
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Menu
          </h2>
          <button onClick={onClose} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          <NavLink to="/dashboard" className={({
          isActive
        }) => `
              flex items-center px-3 py-2 rounded-md text-sm font-medium
              ${isActive ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}
            `}>
            <LayoutDashboardIcon className="h-5 w-5 mr-3" />
            Dashboard
          </NavLink>

          {/* System monitoring is now integrated into the Dashboard */}
          {userRole === 'admin' && <NavLink to="/servers" className={({
          isActive
        }) => `
                flex items-center px-3 py-2 rounded-md text-sm font-medium
                ${isActive ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}
              `}>
              <ServerIcon className="h-5 w-5 mr-3" />
              Servers
            </NavLink>}
          {userRole === 'admin' && <NavLink to="/systems" className={({
          isActive
        }) => `
                flex items-center px-3 py-2 rounded-md text-sm font-medium
                ${isActive ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}
              `}>
              <ServerIcon className="h-5 w-5 mr-3" />
              Systems
            </NavLink>}
          <NavLink to="/alerts" className={({
          isActive
        }) => `
              flex items-center px-3 py-2 rounded-md text-sm font-medium
              ${isActive ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}
            `}>
            <AlertTriangleIcon className="h-5 w-5 mr-3" />
            Alerts
          </NavLink>
          <NavLink to="/reports" className={({
          isActive
        }) => `
              flex items-center px-3 py-2 rounded-md text-sm font-medium
              ${isActive ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}
            `}>
            <FileTextIcon className="h-5 w-5 mr-3" />
            Reports
          </NavLink>
          <NavLink to="/settings" className={({
          isActive
        }) => `
              flex items-center px-3 py-2 rounded-md text-sm font-medium
              ${isActive ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}
            `}>
            <SettingsIcon className="h-5 w-5 mr-3" />
            Settings
          </NavLink>
          <button onClick={onLogout} className="flex items-center w-full px-3 py-2 rounded-md text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
            <LogOutIcon className="h-5 w-5 mr-3" />
            Logout
          </button>
        </nav>
      </div>
    </>;
};
export default SideMenu;
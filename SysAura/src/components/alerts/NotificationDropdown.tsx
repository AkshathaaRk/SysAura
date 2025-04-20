import React, { useEffect } from 'react';
import { AlertTriangleIcon, CheckCircleIcon, XIcon, AlertCircleIcon } from 'lucide-react';
type NotificationDropdownProps = {
  onClose: () => void;
};
const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  onClose
}) => {
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.notification-dropdown')) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  // Mock notifications data
  const notifications = [{
    id: 1,
    title: 'High CPU Usage',
    message: 'Server 1 CPU usage exceeds 85%',
    time: '5 minutes ago',
    type: 'warning',
    isRead: false
  }, {
    id: 2,
    title: 'Low Disk Space',
    message: 'Server 2 disk space below 10%',
    time: '15 minutes ago',
    type: 'critical',
    isRead: false
  }, {
    id: 3,
    title: 'Memory Usage Normal',
    message: 'Server 1 memory usage returned to normal',
    time: '1 hour ago',
    type: 'success',
    isRead: true
  }];
  const getIconForType = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case 'critical':
        return <AlertCircleIcon className="h-5 w-5 text-red-500" />;
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      default:
        return <AlertTriangleIcon className="h-5 w-5 text-yellow-500" />;
    }
  };
  return <div className="notification-dropdown absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
          Notifications
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-500 focus:outline-none">
          <XIcon className="h-4 w-4" />
        </button>
      </div>
      <div className="max-h-60 overflow-y-auto">
        {notifications.length === 0 ? <div className="py-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No notifications
            </p>
          </div> : <ul>
            {notifications.map(notification => <li key={notification.id} className={`px-4 py-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 ${!notification.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                <div className="flex">
                  <div className="flex-shrink-0 mt-1">
                    {getIconForType(notification.type)}
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {notification.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {notification.time}
                    </p>
                  </div>
                </div>
              </li>)}
          </ul>}
      </div>
      <div className="p-2 border-t border-gray-200 dark:border-gray-700">
        <button className="w-full px-3 py-2 text-xs font-medium text-center text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-md">
          View all notifications
        </button>
      </div>
    </div>;
};
export default NotificationDropdown;
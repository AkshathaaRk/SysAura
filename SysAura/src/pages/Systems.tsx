import React, { useState, useEffect } from 'react';
import { ServerIcon, UsersIcon, CalendarIcon, LinkIcon, UserIcon, CheckIcon, CopyIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

type SystemsProps = {
  userRole: 'admin' | 'user' | null;
};

type ConnectedSystem = {
  id: string;
  name: string;
  email: string;
  ipAddress: string;
  lastConnected: string;
  status: 'online' | 'offline';
  adminId?: string; // The ID of the admin this user is connected to
  isConnectedUser?: boolean; // Flag to identify users connected via admin ID
};

const Systems: React.FC<SystemsProps> = ({ userRole }) => {
  // Get connected systems from localStorage
  const [connectedSystems, setConnectedSystems] = useState<ConnectedSystem[]>([]);
  const [connectedUsers, setConnectedUsers] = useState<ConnectedSystem[]>([]);
  const [copied, setCopied] = useState(false);
  const { adminId } = useAuth();

  // Function to handle copying admin ID
  const handleCopyAdminId = () => {
    if (adminId) {
      navigator.clipboard.writeText(adminId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Load connected users if user is admin
  useEffect(() => {
    const fetchConnectedUsers = async () => {
      if (userRole === 'admin' && adminId) {
        try {
          // Get connected users from Supabase
          const { data, error } = await supabase
            .from('connections')
            .select(`
              *,
              user:user_id (id, email, user_metadata)
            `)
            .eq('admin_id', adminId);

          if (error) {
            throw error;
          }

          if (data) {
            // Transform data to match ConnectedSystem type
            const connectedUsers: ConnectedSystem[] = data.map((connection: any) => ({
              id: connection.user.id,
              name: connection.user.user_metadata?.name || 'Unknown User',
              email: connection.user.email,
              ipAddress: connection.ip_address || '0.0.0.0',
              lastConnected: connection.connected_at,
              status: connection.status || 'offline',
              adminId: connection.admin_id,
              isConnectedUser: true
            }));

            setConnectedUsers(connectedUsers);
          }
        } catch (error) {
          console.error('Error fetching connected users:', error);

          // Fallback to demo data if API fails
          const demoConnectedUsers: ConnectedSystem[] = [
            {
              id: 'user-1',
              name: 'Demo User 1',
              email: 'user1@example.com',
              ipAddress: '192.168.1.101',
              lastConnected: new Date().toISOString(),
              status: 'online',
              adminId,
              isConnectedUser: true
            },
            {
              id: 'user-2',
              name: 'Demo User 2',
              email: 'user2@example.com',
              ipAddress: '192.168.1.102',
              lastConnected: new Date(Date.now() - 3600000).toISOString(),
              status: 'offline',
              adminId,
              isConnectedUser: true
            }
          ];

          setConnectedUsers(demoConnectedUsers);
        }
      }
    };

    fetchConnectedUsers();
  }, [userRole, adminId]);

    // Load systems from localStorage
  useEffect(() => {
    const storedSystems = localStorage.getItem('connectedSystems');
    if (storedSystems) {
      setConnectedSystems(JSON.parse(storedSystems));
    } else {
      // Fallback to demo data if no systems are stored
      const demoSystems: ConnectedSystem[] = [
        {
          id: '1',
          name: 'Development Server',
          email: 'dev.user@example.com',
          ipAddress: '192.168.1.101',
          lastConnected: '2023-06-15 14:30',
          status: 'online',
        },
        {
          id: '2',
          name: 'Production Server',
          email: 'prod.user@example.com',
          ipAddress: '192.168.1.102',
          lastConnected: '2023-06-15 13:45',
          status: 'online',
        },
      ];
      setConnectedSystems(demoSystems);
    }
  }, [userRole]);

  return (
    <div className="h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {userRole === 'admin' ? 'Connected Systems & Users' : 'Connected Systems'}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {userRole === 'admin'
            ? 'Systems and users connected to your admin account'
            : 'Systems that have used your authorization code'}
        </p>
      </div>

      {userRole === 'admin' && adminId && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-100 dark:bg-indigo-900 p-2 rounded-full">
                <LinkIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Your Admin ID</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Share this ID with users who need to connect to your system:
                </p>
              </div>
            </div>
            <button
              onClick={handleCopyAdminId}
              className="flex items-center space-x-1 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-800/30 rounded-md transition-colors"
            >
              {copied ? (
                <>
                  <CheckIcon className="h-4 w-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <CopyIcon className="h-4 w-4" />
                  <span>Copy ID</span>
                </>
              )}
            </button>
          </div>
          <div className="mt-3 p-4 bg-gray-100 dark:bg-gray-700 rounded-md flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1 text-center sm:text-left mb-2 sm:mb-0">
              <div className="font-mono text-xl font-bold text-indigo-600 dark:text-indigo-400 break-all">{adminId}</div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center sm:text-right">
              Click the Copy button to copy to clipboard
            </div>
          </div>
        </div>
      )}

      {/* Connected Users Section (for admins only) */}
      {userRole === 'admin' && connectedUsers.length > 0 && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden mb-6">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              <UserIcon className="h-5 w-5 mr-2" />
              Connected Users
            </h2>
            <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300 py-1 px-2 rounded-full text-xs font-medium">
              {connectedUsers.length} {connectedUsers.length === 1 ? 'User' : 'Users'}
            </span>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {connectedUsers.map((user) => (
              <div key={user.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${user.status === 'online' ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-700'}`}>
                        <UserIcon className={`h-6 w-6 ${user.status === 'online' ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`} />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</h3>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        <p>{user.email}</p>
                        <p className="mt-1 flex items-center">
                          <ServerIcon className="h-4 w-4 mr-1" />
                          {user.ipAddress}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === 'online' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                      {user.status === 'online' ? 'Online' : 'Offline'}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      Last seen: {new Date(user.lastConnected).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Connected Systems Section */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
            <ServerIcon className="h-5 w-5 mr-2" />
            Systems Overview
          </h2>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {connectedSystems.length > 0 ? (
            connectedSystems.map((system) => (
              <div key={system.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full mr-3 ${system.status === 'online' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                      <ServerIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {system.name}
                      </h3>
                      <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <UsersIcon className="h-4 w-4 mr-1" />
                        <span>{system.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${system.status === 'online' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                      {system.status}
                    </div>
                    <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      IP: {system.ipAddress}
                    </div>
                    <div className="mt-1 flex items-center justify-end text-xs text-gray-500 dark:text-gray-400">
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      <span>{system.lastConnected}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              <ServerIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p>No systems have connected using your admin code yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Systems;
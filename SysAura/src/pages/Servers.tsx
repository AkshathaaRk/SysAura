import React, { useState, memo } from 'react';
import { ServerIcon, UsersIcon, MoreVerticalIcon, CheckCircleIcon, AlertTriangleIcon, AlertCircleIcon } from 'lucide-react';
const Servers: React.FC = () => {
  // Mock data for servers
  const servers = [{
    id: 1,
    name: 'Web Server',
    ip: '192.168.1.101',
    status: 'online',
    uptime: '15 days, 7 hours',
    activeUsers: 12,
    cpu: 45,
    memory: 60,
    disk: 72
  }, {
    id: 2,
    name: 'Database Server',
    ip: '192.168.1.102',
    status: 'warning',
    uptime: '8 days, 3 hours',
    activeUsers: 5,
    cpu: 82,
    memory: 75,
    disk: 65
  }, {
    id: 3,
    name: 'Application Server',
    ip: '192.168.1.103',
    status: 'online',
    uptime: '23 days, 12 hours',
    activeUsers: 8,
    cpu: 35,
    memory: 50,
    disk: 40
  }, {
    id: 4,
    name: 'Cache Server',
    ip: '192.168.1.104',
    status: 'critical',
    uptime: '2 days, 5 hours',
    activeUsers: 3,
    cpu: 92,
    memory: 88,
    disk: 85
  }, {
    id: 5,
    name: 'Backup Server',
    ip: '192.168.1.105',
    status: 'online',
    uptime: '45 days, 18 hours',
    activeUsers: 1,
    cpu: 25,
    memory: 40,
    disk: 90
  }];
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case 'critical':
        return <AlertCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
    }
  };
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
            Online
          </span>;
      case 'warning':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
            Warning
          </span>;
      case 'critical':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
            Critical
          </span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
            Online
          </span>;
    }
  };
  const getResourceBar = (value: number) => {
    let bgColor;
    if (value >= 80) bgColor = 'bg-red-500';else if (value >= 60) bgColor = 'bg-yellow-500';else bgColor = 'bg-green-500';
    return <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div className={`${bgColor} h-2 rounded-full`} style={{
        width: `${value}%`
      }}></div>
      </div>;
  };
  return <div className="h-full">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Servers
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Manage and monitor all connected servers
          </p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
          Add Server
        </button>
      </div>
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Server
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  IP Address
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Uptime
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Users
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Resources
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {servers.map(server => <tr key={server.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <ServerIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {server.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(server.status)}
                      <span className="ml-2">
                        {getStatusBadge(server.status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {server.ip}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {server.uptime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <UsersIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {server.activeUsers}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500 dark:text-gray-400 w-12">
                          CPU
                        </span>
                        <div className="flex-1 ml-2">
                          {getResourceBar(server.cpu)}
                        </div>
                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                          {server.cpu}%
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500 dark:text-gray-400 w-12">
                          Memory
                        </span>
                        <div className="flex-1 ml-2">
                          {getResourceBar(server.memory)}
                        </div>
                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                          {server.memory}%
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500 dark:text-gray-400 w-12">
                          Disk
                        </span>
                        <div className="flex-1 ml-2">
                          {getResourceBar(server.disk)}
                        </div>
                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                          {server.disk}%
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-gray-400 hover:text-gray-500">
                      <MoreVerticalIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>;
};
export default Servers;
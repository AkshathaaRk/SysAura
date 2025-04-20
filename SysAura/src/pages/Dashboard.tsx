import React, { useEffect, useState, useCallback } from 'react';
import { RefreshCwIcon, ServerIcon, AlertTriangleIcon, Loader2Icon } from 'lucide-react';
import CPUChart from '../components/dashboard/CPUChart';
import MemoryChart from '../components/dashboard/MemoryChart';
import DiskChart from '../components/dashboard/DiskChart';
import NetworkChart from '../components/dashboard/NetworkChart';
import { metricsAPI } from '../api';
import { useAlerts } from '../context/AlertContext';
import { processMetricsInWorker } from '../services/workerService';
type DashboardProps = {
  userRole: 'admin' | 'user' | null;
};

type MetricsType = {
  cpuUsage: number;
  memoryUsage: number;
  memoryTotal: number;
  diskUsage: number;
  diskData: Array<{
    name: string;
    used: number;
    total: number;
  }>;
  networkIncoming: number;
  networkOutgoing: number;
  timestamp: Date;
  cpuInfo?: any;
  memoryInfo?: any;
  diskInfo?: any;
  networkInfo?: any;
};

type SystemType = {
  id: string | number;
  name: string;
  status: string;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
};

const Dashboard: React.FC<DashboardProps> = ({ userRole }) => {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [connectedSystems, setConnectedSystems] = useState<SystemType[]>([]);
  const [selectedSystem, setSelectedSystem] = useState<string | number | null>(null);
  const [metrics, setMetrics] = useState<MetricsType | null>(null);
  const [showRefreshSuccess, setShowRefreshSuccess] = useState(false);

  // Get alerts context
  const { checkMetricsAndAddAlerts } = useAlerts();

  // Mock data for systems
  const mockSystems = [
    {
      id: 'local',
      name: 'Local System',
      status: 'normal',
      cpuUsage: 45,
      memoryUsage: 60,
      diskUsage: 72
    },
    {
      id: 1,
      name: 'Web Server',
      status: 'normal',
      cpuUsage: 45,
      memoryUsage: 60,
      diskUsage: 72
    },
    {
      id: 2,
      name: 'Database Server',
      status: 'warning',
      cpuUsage: 82,
      memoryUsage: 75,
      diskUsage: 65
    }
  ];

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        // Set connected systems
        setConnectedSystems(mockSystems);

        // Load initial metrics with detailed information
        try {
          const [metrics, cpuInfo, memoryInfo, diskInfo, networkInfo] = await Promise.all([
            metricsAPI.getCurrentMetrics(),
            metricsAPI.getCpuInfo(),
            metricsAPI.getMemoryInfo(),
            metricsAPI.getDiskInfo(),
            metricsAPI.getNetworkInfo()
          ]);

          // Combine all metrics into one object
          const rawMetrics = {
            ...metrics,
            cpuInfo,
            memoryInfo,
            diskInfo,
            networkInfo
          };

          // Process metrics
          const processedMetrics = await processMetricsInWorker(rawMetrics);
          setMetrics(processedMetrics);
        } catch (error) {
          console.error('Error loading metrics:', error);
          // Set mock metrics if API fails
          setMetrics({
            cpuUsage: 45,
            memoryUsage: 60,
            memoryTotal: 16,
            diskUsage: 72,
            diskData: [{ name: 'C:', used: 72, total: 100 }],
            networkIncoming: 2.5,
            networkOutgoing: 1.2,
            timestamp: new Date()
          });
        }

        setLastUpdated(new Date());
        setSelectedSystem('local');
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Handle manual refresh
  const handleRefresh = async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);

    try {
      // Fetch metrics data
      try {
        const [metrics, cpuInfo, memoryInfo, diskInfo, networkInfo] = await Promise.all([
          metricsAPI.getCurrentMetrics(true),
          metricsAPI.getCpuInfo(true),
          metricsAPI.getMemoryInfo(true),
          metricsAPI.getDiskInfo(true),
          metricsAPI.getNetworkInfo(true)
        ]);

        // Combine all metrics into one object
        const rawMetrics = {
          ...metrics,
          cpuInfo,
          memoryInfo,
          diskInfo,
          networkInfo
        };

        // Process metrics
        const processedMetrics = await processMetricsInWorker(rawMetrics);
        setMetrics(processedMetrics);

        // Check for alerts based on the metrics
        checkMetricsAndAddAlerts(processedMetrics);
      } catch (error) {
        console.error('Error refreshing metrics:', error);
      }

      setLastUpdated(new Date());

      // Show success notification
      setShowRefreshSuccess(true);
      setTimeout(() => {
        setShowRefreshSuccess(false);
      }, 3000);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'warning':
        return <AlertTriangleIcon className="h-4 w-4 text-yellow-500" />;
      case 'critical':
        return <AlertTriangleIcon className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Loader2Icon className="h-10 w-10 animate-spin text-indigo-500 mx-auto" />
          <p className="mt-4 text-gray-500 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center relative">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={`mt-2 sm:mt-0 flex items-center px-5 py-3 border-2 border-indigo-600 dark:border-indigo-500 rounded-md shadow-md text-base font-medium bg-indigo-600 dark:bg-indigo-700 text-white hover:bg-indigo-700 dark:hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${isRefreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <RefreshCwIcon className={`h-6 w-6 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing Data...' : 'MANUAL REFRESH'}
        </button>
      </div>

      {/* Success notification */}
      {showRefreshSuccess && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-md flex items-center z-50 animate-fade-in-out">
          <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span><strong>Manual Refresh Successful!</strong> Data updated at {lastUpdated.toLocaleTimeString()}</span>
        </div>
      )}

      <div className="grid grid-cols-12 gap-6">
        {/* System List (Admin Only) */}
        {userRole === 'admin' && (
          <div className="col-span-12 lg:col-span-3 xl:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-4 overflow-auto max-h-[calc(100vh-200px)]">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Connected Systems
            </h2>
            <ul className="space-y-2">
              {connectedSystems.map(system => (
                <li key={system.id}>
                  <button
                    className={`flex items-center justify-between w-full p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-left ${selectedSystem === system.id ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                    onClick={() => setSelectedSystem(system.id)}
                  >
                    <div className="flex items-center">
                      <ServerIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {system.name}
                      </span>
                    </div>
                    {getStatusIcon(system.status)}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Main Dashboard Content */}
        <div className={`col-span-12 ${userRole === 'admin' ? 'lg:col-span-9 xl:col-span-10' : ''}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                CPU Usage
              </h3>
              <div className="h-64">
                <CPUChart data={metrics?.cpuUsage} cpuInfo={metrics?.cpuInfo} />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Memory Usage
              </h3>
              <div className="h-64">
                <MemoryChart data={metrics?.memoryUsage} memoryInfo={metrics?.memoryInfo} />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Disk Usage
              </h3>
              <div className="h-64">
                <DiskChart data={metrics?.diskData} diskInfo={metrics?.diskInfo} />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Network Traffic
              </h3>
              <div className="h-64">
                <NetworkChart
                  incoming={metrics?.networkIncoming}
                  outgoing={metrics?.networkOutgoing}
                  networkInfo={metrics?.networkInfo}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
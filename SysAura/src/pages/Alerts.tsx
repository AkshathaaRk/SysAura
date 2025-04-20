import React, { useState } from 'react';
import {
  AlertTriangleIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  FilterIcon,
  XIcon,
  CpuIcon,
  MemoryStickIcon,
  HardDriveIcon,
  NetworkIcon,
  BellIcon
} from 'lucide-react';
import { useAlerts } from '../context/AlertContext';
import { Alert } from '../types/alerts';

// Alert details modal component
const AlertDetailsModal: React.FC<{
  alert: Alert;
  onClose: () => void;
}> = ({ alert, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              {alert.severity === 'critical' ? (
                <AlertCircleIcon className="h-6 w-6 text-red-500 mr-2" />
              ) : (
                <AlertTriangleIcon className="h-6 w-6 text-yellow-500 mr-2" />
              )}
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {alert.title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4">
            <div className="flex items-center mb-2">
              <span className="font-medium text-gray-700 dark:text-gray-300 w-24">Status:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                alert.status === 'active'
                  ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  : alert.status === 'acknowledged'
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                  : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
              }`}>
                {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
              </span>
            </div>

            <div className="flex items-center mb-2">
              <span className="font-medium text-gray-700 dark:text-gray-300 w-24">Severity:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                alert.severity === 'critical'
                  ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
              }`}>
                {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
              </span>
            </div>

            <div className="flex items-center mb-2">
              <span className="font-medium text-gray-700 dark:text-gray-300 w-24">Category:</span>
              <span className="text-gray-600 dark:text-gray-300 flex items-center">
                {alert.category === 'cpu' ? (
                  <><CpuIcon className="h-4 w-4 mr-1" /> CPU</>
                ) : alert.category === 'memory' ? (
                  <><MemoryStickIcon className="h-4 w-4 mr-1" /> Memory</>
                ) : alert.category === 'disk' ? (
                  <><HardDriveIcon className="h-4 w-4 mr-1" /> Disk</>
                ) : (
                  <><NetworkIcon className="h-4 w-4 mr-1" /> Network</>
                )}
              </span>
            </div>

            <div className="flex items-center mb-2">
              <span className="font-medium text-gray-700 dark:text-gray-300 w-24">Created:</span>
              <span className="text-gray-600 dark:text-gray-300">
                {alert.timestamp.toLocaleString()}
              </span>
            </div>

            {alert.acknowledgedAt && (
              <div className="flex items-center mb-2">
                <span className="font-medium text-gray-700 dark:text-gray-300 w-24">Acknowledged:</span>
                <span className="text-gray-600 dark:text-gray-300">
                  {alert.acknowledgedAt.toLocaleString()}
                </span>
              </div>
            )}

            {alert.resolvedAt && (
              <div className="flex items-center mb-2">
                <span className="font-medium text-gray-700 dark:text-gray-300 w-24">Resolved:</span>
                <span className="text-gray-600 dark:text-gray-300">
                  {alert.resolvedAt.toLocaleString()}
                </span>
              </div>
            )}

            {alert.value !== undefined && alert.threshold !== undefined && (
              <div className="flex items-center mb-2">
                <span className="font-medium text-gray-700 dark:text-gray-300 w-24">Value:</span>
                <span className="text-gray-600 dark:text-gray-300">
                  {alert.value}% (Threshold: {alert.threshold}%)
                </span>
              </div>
            )}

            <div className="mt-4">
              <span className="font-medium text-gray-700 dark:text-gray-300">Message:</span>
              <p className="mt-1 text-gray-600 dark:text-gray-300 p-3 bg-gray-100 dark:bg-gray-700 rounded">
                {alert.message}
              </p>
            </div>

            {alert.details && (
              <div className="mt-4">
                <span className="font-medium text-gray-700 dark:text-gray-300">Details:</span>
                <p className="mt-1 text-gray-600 dark:text-gray-300 p-3 bg-gray-100 dark:bg-gray-700 rounded">
                  {alert.details}
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Alerts: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'active' | 'acknowledged' | 'resolved'>('all');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'warning'>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSeverityFilterOpen, setIsSeverityFilterOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  // Get alerts from context
  const { alerts, updateAlertStatus, removeAlert } = useAlerts();

  // Apply filters
  const filteredAlerts = alerts.filter(alert => {
    // Status filter
    if (filter !== 'all' && alert.status !== filter) {
      return false;
    }

    // Severity filter
    if (severityFilter !== 'all' && alert.severity !== severityFilter) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    // Sort by timestamp (newest first)
    return b.timestamp.getTime() - a.timestamp.getTime();
  });

  // Handle acknowledge button
  const handleAcknowledge = (alert: Alert, e: React.MouseEvent) => {
    e.stopPropagation();
    updateAlertStatus(alert.id, 'acknowledged');
  };

  // Handle resolve button
  const handleResolve = (alert: Alert, e: React.MouseEvent) => {
    e.stopPropagation();
    updateAlertStatus(alert.id, 'resolved');
  };

  // Handle close button
  const handleClose = (alert: Alert, e: React.MouseEvent) => {
    e.stopPropagation();
    removeAlert(alert.id);
  };

  // Handle view details
  const handleViewDetails = (alert: Alert) => {
    setSelectedAlert(alert);
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cpu':
        return <CpuIcon className="h-4 w-4 text-gray-500" />;
      case 'memory':
        return <MemoryStickIcon className="h-4 w-4 text-gray-500" />;
      case 'disk':
        return <HardDriveIcon className="h-4 w-4 text-gray-500" />;
      case 'network':
        return <NetworkIcon className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="h-full">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Alerts
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            System resource alerts for CPU, memory, disk, and network
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          {/* Status filter */}
          <div className="relative">
            <button
              onClick={() => {
                setIsFilterOpen(!isFilterOpen);
                setIsSeverityFilterOpen(false);
              }}
              className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FilterIcon className="h-4 w-4 mr-2" />
              Status: {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1">
                  <button
                    onClick={() => {
                      setFilter('all');
                      setIsFilterOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      filter === 'all'
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    All Alerts
                  </button>
                  <button
                    onClick={() => {
                      setFilter('active');
                      setIsFilterOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      filter === 'active'
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    Active Alerts
                  </button>
                  <button
                    onClick={() => {
                      setFilter('acknowledged');
                      setIsFilterOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      filter === 'acknowledged'
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    Acknowledged Alerts
                  </button>
                  <button
                    onClick={() => {
                      setFilter('resolved');
                      setIsFilterOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      filter === 'resolved'
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    Resolved Alerts
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Severity filter */}
          <div className="relative">
            <button
              onClick={() => {
                setIsSeverityFilterOpen(!isSeverityFilterOpen);
                setIsFilterOpen(false);
              }}
              className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <AlertTriangleIcon className="h-4 w-4 mr-2" />
              Severity: {severityFilter.charAt(0).toUpperCase() + severityFilter.slice(1)}
            </button>
            {isSeverityFilterOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1">
                  <button
                    onClick={() => {
                      setSeverityFilter('all');
                      setIsSeverityFilterOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      severityFilter === 'all'
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    All Severities
                  </button>
                  <button
                    onClick={() => {
                      setSeverityFilter('critical');
                      setIsSeverityFilterOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      severityFilter === 'critical'
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    Critical Only (95-100%)
                  </button>
                  <button
                    onClick={() => {
                      setSeverityFilter('warning');
                      setIsSeverityFilterOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      severityFilter === 'warning'
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    Warning Only (90-95%)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {filteredAlerts.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center border border-gray-200 dark:border-gray-700">
          <div className="flex justify-center mb-4">
            <AlertTriangleIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No alerts found</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Alerts will appear here when system resources exceed thresholds:
          </p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center text-yellow-800 dark:text-yellow-300 font-medium mb-1">
                <AlertTriangleIcon className="h-4 w-4 mr-1" /> Warning Alerts (90-95%)
              </div>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 pl-5 list-disc">
                <li>CPU usage between 90-95%</li>
                <li>Memory usage between 90-95%</li>
                <li>Disk usage between 90-95%</li>
                <li>Network traffic between 90-95%</li>
              </ul>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
              <div className="flex items-center text-red-800 dark:text-red-300 font-medium mb-1">
                <AlertCircleIcon className="h-4 w-4 mr-1" /> Critical Alerts (95-100%)
              </div>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 pl-5 list-disc">
                <li>CPU usage above 95%</li>
                <li>Memory usage above 95%</li>
                <li>Disk usage above 95%</li>
                <li>Network traffic above 95%</li>
              </ul>
            </div>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-4">
            Click the "MANUAL REFRESH" button on the dashboard to check for new alerts
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAlerts.map(alert => (
            <div
              key={alert.id}
              className={`bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 border-l-4 ${
                alert.severity === 'critical'
                  ? 'border-red-500'
                  : 'border-yellow-500'
              } cursor-pointer hover:shadow-md transition-shadow`}
              onClick={() => handleViewDetails(alert)}
            >
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {alert.severity === 'critical' ? (
                      <AlertCircleIcon className="h-5 w-5 text-red-500" />
                    ) : (
                      <AlertTriangleIcon className="h-5 w-5 text-yellow-500" />
                    )}
                    <h3 className="ml-2 text-lg font-medium text-gray-900 dark:text-white">
                      {alert.title}
                    </h3>
                    <div className="ml-3">
                      {alert.severity === 'critical' ? (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-800">
                          Critical
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800">
                          Warning
                        </span>
                      )}
                    </div>
                  </div>
                  {alert.status === 'active' && (
                    <button
                      className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                      onClick={(e) => handleClose(alert, e)}
                    >
                      <XIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
                <div className="mt-4">
                  <p className="text-gray-600 dark:text-gray-300">
                    {alert.message}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400">
                    <span className="mr-4 flex items-center">
                      {getCategoryIcon(alert.category)}
                      <span className="ml-1">{alert.category.charAt(0).toUpperCase() + alert.category.slice(1)}</span>
                    </span>
                    <span className="mr-4">
                      Value: {alert.value}% (Threshold: {alert.threshold}%)
                    </span>
                    <span className="mr-4">
                      Created: {alert.timestamp.toLocaleString()}
                    </span>
                    {alert.status === 'acknowledged' && alert.acknowledgedAt && (
                      <span className="mr-4">
                        Acknowledged: {alert.acknowledgedAt.toLocaleString()}
                      </span>
                    )}
                    {alert.status === 'resolved' && alert.resolvedAt && (
                      <span className="mr-4">
                        Resolved: {alert.resolvedAt.toLocaleString()}
                      </span>
                    )}
                    <span className="mr-4">
                      {alert.status === 'active' ? (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-800">
                          Active
                        </span>
                      ) : alert.status === 'acknowledged' ? (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800">
                          Acknowledged
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800">
                          Resolved
                        </span>
                      )}
                    </span>
                  </div>
                </div>
                {alert.status === 'active' && (
                  <div className="mt-4 flex space-x-3">
                    <button
                      className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 border border-indigo-700"
                      onClick={(e) => handleAcknowledge(alert, e)}
                    >
                      Acknowledge
                    </button>
                    <button
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 border border-green-700"
                      onClick={(e) => handleResolve(alert, e)}
                    >
                      Resolve
                    </button>
                    <button
                      className="px-3 py-1 border border-gray-300 dark:border-gray-600 text-sm rounded text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(alert);
                      }}
                    >
                      View Details
                    </button>
                  </div>
                )}
                {alert.status === 'acknowledged' && (
                  <div className="mt-4 flex space-x-3">
                    <button
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 border border-green-700"
                      onClick={(e) => handleResolve(alert, e)}
                    >
                      Resolve
                    </button>
                    <button
                      className="px-3 py-1 border border-gray-300 dark:border-gray-600 text-sm rounded text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(alert);
                      }}
                    >
                      View Details
                    </button>
                  </div>
                )}
                {alert.status === 'resolved' && (
                  <div className="mt-4 flex space-x-3">
                    <button
                      className="px-3 py-1 border border-gray-300 dark:border-gray-600 text-sm rounded text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(alert);
                      }}
                    >
                      View Details
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Alert details modal */}
      {selectedAlert && (
        <AlertDetailsModal
          alert={selectedAlert}
          onClose={() => setSelectedAlert(null)}
        />
      )}
    </div>
  );
};

export default Alerts;

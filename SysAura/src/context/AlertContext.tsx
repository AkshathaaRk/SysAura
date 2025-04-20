import React, { createContext, useContext, useState, ReactNode } from 'react';

// Simple alert type
type AlertSeverity = 'critical' | 'warning' | 'info';
type AlertStatus = 'active' | 'acknowledged' | 'resolved';

interface Alert {
  id: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  status: AlertStatus;
}

interface AlertContextType {
  alerts: Alert[];
  addAlert: (alert: Omit<Alert, 'id'>) => void;
  removeAlert: (id: string) => void;
  clearAlerts: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlerts = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlerts must be used within an AlertProvider');
  }
  return context;
};

interface AlertProviderProps {
  children: ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // Add a single alert
  const addAlert = (alert: Omit<Alert, 'id'>) => {
    const newAlert = {
      ...alert,
      id: Date.now().toString()
    };
    setAlerts(prevAlerts => [...prevAlerts, newAlert]);
  };

  // Remove an alert
  const removeAlert = (id: string) => {
    setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== id));
  };

  // Clear all alerts
  const clearAlerts = () => {
    setAlerts([]);
  };

  return (
    <AlertContext.Provider
      value={{
        alerts,
        addAlert,
        removeAlert,
        clearAlerts
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import websocketService from '../api/websocket';

// Components
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Servers from '../pages/Servers';
import Systems from '../pages/Systems';
import Alerts from '../pages/Alerts';
import Reports from '../pages/Reports';
import Settings from '../pages/Settings';
import Profile from '../pages/Profile';
import Layout from './layout/Layout';
import EmailSettings from '../pages/settings/Email';
import PasswordSettings from '../pages/settings/Password';
import PhoneSettings from '../pages/settings/Phone';
import AccountSettings from '../pages/settings/Account';

const AppContent: React.FC = () => {
  const { userRole, signOut } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          setIsAuthenticated(true);

          // Connect to WebSocket
          websocketService.connect();
        } catch (error) {
          console.error('Authentication error:', error);
          localStorage.removeItem('token');
        }
      }

      setIsLoading(false);
    };

    checkAuth();

    // Cleanup WebSocket on unmount
    return () => {
      websocketService.disconnect();
    };
  }, []);

  const handleLogin = (role: 'admin' | 'user', email: string = '') => {
    setIsAuthenticated(true);

    // Connect to WebSocket after login
    websocketService.connect();

    // Store email in localStorage for profile page if provided
    if (email) {
      localStorage.setItem('userEmail', email);
    }

    // Store token in localStorage
    localStorage.setItem('token', 'mock-token-' + Date.now());
  };

  const handleLogout = () => {
    setIsAuthenticated(false);

    // Call the AuthContext signOut function
    signOut();

    // Clear token and disconnect WebSocket
    localStorage.removeItem('token');
    websocketService.disconnect();
  };



  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }


  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />

      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />} />

      {isAuthenticated ? (
        <Route element={<Layout userRole={userRole} onLogout={handleLogout} />}>
          <Route path="/dashboard" element={<Dashboard userRole={userRole} />} />
          {/* System monitoring is now integrated into the Dashboard */}
          {userRole === 'admin' && <Route path="/servers" element={<Servers />} />}
          {userRole === 'admin' && <Route path="/systems" element={<Systems userRole={userRole} />} />}
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/reports" element={<Reports userRole={userRole} />} />
          <Route path="/settings" element={<Settings userRole={userRole} />} />
          <Route path="/settings/email" element={<EmailSettings />} />
          <Route path="/settings/password" element={<PasswordSettings />} />
          <Route path="/settings/phone" element={<PhoneSettings />} />
          <Route path="/settings/account" element={<AccountSettings />} />
          <Route path="/profile" element={<Profile userRole={userRole} />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      ) : (
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}
    </Routes>
  );
};

export default AppContent;

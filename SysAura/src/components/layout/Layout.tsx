import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import SideMenu from './SideMenu';
import Footer from './Footer';
import { useTheme } from '../../context/ThemeContext';
type LayoutProps = {
  userRole: 'admin' | 'user' | null;
  onLogout: () => void;
};
const Layout: React.FC<LayoutProps> = ({
  userRole,
  onLogout
}) => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const toggleSideMenu = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
  };
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header toggleSideMenu={toggleSideMenu} userRole={userRole} theme={theme} toggleTheme={toggleTheme} />
      <div className="flex flex-1">
        <SideMenu isOpen={isSideMenuOpen} onClose={() => setIsSideMenuOpen(false)} userRole={userRole} onLogout={onLogout} />
        <main className="flex-1 overflow-auto p-4">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};
export default Layout;
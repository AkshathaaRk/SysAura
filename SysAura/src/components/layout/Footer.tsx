import React from 'react';

// Author names
const AUTHORS = {
  AUTHOR1: 'Abhishek',
  AUTHOR2: 'Akshatha'
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 px-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-2 md:mb-0">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              &copy; {new Date().getFullYear()} SysAura - System Monitoring Solution
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Developed by <span className="font-medium text-indigo-600 dark:text-indigo-400">{AUTHORS.AUTHOR1}</span> and <span className="font-medium text-indigo-600 dark:text-indigo-400">{AUTHORS.AUTHOR2}</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

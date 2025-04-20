import React from 'react';
import { XIcon } from 'lucide-react';
import { Report } from '../../services/reportService';

interface ReportViewerProps {
  report: Report;
  onClose: () => void;
}

const ReportViewer: React.FC<ReportViewerProps> = ({ report, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              {report.name}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {report.format.toUpperCase()} • {report.size} • Generated: {report.createdAt.toLocaleString()}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-6">
          {report.format === 'pdf' ? (
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400 text-center mb-4">
                PDF Preview (simulated)
              </p>
              <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 p-4 rounded border border-gray-300 dark:border-gray-600 overflow-auto">
                {report.content}
              </pre>
            </div>
          ) : (
            <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 p-4 rounded border border-gray-300 dark:border-gray-600 overflow-auto">
              {report.content}
            </pre>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportViewer;

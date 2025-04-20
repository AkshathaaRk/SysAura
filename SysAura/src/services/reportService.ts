import { metricsAPI } from '../api';
import { generatePDF, generateTextFile } from './pdfGenerator';

export type ReportTimeFrame = '1h' | '4h' | '12h' | '1d' | '1w' | '1m';
export type ReportFormat = 'pdf' | 'txt';

export interface Report {
  id: string;
  name: string;
  timeFrame: ReportTimeFrame;
  createdAt: Date;
  format: ReportFormat;
  size: string;
  content?: string;
  url?: string;
}

// Generate a unique ID for reports
const generateReportId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

// Get time frame in milliseconds
const getTimeFrameMilliseconds = (timeFrame: ReportTimeFrame): number => {
  switch (timeFrame) {
    case '1h':
      return 60 * 60 * 1000; // 1 hour
    case '4h':
      return 4 * 60 * 60 * 1000; // 4 hours
    case '12h':
      return 12 * 60 * 60 * 1000; // 12 hours
    case '1d':
      return 24 * 60 * 60 * 1000; // 1 day
    case '1w':
      return 7 * 24 * 60 * 60 * 1000; // 1 week
    case '1m':
      return 30 * 24 * 60 * 60 * 1000; // 1 month (approx)
    default:
      return 24 * 60 * 60 * 1000; // Default to 1 day
  }
};

// Format file size
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) {
    return bytes + ' B';
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(1) + ' KB';
  } else {
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }
};

// Generate report content based on metrics data
const generateReportContent = async (
  name: string,
  timeFrame: ReportTimeFrame,
  format: ReportFormat
): Promise<{ content: string; size: string }> => {
  try {
    // Get current metrics
    const metrics = await metricsAPI.getCurrentMetrics();
    const cpuInfo = await metricsAPI.getCpuInfo();
    const memoryInfo = await metricsAPI.getMemoryInfo();
    const diskInfo = await metricsAPI.getDiskInfo();
    const networkInfo = await metricsAPI.getNetworkInfo();

    // Create report content
    let content = '';

    if (format === 'txt') {
      // Plain text format
      content += `SYSTEM PERFORMANCE REPORT: ${name}\n`;
      content += `Generated: ${new Date().toLocaleString()}\n`;
      content += `Time Frame: ${timeFrame}\n`;
      content += `===========================================\n\n`;

      // CPU Information
      content += `CPU INFORMATION\n`;
      content += `===========================================\n`;
      content += `Model: ${cpuInfo?.model || 'Unknown'}\n`;
      content += `Cores: ${cpuInfo?.cores || 0} (${cpuInfo?.physicalCores || 0} Physical)\n`;
      content += `Speed: ${cpuInfo?.speed || 0} GHz\n`;
      content += `Current Usage: ${metrics?.cpuUsage || 0}%\n\n`;

      // Memory Information
      content += `MEMORY INFORMATION\n`;
      content += `===========================================\n`;
      content += `Total Memory: ${memoryInfo?.total?.toFixed(2) || 0} GB\n`;
      content += `Used Memory: ${memoryInfo?.used?.toFixed(2) || 0} GB (${metrics?.memoryUsage || 0}%)\n`;
      content += `Free Memory: ${memoryInfo?.free?.toFixed(2) || 0} GB\n\n`;

      // Disk Information
      content += `DISK INFORMATION\n`;
      content += `===========================================\n`;
      if (diskInfo?.disks && diskInfo.disks.length > 0) {
        diskInfo.disks.forEach((disk, index) => {
          content += `Disk ${index + 1}: ${disk.name}\n`;
          content += `  Size: ${disk.size.toFixed(1)} GB\n`;
          content += `  Used: ${disk.used.toFixed(1)} GB (${disk.usedPercentage}%)\n`;
        });
      } else {
        content += `Average Disk Usage: ${metrics?.diskUsage || 0}%\n`;
      }
      content += `\n`;

      // Network Information
      content += `NETWORK INFORMATION\n`;
      content += `===========================================\n`;
      content += `Incoming Traffic: ${networkInfo?.totalIncoming?.toFixed(2) || 0} MB/s\n`;
      content += `Outgoing Traffic: ${networkInfo?.totalOutgoing?.toFixed(2) || 0} MB/s\n`;
      if (networkInfo?.interfaces && networkInfo.interfaces.length > 0) {
        content += `\nNetwork Interfaces:\n`;
        networkInfo.interfaces.forEach((iface, index) => {
          content += `  ${iface.name}: ${iface.operstate}\n`;
          if (iface.ip) content += `    IP: ${iface.ip}\n`;
          if (iface.mac) content += `    MAC: ${iface.mac}\n`;
          content += `    Incoming: ${iface.incoming.toFixed(2)} MB/s\n`;
          content += `    Outgoing: ${iface.outgoing.toFixed(2)} MB/s\n`;
        });
      }
    } else {
      // PDF format (simulated as text for now)
      content += `SYSTEM PERFORMANCE REPORT: ${name}\n`;
      content += `Generated: ${new Date().toLocaleString()}\n`;
      content += `Time Frame: ${timeFrame}\n`;
      content += `===========================================\n\n`;

      // Summary
      content += `SUMMARY\n`;
      content += `===========================================\n`;
      content += `CPU Usage: ${metrics?.cpuUsage || 0}%\n`;
      content += `Memory Usage: ${metrics?.memoryUsage || 0}%\n`;
      content += `Disk Usage: ${metrics?.diskUsage || 0}%\n`;
      content += `Network Traffic: In ${networkInfo?.totalIncoming?.toFixed(2) || 0} MB/s, Out ${networkInfo?.totalOutgoing?.toFixed(2) || 0} MB/s\n\n`;

      // Add more detailed information similar to TXT format
      // (Abbreviated for brevity)
      content += `Detailed information about CPU, Memory, Disk, and Network would be included in the actual PDF.\n`;
    }

    // Calculate size (1 character is roughly 1 byte in UTF-8)
    const size = formatFileSize(content.length);

    return { content, size };
  } catch (error) {
    console.error('Error generating report content:', error);
    return {
      content: 'Error generating report content. Please try again later.',
      size: '0 B'
    };
  }
};

// Get saved reports from localStorage
export const getSavedReports = (): Report[] => {
  try {
    const savedReports = localStorage.getItem('sysauraft_reports');
    if (savedReports) {
      const parsedReports = JSON.parse(savedReports);
      // Convert string dates back to Date objects
      return parsedReports.map((report: any) => ({
        ...report,
        createdAt: new Date(report.createdAt)
      }));
    }
    return [];
  } catch (error) {
    console.error('Error loading reports from localStorage:', error);
    return [];
  }
};

// Save reports to localStorage
const saveReports = (reports: Report[]): void => {
  localStorage.setItem('sysauraft_reports', JSON.stringify(reports));
};

// Generate a new report
export const generateReport = async (
  name: string,
  timeFrame: ReportTimeFrame,
  format: ReportFormat
): Promise<Report> => {
  // Generate report content
  const { content, size } = await generateReportContent(name, timeFrame, format);

  // Create report object
  const report: Report = {
    id: generateReportId(),
    name,
    timeFrame,
    createdAt: new Date(),
    format,
    size,
    content
  };

  // Save report to localStorage
  const savedReports = getSavedReports();
  saveReports([report, ...savedReports]);

  return report;
};

// Delete a report
export const deleteReport = (reportId: string): void => {
  const savedReports = getSavedReports();
  const updatedReports = savedReports.filter(report => report.id !== reportId);
  saveReports(updatedReports);
};

// Download a report
export const downloadReport = (report: Report): void => {
  if (!report.content) {
    console.error('Report content is missing');
    return;
  }

  // Create a blob with the report content
  let blob;
  if (report.format === 'pdf') {
    blob = generatePDF(report.content);
  } else {
    blob = generateTextFile(report.content);
  }

  const url = URL.createObjectURL(blob);

  // Create a link element and trigger download
  const a = document.createElement('a');
  a.href = url;
  a.download = `${report.name.replace(/\s+/g, '_')}_${report.timeFrame}_${new Date().toISOString().split('T')[0]}.${report.format}`;
  document.body.appendChild(a);
  a.click();

  // Clean up
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

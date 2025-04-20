/**
 * Worker Service
 * 
 * This service provides a way to offload heavy computations to a web worker
 * to prevent UI freezing and reduce CPU usage on the main thread.
 */

// Helper function to create a worker from a function
const createWorker = (fn: Function): Worker => {
  const blob = new Blob(
    [`self.onmessage = function(e) { self.postMessage((${fn.toString()})(e.data)); }`],
    { type: 'application/javascript' }
  );
  return new Worker(URL.createObjectURL(blob));
};

// Process metrics data in a worker
export const processMetricsInWorker = (metricsData: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      // Create a worker with the processing function
      const worker = createWorker((data: any) => {
        // This function runs in a separate thread
        try {
          // Example processing: Calculate averages, format data, etc.
          const processed = { ...data };
          
          // Process CPU data
          if (data.cpuInfo) {
            // Calculate average CPU usage across all cores
            const cores = data.cpuInfo.cores || 1;
            const totalUsage = data.cpuUsage || 0;
            processed.averageCoreUsage = totalUsage / cores;
          }
          
          // Process memory data
          if (data.memoryInfo) {
            // Calculate memory usage in different formats
            const total = data.memoryInfo.total || 1;
            const used = data.memoryInfo.used || 0;
            processed.memoryUsageGB = used;
            processed.memoryFreeGB = total - used;
            processed.memoryUsagePercent = (used / total) * 100;
          }
          
          // Process disk data
          if (data.diskInfo && data.diskInfo.disks) {
            // Calculate total disk space and usage
            let totalSize = 0;
            let totalUsed = 0;
            
            data.diskInfo.disks.forEach((disk: any) => {
              totalSize += disk.size || 0;
              totalUsed += disk.used || 0;
            });
            
            processed.totalDiskSize = totalSize;
            processed.totalDiskUsed = totalUsed;
            processed.totalDiskFree = totalSize - totalUsed;
            processed.totalDiskUsagePercent = totalSize > 0 ? (totalUsed / totalSize) * 100 : 0;
          }
          
          // Process network data
          if (data.networkInfo) {
            // Calculate total network traffic
            const incoming = data.networkInfo.totalIncoming || 0;
            const outgoing = data.networkInfo.totalOutgoing || 0;
            processed.totalNetworkTraffic = incoming + outgoing;
          }
          
          return processed;
        } catch (error) {
          // If there's an error in the worker, return the original data
          return data;
        }
      });
      
      // Set up message handler
      worker.onmessage = (e) => {
        // Terminate the worker when done
        worker.terminate();
        resolve(e.data);
      };
      
      // Set up error handler
      worker.onerror = (error) => {
        // Terminate the worker on error
        worker.terminate();
        reject(error);
      };
      
      // Start the worker with the metrics data
      worker.postMessage(metricsData);
    } catch (error) {
      // If we can't create a worker, process on the main thread
      console.warn('Web Worker creation failed, processing on main thread:', error);
      resolve(metricsData);
    }
  });
};

// Export other worker functions as needed
export default {
  processMetricsInWorker
};

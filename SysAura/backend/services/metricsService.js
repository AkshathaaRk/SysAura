import si from 'systeminformation';

// Store historical data for charts
const metricsHistory = {
  cpu: [],
  memory: [],
  disk: [],
  network: []
};

// Maximum number of data points to keep in history
const MAX_HISTORY_LENGTH = 60; // 10 minutes at 10-second intervals

// Get detailed CPU information
export const getCpuInfo = async () => {
  try {
    const cpuData = await si.cpu();
    const currentLoad = await si.currentLoad();

    // Get per-core usage
    const coreData = currentLoad.cpus.map((core, index) => ({
      core: index,
      load: Math.round(core.load)
    }));

    // Add to history
    metricsHistory.cpu.push({
      timestamp: new Date(),
      usage: Math.round(currentLoad.currentLoad)
    });

    // Trim history if needed
    if (metricsHistory.cpu.length > MAX_HISTORY_LENGTH) {
      metricsHistory.cpu.shift();
    }

    return {
      model: cpuData.manufacturer + ' ' + cpuData.brand,
      cores: cpuData.cores,
      physicalCores: cpuData.physicalCores,
      speed: cpuData.speed,
      usage: Math.round(currentLoad.currentLoad),
      coreData,
      history: metricsHistory.cpu
    };
  } catch (error) {
    console.error('Error getting CPU info:', error);
    throw error;
  }
};

// Get detailed memory information
export const getMemoryInfo = async () => {
  try {
    const memData = await si.mem();
    const memLayout = await si.memLayout();

    const usedPercentage = Math.round((memData.used / memData.total) * 100);

    // Add to history
    metricsHistory.memory.push({
      timestamp: new Date(),
      usage: usedPercentage
    });

    // Trim history if needed
    if (metricsHistory.memory.length > MAX_HISTORY_LENGTH) {
      metricsHistory.memory.shift();
    }

    return {
      total: Math.round(memData.total / (1024 * 1024 * 1024) * 100) / 100, // GB with 2 decimal places
      used: Math.round(memData.used / (1024 * 1024 * 1024) * 100) / 100,
      free: Math.round(memData.free / (1024 * 1024 * 1024) * 100) / 100,
      usedPercentage,
      layout: memLayout.map(mem => ({
        size: Math.round(mem.size / (1024 * 1024 * 1024) * 100) / 100,
        type: mem.type,
        clockSpeed: mem.clockSpeed
      })),
      history: metricsHistory.memory
    };
  } catch (error) {
    console.error('Error getting memory info:', error);
    throw error;
  }
};

// Get detailed disk information
export const getDiskInfo = async () => {
  try {
    const fsData = await si.fsSize();
    const diskLayout = await si.diskLayout();

    const disks = fsData.map(disk => ({
      name: disk.mount,
      fs: disk.fs,
      size: Math.round(disk.size / (1024 * 1024 * 1024) * 100) / 100, // GB with 2 decimal places
      used: Math.round(disk.used / (1024 * 1024 * 1024) * 100) / 100,
      usedPercentage: Math.round((disk.used / disk.size) * 100)
    }));

    // Calculate average disk usage
    const averageUsage = disks.length > 0
      ? Math.round(disks.reduce((acc, disk) => acc + disk.usedPercentage, 0) / disks.length)
      : 0;

    // Add to history
    metricsHistory.disk.push({
      timestamp: new Date(),
      usage: averageUsage
    });

    // Trim history if needed
    if (metricsHistory.disk.length > MAX_HISTORY_LENGTH) {
      metricsHistory.disk.shift();
    }

    return {
      disks,
      layout: diskLayout.map(disk => ({
        device: disk.device,
        type: disk.type,
        name: disk.name,
        size: Math.round(disk.size / (1024 * 1024 * 1024) * 100) / 100
      })),
      averageUsage,
      history: metricsHistory.disk
    };
  } catch (error) {
    console.error('Error getting disk info:', error);
    throw error;
  }
};

// Get detailed network information
export const getNetworkInfo = async () => {
  try {
    const netStats = await si.networkStats();
    const netInterfaces = await si.networkInterfaces();

    const interfaces = netStats.map(net => {
      const interfaceInfo = netInterfaces.find(i => i.iface === net.iface) || {};
      return {
        name: net.iface,
        ip: interfaceInfo.ip4 || '',
        mac: interfaceInfo.mac || '',
        type: interfaceInfo.type || '',
        operstate: interfaceInfo.operstate || '',
        incoming: Math.round(net.rx_sec / (1024 * 1024) * 100) / 100, // MB/s with 2 decimal places
        outgoing: Math.round(net.tx_sec / (1024 * 1024) * 100) / 100
      };
    });

    // Calculate total network traffic
    const totalIncoming = interfaces.reduce((acc, net) => acc + net.incoming, 0);
    const totalOutgoing = interfaces.reduce((acc, net) => acc + net.outgoing, 0);

    // Add to history
    metricsHistory.network.push({
      timestamp: new Date(),
      incoming: totalIncoming,
      outgoing: totalOutgoing
    });

    // Trim history if needed
    if (metricsHistory.network.length > MAX_HISTORY_LENGTH) {
      metricsHistory.network.shift();
    }

    return {
      interfaces,
      totalIncoming,
      totalOutgoing,
      history: metricsHistory.network
    };
  } catch (error) {
    console.error('Error getting network info:', error);
    throw error;
  }
};

// Get all system metrics combined
export const getSystemMetrics = async () => {
  try {
    // Get all metrics in parallel
    const [cpuInfo, memoryInfo, diskInfo, networkInfo] = await Promise.all([
      getCpuInfo(),
      getMemoryInfo(),
      getDiskInfo(),
      getNetworkInfo()
    ]);

    // Return combined metrics
    return {
      cpuUsage: cpuInfo.usage,
      cpuInfo,
      memoryUsage: memoryInfo.usedPercentage,
      memoryInfo,
      diskUsage: diskInfo.averageUsage,
      diskInfo,
      networkIncoming: networkInfo.totalIncoming,
      networkOutgoing: networkInfo.totalOutgoing,
      networkInfo,
      timestamp: new Date()
    };
  } catch (error) {
    console.error('Error collecting system metrics:', error);
    throw error;
  }
};

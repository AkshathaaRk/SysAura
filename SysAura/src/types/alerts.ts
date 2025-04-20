// Alert types for the application

export type AlertSeverity = 'critical' | 'warning' | 'info';
export type AlertStatus = 'active' | 'acknowledged' | 'resolved';
export type AlertCategory = 'cpu' | 'memory' | 'disk' | 'network' | 'system';

export interface Alert {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  status: AlertStatus;
  severity: AlertSeverity;
  category: AlertCategory;
  source: string;
  value?: number;
  threshold?: number;
  acknowledgedAt?: Date;
  acknowledgedBy?: string;
  resolvedAt?: Date;
  details?: string;
}

// Alert thresholds
export const ALERT_THRESHOLDS = {
  cpu: {
    warning: 90,
    critical: 95
  },
  memory: {
    warning: 90,
    critical: 95
  },
  disk: {
    warning: 90,
    critical: 95
  },
  network: {
    warning: 90,
    critical: 95
  }
};

// Generate a unique ID for alerts
export const generateAlertId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

// Check if metrics exceed thresholds and generate alerts
export const checkMetricsForAlerts = (metrics: any): Alert[] => {
  const alerts: Alert[] = [];
  const now = new Date();
  
  // Check CPU usage
  if (metrics.cpuUsage !== undefined) {
    if (metrics.cpuUsage >= ALERT_THRESHOLDS.cpu.critical) {
      alerts.push({
        id: generateAlertId(),
        title: 'Critical CPU Usage',
        message: `CPU usage is at ${metrics.cpuUsage}%, exceeding critical threshold of ${ALERT_THRESHOLDS.cpu.critical}%`,
        timestamp: now,
        status: 'active',
        severity: 'critical',
        category: 'cpu',
        source: 'Local System',
        value: metrics.cpuUsage,
        threshold: ALERT_THRESHOLDS.cpu.critical
      });
    } else if (metrics.cpuUsage >= ALERT_THRESHOLDS.cpu.warning) {
      alerts.push({
        id: generateAlertId(),
        title: 'High CPU Usage',
        message: `CPU usage is at ${metrics.cpuUsage}%, exceeding warning threshold of ${ALERT_THRESHOLDS.cpu.warning}%`,
        timestamp: now,
        status: 'active',
        severity: 'warning',
        category: 'cpu',
        source: 'Local System',
        value: metrics.cpuUsage,
        threshold: ALERT_THRESHOLDS.cpu.warning
      });
    }
  }
  
  // Check Memory usage
  if (metrics.memoryUsage !== undefined) {
    if (metrics.memoryUsage >= ALERT_THRESHOLDS.memory.critical) {
      alerts.push({
        id: generateAlertId(),
        title: 'Critical Memory Usage',
        message: `Memory usage is at ${metrics.memoryUsage}%, exceeding critical threshold of ${ALERT_THRESHOLDS.memory.critical}%`,
        timestamp: now,
        status: 'active',
        severity: 'critical',
        category: 'memory',
        source: 'Local System',
        value: metrics.memoryUsage,
        threshold: ALERT_THRESHOLDS.memory.critical
      });
    } else if (metrics.memoryUsage >= ALERT_THRESHOLDS.memory.warning) {
      alerts.push({
        id: generateAlertId(),
        title: 'High Memory Usage',
        message: `Memory usage is at ${metrics.memoryUsage}%, exceeding warning threshold of ${ALERT_THRESHOLDS.memory.warning}%`,
        timestamp: now,
        status: 'active',
        severity: 'warning',
        category: 'memory',
        source: 'Local System',
        value: metrics.memoryUsage,
        threshold: ALERT_THRESHOLDS.memory.warning
      });
    }
  }
  
  // Check Disk usage
  if (metrics.diskUsage !== undefined) {
    if (metrics.diskUsage >= ALERT_THRESHOLDS.disk.critical) {
      alerts.push({
        id: generateAlertId(),
        title: 'Critical Disk Usage',
        message: `Disk usage is at ${metrics.diskUsage}%, exceeding critical threshold of ${ALERT_THRESHOLDS.disk.critical}%`,
        timestamp: now,
        status: 'active',
        severity: 'critical',
        category: 'disk',
        source: 'Local System',
        value: metrics.diskUsage,
        threshold: ALERT_THRESHOLDS.disk.critical
      });
    } else if (metrics.diskUsage >= ALERT_THRESHOLDS.disk.warning) {
      alerts.push({
        id: generateAlertId(),
        title: 'High Disk Usage',
        message: `Disk usage is at ${metrics.diskUsage}%, exceeding warning threshold of ${ALERT_THRESHOLDS.disk.warning}%`,
        timestamp: now,
        status: 'active',
        severity: 'warning',
        category: 'disk',
        source: 'Local System',
        value: metrics.diskUsage,
        threshold: ALERT_THRESHOLDS.disk.warning
      });
    }
  }
  
  // Check individual disk partitions if available
  if (metrics.diskInfo && metrics.diskInfo.disks) {
    metrics.diskInfo.disks.forEach((disk: any, index: number) => {
      if (disk.usedPercentage >= ALERT_THRESHOLDS.disk.critical) {
        alerts.push({
          id: generateAlertId(),
          title: `Critical Disk Usage on ${disk.name}`,
          message: `Disk usage on ${disk.name} is at ${disk.usedPercentage}%, exceeding critical threshold of ${ALERT_THRESHOLDS.disk.critical}%`,
          timestamp: now,
          status: 'active',
          severity: 'critical',
          category: 'disk',
          source: `Disk ${disk.name}`,
          value: disk.usedPercentage,
          threshold: ALERT_THRESHOLDS.disk.critical
        });
      } else if (disk.usedPercentage >= ALERT_THRESHOLDS.disk.warning) {
        alerts.push({
          id: generateAlertId(),
          title: `High Disk Usage on ${disk.name}`,
          message: `Disk usage on ${disk.name} is at ${disk.usedPercentage}%, exceeding warning threshold of ${ALERT_THRESHOLDS.disk.warning}%`,
          timestamp: now,
          status: 'active',
          severity: 'warning',
          category: 'disk',
          source: `Disk ${disk.name}`,
          value: disk.usedPercentage,
          threshold: ALERT_THRESHOLDS.disk.warning
        });
      }
    });
  }
  
  // Check Network usage if available
  if (metrics.networkInfo && 
      (metrics.networkInfo.totalIncoming !== undefined || 
       metrics.networkInfo.totalOutgoing !== undefined)) {
    
    // This is a simplified check - in a real system you'd have more sophisticated network monitoring
    const networkUsage = Math.max(
      metrics.networkInfo.totalIncoming || 0, 
      metrics.networkInfo.totalOutgoing || 0
    );
    
    // For demo purposes, we'll consider high values as percentage of a theoretical maximum
    // In a real system, you'd compare against bandwidth limits or historical baselines
    const normalizedUsage = Math.min(networkUsage * 10, 100); // Scale for demo
    
    if (normalizedUsage >= ALERT_THRESHOLDS.network.critical) {
      alerts.push({
        id: generateAlertId(),
        title: 'Critical Network Traffic',
        message: `Network traffic is very high (${networkUsage.toFixed(2)} MB/s), exceeding critical threshold`,
        timestamp: now,
        status: 'active',
        severity: 'critical',
        category: 'network',
        source: 'Network Interface',
        value: normalizedUsage,
        threshold: ALERT_THRESHOLDS.network.critical
      });
    } else if (normalizedUsage >= ALERT_THRESHOLDS.network.warning) {
      alerts.push({
        id: generateAlertId(),
        title: 'High Network Traffic',
        message: `Network traffic is high (${networkUsage.toFixed(2)} MB/s), exceeding warning threshold`,
        timestamp: now,
        status: 'active',
        severity: 'warning',
        category: 'network',
        source: 'Network Interface',
        value: normalizedUsage,
        threshold: ALERT_THRESHOLDS.network.warning
      });
    }
  }
  
  return alerts;
};

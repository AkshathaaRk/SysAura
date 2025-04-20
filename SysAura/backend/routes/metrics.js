import express from 'express';
import { auth } from '../middleware/auth.js';
import db from '../db/database.js';
import { getSystemMetrics, getCpuInfo, getMemoryInfo, getDiskInfo, getNetworkInfo } from '../services/metricsService.js';

const router = express.Router();

// Get current system metrics
router.get('/current', auth, async (req, res) => {
  try {
    // Get all metrics in parallel for complete data
    const [metrics, cpuInfo, memoryInfo, diskInfo, networkInfo] = await Promise.all([
      getSystemMetrics(),
      getCpuInfo(),
      getMemoryInfo(),
      getDiskInfo(),
      getNetworkInfo()
    ]);

    // Combine all metrics
    const combinedMetrics = {
      ...metrics,
      cpuInfo,
      memoryInfo,
      diskInfo,
      networkInfo
    };

    console.log('Manual refresh requested at', new Date().toLocaleTimeString());
    res.json(combinedMetrics);
  } catch (error) {
    console.error('Error getting system metrics:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get detailed CPU information
router.get('/cpu', auth, async (req, res) => {
  try {
    const cpuInfo = await getCpuInfo();
    res.json(cpuInfo);
  } catch (error) {
    console.error('Error getting CPU info:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get detailed memory information
router.get('/memory', auth, async (req, res) => {
  try {
    const memoryInfo = await getMemoryInfo();
    res.json(memoryInfo);
  } catch (error) {
    console.error('Error getting memory info:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get detailed disk information
router.get('/disk', auth, async (req, res) => {
  try {
    const diskInfo = await getDiskInfo();
    res.json(diskInfo);
  } catch (error) {
    console.error('Error getting disk info:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get detailed network information
router.get('/network', auth, async (req, res) => {
  try {
    const networkInfo = await getNetworkInfo();
    res.json(networkInfo);
  } catch (error) {
    console.error('Error getting network info:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get metrics history for a system
router.get('/history/:systemId', auth, (req, res) => {
  const { systemId } = req.params;
  const { limit = 24, offset = 0 } = req.query;

  db.all(
    `SELECT * FROM metrics
     WHERE systemId = ?
     ORDER BY timestamp DESC
     LIMIT ? OFFSET ?`,
    [systemId, parseInt(limit), parseInt(offset)],
    (err, metrics) => {
      if (err) {
        console.error('Error getting metrics history:', err);
        return res.status(500).json({ message: 'Server error' });
      }

      res.json(metrics);
    }
  );
});

// Save system metrics
router.post('/:systemId', auth, (req, res) => {
  const { systemId } = req.params;
  const {
    cpuUsage,
    memoryUsage,
    memoryTotal,
    diskUsage,
    diskTotal,
    networkIncoming,
    networkOutgoing
  } = req.body;

  // Validate input
  if (cpuUsage === undefined || memoryUsage === undefined || diskUsage === undefined) {
    return res.status(400).json({ message: 'Required metrics are missing' });
  }

  // Check if system exists
  db.get('SELECT * FROM systems WHERE id = ?', [systemId], (err, system) => {
    if (err) {
      console.error('Error checking system:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (!system) {
      return res.status(404).json({ message: 'System not found' });
    }

    // Update system status to online
    db.run(
      'UPDATE systems SET status = ?, lastConnected = CURRENT_TIMESTAMP WHERE id = ?',
      ['online', systemId]
    );

    // Save metrics
    db.run(
      `INSERT INTO metrics
       (systemId, cpuUsage, memoryUsage, memoryTotal, diskUsage, diskTotal, networkIncoming, networkOutgoing)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        systemId,
        cpuUsage,
        memoryUsage,
        memoryTotal || 0,
        diskUsage,
        diskTotal || 0,
        networkIncoming || 0,
        networkOutgoing || 0
      ],
      function(err) {
        if (err) {
          console.error('Error saving metrics:', err);
          return res.status(500).json({ message: 'Server error' });
        }

        res.status(201).json({
          id: this.lastID,
          systemId,
          cpuUsage,
          memoryUsage,
          diskUsage
        });

        // Check for alerts
        checkForAlerts(systemId, cpuUsage, memoryUsage, diskUsage);
      }
    );
  });
});

// Helper function to check for alerts
const checkForAlerts = (systemId, cpuUsage, memoryUsage, diskUsage) => {
  // CPU alert
  if (cpuUsage >= 90) {
    createAlert(systemId, 'Critical CPU Usage', `CPU usage is at ${cpuUsage}%`, 'critical');
  } else if (cpuUsage >= 80) {
    createAlert(systemId, 'High CPU Usage', `CPU usage is at ${cpuUsage}%`, 'warning');
  }

  // Memory alert
  if (memoryUsage >= 90) {
    createAlert(systemId, 'Critical Memory Usage', `Memory usage is at ${memoryUsage}%`, 'critical');
  } else if (memoryUsage >= 80) {
    createAlert(systemId, 'High Memory Usage', `Memory usage is at ${memoryUsage}%`, 'warning');
  }

  // Disk alert
  if (diskUsage >= 90) {
    createAlert(systemId, 'Critical Disk Usage', `Disk usage is at ${diskUsage}%`, 'critical');
  } else if (diskUsage >= 80) {
    createAlert(systemId, 'High Disk Usage', `Disk usage is at ${diskUsage}%`, 'warning');
  }
};

// Helper function to create an alert
const createAlert = (systemId, title, message, severity) => {
  db.run(
    'INSERT INTO alerts (systemId, title, message, severity) VALUES (?, ?, ?, ?)',
    [systemId, title, message, severity],
    (err) => {
      if (err) {
        console.error('Error creating alert:', err);
      }
    }
  );
};

export default router;

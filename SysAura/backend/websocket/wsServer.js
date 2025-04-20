import jwt from 'jsonwebtoken';
import { getSystemMetrics, getCpuInfo, getMemoryInfo, getDiskInfo, getNetworkInfo } from '../services/metricsService.js';
import db from '../db/database.js';

// Store connected clients
const clients = new Map();

// Store clients subscribed to local system metrics
const localSystemSubscribers = new Set();

// Local system ID for the current machine
const LOCAL_SYSTEM_ID = 'local';

export const setupWebSocketServer = (wss) => {
  wss.on('connection', (ws, req) => {
    console.log('WebSocket client connected');

    // Handle authentication
    ws.isAuthenticated = false;
    ws.userId = null;
    ws.role = null;

    // Handle messages
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);

        // Handle authentication
        if (data.type === 'auth') {
          handleAuthentication(ws, data.token);
        }

        // Handle subscription to system metrics
        else if (data.type === 'subscribe' && ws.isAuthenticated) {
          handleSubscription(ws, data);
        }

        // Handle unsubscription
        else if (data.type === 'unsubscribe' && ws.isAuthenticated) {
          handleUnsubscription(ws, data);
        }
      } catch (error) {
        console.error('Error handling WebSocket message:', error);
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
      }
    });

    // Handle disconnection
    ws.on('close', () => {
      console.log('WebSocket client disconnected');

      // Remove client from all subscriptions
      for (const [systemId, subscribers] of clients.entries()) {
        subscribers.delete(ws);

        // If no subscribers left for this system, delete the entry
        if (subscribers.size === 0) {
          clients.delete(systemId);
        }
      }
    });
  });

  // Start periodic updates
  startPeriodicUpdates();
};

// Handle client authentication
const handleAuthentication = (ws, token) => {
  if (!token) {
    ws.send(JSON.stringify({ type: 'auth_error', message: 'No token provided' }));
    return;
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');

    // Set authentication status
    ws.isAuthenticated = true;
    ws.userId = decoded.id;
    ws.role = decoded.role;

    ws.send(JSON.stringify({ type: 'auth_success', userId: decoded.id, role: decoded.role }));
  } catch (error) {
    console.error('WebSocket authentication error:', error);
    ws.send(JSON.stringify({ type: 'auth_error', message: 'Invalid token' }));
  }
};

// Handle subscription to system metrics
const handleSubscription = (ws, data) => {
  const { systemId } = data;

  if (!systemId) {
    ws.send(JSON.stringify({ type: 'error', message: 'System ID is required' }));
    return;
  }

  // Special case for local system metrics
  if (systemId === LOCAL_SYSTEM_ID) {
    // Add to local system subscribers
    localSystemSubscribers.add(ws);
    ws.send(JSON.stringify({ type: 'subscribed', systemId: LOCAL_SYSTEM_ID }));

    // Send initial data
    sendLocalSystemData(ws);
    return;
  }

  // For remote systems, check if user has access
  if (ws.role !== 'admin') {
    db.get('SELECT * FROM systems WHERE id = ? AND userId = ?', [systemId, ws.userId], (err, system) => {
      if (err || !system) {
        ws.send(JSON.stringify({ type: 'error', message: 'Access denied to this system' }));
        return;
      }

      // Add client to subscribers for this system
      addSubscriber(ws, systemId);
    });
  } else {
    // Admin has access to all systems
    addSubscriber(ws, systemId);
  }
};

// Add client to subscribers for a system
const addSubscriber = (ws, systemId) => {
  if (!clients.has(systemId)) {
    clients.set(systemId, new Set());
  }

  clients.get(systemId).add(ws);
  ws.send(JSON.stringify({ type: 'subscribed', systemId }));

  // Send initial data
  sendSystemData(systemId);
};

// Handle unsubscription
const handleUnsubscription = (ws, data) => {
  const { systemId } = data;

  if (!systemId) {
    ws.send(JSON.stringify({ type: 'error', message: 'System ID is required' }));
    return;
  }

  // Special case for local system
  if (systemId === LOCAL_SYSTEM_ID) {
    localSystemSubscribers.delete(ws);
    ws.send(JSON.stringify({ type: 'unsubscribed', systemId: LOCAL_SYSTEM_ID }));
    return;
  }

  // For remote systems
  if (clients.has(systemId)) {
    clients.get(systemId).delete(ws);

    // If no subscribers left for this system, delete the entry
    if (clients.get(systemId).size === 0) {
      clients.delete(systemId);
    }
  }

  ws.send(JSON.stringify({ type: 'unsubscribed', systemId }));
};

// Send local system data to a specific client
const sendLocalSystemData = async (ws) => {
  if (ws.readyState !== 1) { // Not OPEN
    return;
  }

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

    // Send to the client
    ws.send(JSON.stringify({
      type: 'metrics',
      systemId: LOCAL_SYSTEM_ID,
      data: combinedMetrics,
      timestamp: new Date()
    }));

    console.log('Sent metrics update to client at', new Date().toLocaleTimeString());
  } catch (error) {
    console.error('Error sending local system data:', error);
  }
};

// Send local system data to all subscribers
const broadcastLocalSystemData = async () => {
  if (localSystemSubscribers.size === 0) {
    return;
  }

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

    // Send to all subscribers
    const message = JSON.stringify({
      type: 'metrics',
      systemId: LOCAL_SYSTEM_ID,
      data: combinedMetrics,
      timestamp: new Date()
    });

    let sentCount = 0;
    for (const client of localSystemSubscribers) {
      if (client.readyState === 1) { // OPEN
        client.send(message);
        sentCount++;
      }
    }

    console.log(`Broadcast metrics update to ${sentCount} clients at ${new Date().toLocaleTimeString()}`);
  } catch (error) {
    console.error('Error broadcasting local system data:', error);
  }
};

// Send remote system data to all subscribers
const sendSystemData = async (systemId) => {
  if (systemId === LOCAL_SYSTEM_ID || !clients.has(systemId) || clients.get(systemId).size === 0) {
    return;
  }

  try {
    // Get system metrics
    const metrics = await getSystemMetrics();

    // Save metrics to database
    saveMetricsToDatabase(systemId, metrics);

    // Send to all subscribers
    const subscribers = clients.get(systemId);
    const message = JSON.stringify({
      type: 'metrics',
      systemId,
      data: metrics,
      timestamp: new Date()
    });

    for (const client of subscribers) {
      if (client.readyState === 1) { // OPEN
        client.send(message);
      }
    }
  } catch (error) {
    console.error('Error sending system data:', error);
  }
};

// Save metrics to database
const saveMetricsToDatabase = (systemId, metrics) => {
  db.run(
    `INSERT INTO metrics
     (systemId, cpuUsage, memoryUsage, memoryTotal, diskUsage, networkIncoming, networkOutgoing)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      systemId,
      metrics.cpuUsage,
      metrics.memoryUsage,
      metrics.memoryTotal || 0,
      metrics.diskUsage,
      metrics.networkIncoming || 0,
      metrics.networkOutgoing || 0
    ],
    (err) => {
      if (err) {
        console.error('Error saving metrics to database:', err);
      }

      // Check for alerts
      checkForAlerts(systemId, metrics);
    }
  );
};

// Check for alerts
const checkForAlerts = (systemId, metrics) => {
  // CPU alert
  if (metrics.cpuUsage >= 90) {
    createAlert(systemId, 'Critical CPU Usage', `CPU usage is at ${metrics.cpuUsage}%`, 'critical');
  } else if (metrics.cpuUsage >= 80) {
    createAlert(systemId, 'High CPU Usage', `CPU usage is at ${metrics.cpuUsage}%`, 'warning');
  }

  // Memory alert
  if (metrics.memoryUsage >= 90) {
    createAlert(systemId, 'Critical Memory Usage', `Memory usage is at ${metrics.memoryUsage}%`, 'critical');
  } else if (metrics.memoryUsage >= 80) {
    createAlert(systemId, 'High Memory Usage', `Memory usage is at ${metrics.memoryUsage}%`, 'warning');
  }

  // Disk alert
  if (metrics.diskUsage >= 90) {
    createAlert(systemId, 'Critical Disk Usage', `Disk usage is at ${metrics.diskUsage}%`, 'critical');
  } else if (metrics.diskUsage >= 80) {
    createAlert(systemId, 'High Disk Usage', `Disk usage is at ${metrics.diskUsage}%`, 'warning');
  }
};

// Create an alert
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

// Start periodic updates for all systems
const startPeriodicUpdates = () => {
  // No automatic updates - only manual refresh will be used
  console.log('Automatic updates disabled - using manual refresh only');

  // Send initial data to clients when they connect
  // This is handled by the subscription handlers
};

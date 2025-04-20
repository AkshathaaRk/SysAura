// Mock WebSocket service for development
class WebSocketService {
  private listeners: Map<string, Set<(data: any) => void>> = new Map();
  private isConnected: boolean = false;
  private mockDataInterval: NodeJS.Timeout | null = null;

  // Connect to WebSocket server (mock)
  connect() {
    if (this.isConnected) {
      return;
    }

    console.log('Mock WebSocket connected');
    this.isConnected = true;

    // Generate mock data every 60 seconds
    this.mockDataInterval = setInterval(() => {
      this.generateMockData();
    }, 60000); // 1 minute interval
  }

  // Generate mock system metrics data
  private generateMockData() {
    if (!this.isConnected) return;

    const mockMetrics = {
      type: 'metrics',
      systemId: 'local',
      timestamp: new Date().toISOString(),
      data: {
        cpu: {
          usage: Math.floor(Math.random() * 100),
          cores: 4,
          model: 'Mock CPU Model'
        },
        memory: {
          total: 16384, // 16 GB
          used: Math.floor(Math.random() * 16384),
          free: Math.floor(Math.random() * 8192)
        },
        disk: {
          total: 512000, // 500 GB
          used: Math.floor(Math.random() * 512000),
          free: Math.floor(Math.random() * 256000)
        },
        network: {
          interfaces: ['eth0', 'wlan0'],
          incoming: Math.random() * 10,
          outgoing: Math.random() * 5
        }
      }
    };

    // Notify listeners
    this.handleMessage(mockMetrics);

    // Generate random alerts occasionally
    if (Math.random() < 0.3) { // 30% chance
      const alertTypes = ['cpu', 'memory', 'disk', 'network'];
      const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
      const severity = Math.random() < 0.3 ? 'critical' : 'warning';

      const mockAlert = {
        type: 'alert',
        systemId: 'local',
        timestamp: new Date().toISOString(),
        data: {
          id: `mock-alert-${Date.now()}`,
          title: `${severity === 'critical' ? 'Critical' : 'High'} ${alertType.toUpperCase()} Usage`,
          message: `${alertType.toUpperCase()} usage has exceeded ${severity === 'critical' ? '95%' : '90%'}`,
          severity,
          category: alertType,
          source: 'Local System',
          value: severity === 'critical' ? 95 + Math.random() * 5 : 90 + Math.random() * 5,
          threshold: severity === 'critical' ? 95 : 90
        }
      };

      // Notify listeners
      this.handleMessage(mockAlert);
    }
  }

  // Subscribe to system metrics (mock)
  subscribeToSystem(systemId: string) {
    console.log(`Mock subscribed to system: ${systemId}`);
    // Generate initial data
    setTimeout(() => this.generateMockData(), 1000);
  }

  // Subscribe to local system metrics
  subscribeToLocalSystem() {
    return this.subscribeToSystem('local');
  }

  // Unsubscribe from system metrics (mock)
  unsubscribeFromSystem(systemId: string) {
    console.log(`Mock unsubscribed from system: ${systemId}`);
  }

  // Unsubscribe from local system metrics
  unsubscribeFromLocalSystem() {
    return this.unsubscribeFromSystem('local');
  }

  // Add event listener
  addEventListener(type: string, callback: (data: any) => void) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }

    this.listeners.get(type)?.add(callback);
  }

  // Remove event listener
  removeEventListener(type: string, callback: (data: any) => void) {
    if (!this.listeners.has(type)) {
      return;
    }

    this.listeners.get(type)?.delete(callback);
  }

  // Handle incoming messages (mock)
  private handleMessage(message: any) {
    // Notify all listeners for this message type
    const listeners = this.listeners.get(message.type);
    if (listeners) {
      listeners.forEach(callback => {
        callback(message);
      });
    }

    // Notify all listeners for 'all' events
    const allListeners = this.listeners.get('all');
    if (allListeners) {
      allListeners.forEach(callback => {
        callback(message);
      });
    }
  }

  // Disconnect WebSocket (mock)
  disconnect() {
    console.log('Mock WebSocket disconnected');

    if (this.mockDataInterval) {
      clearInterval(this.mockDataInterval);
      this.mockDataInterval = null;
    }

    this.isConnected = false;
  }
}

// Create singleton instance
const websocketService = new WebSocketService();

export default websocketService;

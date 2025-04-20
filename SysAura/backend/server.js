import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { WebSocketServer } from 'ws';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Routes
import authRoutes from './routes/auth.js';
import metricsRoutes from './routes/metrics.js';
import systemsRoutes from './routes/systems.js';
import alertsRoutes from './routes/alerts.js';
import usersRoutes from './routes/users.js';

// Database
import { initializeDatabase } from './db/database.js';

// WebSocket handlers
import { setupWebSocketServer } from './websocket/wsServer.js';

// Configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5002; // Changed to 5002 to avoid conflict

// Create HTTP server
const server = http.createServer(app);

// WebSocket server setup
const wss = new WebSocketServer({ server });
setupWebSocketServer(wss);

// Middleware
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));
app.use(express.json());
app.use(morgan('dev'));

// Initialize database
initializeDatabase();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/metrics', metricsRoutes);
app.use('/api/systems', systemsRoutes);
app.use('/api/alerts', alertsRoutes);
app.use('/api/users', usersRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../dist', 'index.html'));
  });
}

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle server shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Shutting down server...');
  process.exit(0);
});

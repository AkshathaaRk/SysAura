# SysAuraft Backend

This is the backend server for the SysAuraft system monitoring application.

## Features

- Real-time system monitoring (CPU, memory, disk, network)
- User authentication and authorization
- System management
- Alerts and notifications
- WebSocket support for real-time updates

## Installation

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file with the following variables:
   ```
   PORT=5000
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   ```

3. Start the server:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Metrics
- `GET /api/metrics/current` - Get current system metrics
- `GET /api/metrics/history/:systemId` - Get metrics history for a system
- `POST /api/metrics/:systemId` - Save system metrics

### Systems
- `GET /api/systems` - Get all systems (admin only)
- `GET /api/systems/user` - Get systems for current user
- `GET /api/systems/:id` - Get a single system
- `POST /api/systems` - Create a new system
- `PUT /api/systems/:id` - Update a system
- `DELETE /api/systems/:id` - Delete a system

### Alerts
- `GET /api/alerts` - Get all alerts
- `GET /api/alerts/system/:systemId` - Get alerts for a specific system
- `POST /api/alerts` - Create a new alert
- `PATCH /api/alerts/:id` - Update alert status

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/password` - Change password
- `PUT /api/users/email/:id` - Change email
- `PUT /api/users/role/:id` - Change user role (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

## WebSocket API

Connect to the WebSocket server at `ws://localhost:5000` and send/receive JSON messages.

### Client to Server Messages
- Authentication: `{ type: "auth", token: "jwt_token" }`
- Subscribe to system: `{ type: "subscribe", systemId: "1" }`
- Unsubscribe from system: `{ type: "unsubscribe", systemId: "1" }`

### Server to Client Messages
- Authentication success: `{ type: "auth_success", userId: 1, role: "admin" }`
- Authentication error: `{ type: "auth_error", message: "Invalid token" }`
- Subscription confirmation: `{ type: "subscribed", systemId: "1" }`
- Unsubscription confirmation: `{ type: "unsubscribed", systemId: "1" }`
- Metrics update: `{ type: "metrics", systemId: "1", data: {...}, timestamp: "..." }`
- Error: `{ type: "error", message: "Error message" }`

# SysAura - Real-Time System And Server Monitoring Application

SysAura is a real-time system and server(still working on server) monitoring application that provides detailed insights into CPU, memory, disk, and network usage. It features a modern React frontend and a robust Node.js backend with WebSocket support for real-time updates.

## Features

- Real-time monitoring of system metrics (CPU, memory, disk, network)
- User authentication and authorization with role-based access (admin and user)
- System management and monitoring
- Server managementand monitoring
- Alerts and notifications for system events
- Responsive UI with dark mode support
- WebSocket support for live data updates

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS
- Backend: Node.js, Express, WebSocket, SQLite
- Authentication: JWT
- Real-time communication: WebSocket

## Project Structure

- `/src` - React frontend source code
- `/backend` - Node.js backend server
- Root contains configuration files for frontend and backend

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/sysauraft.git
   cd sysauraft
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

4. Create a `.env` file in the `backend` directory with the following variables:
   ```
   PORT=5000
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   ```

## Running the Application

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend development server:
   ```bash
   # In the project root
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## Backend API Overview

The backend provides RESTful API endpoints for authentication, system metrics, system management, alerts, and user management.

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

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

The application uses WebSockets for real-time updates. Connect to the WebSocket server at `ws://localhost:5000` and send/receive JSON messages.

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

## Default Login Credentials

- Admin:
  - Email: admin@sysauraft.com
  - Password: admin123

## Authors

- **Abhishek (https://github.com/Abhishekmystic-KS/)**
- **Akshatha (https://github.com/AkshathaaRk/)**

## License

This project is licensed under the MIT License.

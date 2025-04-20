import express from 'express';
import { auth, adminAuth } from '../middleware/auth.js';
import db from '../db/database.js';

const router = express.Router();

// Get all alerts (admin can see all, users see only their systems' alerts)
router.get('/', auth, (req, res) => {
  const { status = 'all', limit = 50, offset = 0 } = req.query;
  
  let query = `
    SELECT a.*, s.name as systemName 
    FROM alerts a
    JOIN systems s ON a.systemId = s.id
  `;
  
  const queryParams = [];
  
  // Filter by status if specified
  if (status !== 'all') {
    query += ' WHERE a.status = ?';
    queryParams.push(status);
  }
  
  // Filter by user if not admin
  if (req.user.role !== 'admin') {
    query += queryParams.length ? ' AND' : ' WHERE';
    query += ' s.userId = ?';
    queryParams.push(req.user.id);
  }
  
  // Add ordering and pagination
  query += ' ORDER BY a.timestamp DESC LIMIT ? OFFSET ?';
  queryParams.push(parseInt(limit), parseInt(offset));
  
  db.all(query, queryParams, (err, alerts) => {
    if (err) {
      console.error('Error getting alerts:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    
    res.json(alerts);
  });
});

// Get alerts for a specific system
router.get('/system/:systemId', auth, (req, res) => {
  const { systemId } = req.params;
  const { status = 'all', limit = 20, offset = 0 } = req.query;
  
  // Check if system exists and user has access
  db.get('SELECT * FROM systems WHERE id = ?', [systemId], (err, system) => {
    if (err) {
      console.error('Error checking system:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    
    if (!system) {
      return res.status(404).json({ message: 'System not found' });
    }
    
    // Check if user has access to this system
    if (req.user.role !== 'admin' && system.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Get alerts for this system
    let query = 'SELECT * FROM alerts WHERE systemId = ?';
    const queryParams = [systemId];
    
    // Filter by status if specified
    if (status !== 'all') {
      query += ' AND status = ?';
      queryParams.push(status);
    }
    
    // Add ordering and pagination
    query += ' ORDER BY timestamp DESC LIMIT ? OFFSET ?';
    queryParams.push(parseInt(limit), parseInt(offset));
    
    db.all(query, queryParams, (err, alerts) => {
      if (err) {
        console.error('Error getting system alerts:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      
      res.json(alerts);
    });
  });
});

// Create a new alert
router.post('/', auth, (req, res) => {
  const { systemId, title, message, severity } = req.body;
  
  // Validate input
  if (!systemId || !title || !message || !severity) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  
  // Check if system exists and user has access
  db.get('SELECT * FROM systems WHERE id = ?', [systemId], (err, system) => {
    if (err) {
      console.error('Error checking system:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    
    if (!system) {
      return res.status(404).json({ message: 'System not found' });
    }
    
    // Check if user has access to this system
    if (req.user.role !== 'admin' && system.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Create alert
    db.run(
      'INSERT INTO alerts (systemId, title, message, severity) VALUES (?, ?, ?, ?)',
      [systemId, title, message, severity],
      function(err) {
        if (err) {
          console.error('Error creating alert:', err);
          return res.status(500).json({ message: 'Server error' });
        }
        
        res.status(201).json({
          id: this.lastID,
          systemId,
          title,
          message,
          severity,
          status: 'active',
          timestamp: new Date().toISOString()
        });
      }
    );
  });
});

// Update alert status (resolve/acknowledge)
router.patch('/:id', auth, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  // Validate input
  if (!status || !['active', 'resolved', 'acknowledged'].includes(status)) {
    return res.status(400).json({ message: 'Valid status is required' });
  }
  
  // Get alert and check access
  db.get(
    `SELECT a.*, s.userId 
     FROM alerts a
     JOIN systems s ON a.systemId = s.id
     WHERE a.id = ?`,
    [id],
    (err, alert) => {
      if (err) {
        console.error('Error checking alert:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      
      if (!alert) {
        return res.status(404).json({ message: 'Alert not found' });
      }
      
      // Check if user has access to this alert
      if (req.user.role !== 'admin' && alert.userId !== req.user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      // Update alert status
      db.run(
        'UPDATE alerts SET status = ? WHERE id = ?',
        [status, id],
        function(err) {
          if (err) {
            console.error('Error updating alert:', err);
            return res.status(500).json({ message: 'Server error' });
          }
          
          res.json({
            ...alert,
            status
          });
        }
      );
    }
  );
});

export default router;

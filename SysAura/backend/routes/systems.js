import express from 'express';
import { auth, adminAuth } from '../middleware/auth.js';
import db from '../db/database.js';

const router = express.Router();

// Get all systems (admin only)
router.get('/', adminAuth, (req, res) => {
  db.all('SELECT * FROM systems ORDER BY name', (err, systems) => {
    if (err) {
      console.error('Error getting systems:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    
    res.json(systems);
  });
});

// Get systems for current user
router.get('/user', auth, (req, res) => {
  db.all(
    'SELECT * FROM systems WHERE userId = ? ORDER BY name',
    [req.user.id],
    (err, systems) => {
      if (err) {
        console.error('Error getting user systems:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      
      res.json(systems);
    }
  );
});

// Get a single system
router.get('/:id', auth, (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM systems WHERE id = ?', [id], (err, system) => {
    if (err) {
      console.error('Error getting system:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    
    if (!system) {
      return res.status(404).json({ message: 'System not found' });
    }
    
    // Check if user has access to this system
    if (req.user.role !== 'admin' && system.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json(system);
  });
});

// Create a new system
router.post('/', auth, (req, res) => {
  const { name, ipAddress } = req.body;
  
  // Validate input
  if (!name) {
    return res.status(400).json({ message: 'System name is required' });
  }
  
  db.run(
    'INSERT INTO systems (name, ipAddress, userId, status) VALUES (?, ?, ?, ?)',
    [name, ipAddress || '', req.user.id, 'offline'],
    function(err) {
      if (err) {
        console.error('Error creating system:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      
      res.status(201).json({
        id: this.lastID,
        name,
        ipAddress: ipAddress || '',
        userId: req.user.id,
        status: 'offline'
      });
    }
  );
});

// Update a system
router.put('/:id', auth, (req, res) => {
  const { id } = req.params;
  const { name, ipAddress, status } = req.body;
  
  // Validate input
  if (!name) {
    return res.status(400).json({ message: 'System name is required' });
  }
  
  // Check if system exists and user has access
  db.get('SELECT * FROM systems WHERE id = ?', [id], (err, system) => {
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
    
    // Update system
    db.run(
      'UPDATE systems SET name = ?, ipAddress = ?, status = ? WHERE id = ?',
      [name, ipAddress || system.ipAddress, status || system.status, id],
      function(err) {
        if (err) {
          console.error('Error updating system:', err);
          return res.status(500).json({ message: 'Server error' });
        }
        
        res.json({
          id: parseInt(id),
          name,
          ipAddress: ipAddress || system.ipAddress,
          status: status || system.status,
          userId: system.userId
        });
      }
    );
  });
});

// Delete a system
router.delete('/:id', auth, (req, res) => {
  const { id } = req.params;
  
  // Check if system exists and user has access
  db.get('SELECT * FROM systems WHERE id = ?', [id], (err, system) => {
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
    
    // Delete system
    db.run('DELETE FROM systems WHERE id = ?', [id], function(err) {
      if (err) {
        console.error('Error deleting system:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      
      // Delete related metrics and alerts
      db.run('DELETE FROM metrics WHERE systemId = ?', [id]);
      db.run('DELETE FROM alerts WHERE systemId = ?', [id]);
      
      res.json({ message: 'System deleted' });
    });
  });
});

export default router;

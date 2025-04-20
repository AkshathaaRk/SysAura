import express from 'express';
import bcrypt from 'bcryptjs';
import { auth, adminAuth } from '../middleware/auth.js';
import db from '../db/database.js';

const router = express.Router();

// Get all users (admin only)
router.get('/', adminAuth, (req, res) => {
  db.all(
    'SELECT id, email, firstName, lastName, phoneNumber, role, createdAt FROM users ORDER BY email',
    (err, users) => {
      if (err) {
        console.error('Error getting users:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      
      res.json(users);
    }
  );
});

// Get user profile
router.get('/profile', auth, (req, res) => {
  db.get(
    'SELECT id, email, firstName, lastName, phoneNumber, role, createdAt FROM users WHERE id = ?',
    [req.user.id],
    (err, user) => {
      if (err) {
        console.error('Error getting user profile:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json(user);
    }
  );
});

// Update user profile
router.put('/profile', auth, (req, res) => {
  const { firstName, lastName, phoneNumber } = req.body;
  
  db.run(
    'UPDATE users SET firstName = ?, lastName = ?, phoneNumber = ? WHERE id = ?',
    [firstName || '', lastName || '', phoneNumber || '', req.user.id],
    function(err) {
      if (err) {
        console.error('Error updating user profile:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      
      res.json({
        id: req.user.id,
        email: req.user.email,
        firstName: firstName || '',
        lastName: lastName || '',
        phoneNumber: phoneNumber || '',
        role: req.user.role
      });
    }
  );
});

// Change password
router.put('/password', auth, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  // Validate input
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current and new passwords are required' });
  }
  
  // Get user with password
  db.get('SELECT * FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err) {
      console.error('Error getting user:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check current password
    const isMatch = bcrypt.compareSync(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    // Hash new password
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    
    // Update password
    db.run(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, req.user.id],
      function(err) {
        if (err) {
          console.error('Error updating password:', err);
          return res.status(500).json({ message: 'Server error' });
        }
        
        res.json({ message: 'Password updated successfully' });
      }
    );
  });
});

// Change email (admin only for other users)
router.put('/email/:id', auth, (req, res) => {
  const { id } = req.params;
  const { email } = req.body;
  
  // Validate input
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }
  
  // Check if user is admin or changing their own email
  if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
    return res.status(403).json({ message: 'Access denied' });
  }
  
  // Check if email is already in use
  db.get('SELECT * FROM users WHERE email = ? AND id != ?', [email, id], (err, existingUser) => {
    if (err) {
      console.error('Error checking email:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already in use' });
    }
    
    // Update email
    db.run(
      'UPDATE users SET email = ? WHERE id = ?',
      [email, id],
      function(err) {
        if (err) {
          console.error('Error updating email:', err);
          return res.status(500).json({ message: 'Server error' });
        }
        
        res.json({ message: 'Email updated successfully' });
      }
    );
  });
});

// Change user role (admin only)
router.put('/role/:id', adminAuth, (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  
  // Validate input
  if (!role || !['admin', 'user'].includes(role)) {
    return res.status(400).json({ message: 'Valid role is required' });
  }
  
  // Update role
  db.run(
    'UPDATE users SET role = ? WHERE id = ?',
    [role, id],
    function(err) {
      if (err) {
        console.error('Error updating role:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json({ message: 'User role updated successfully' });
    }
  );
});

// Delete user (admin only)
router.delete('/:id', adminAuth, (req, res) => {
  const { id } = req.params;
  
  // Prevent deleting self
  if (parseInt(id) === req.user.id) {
    return res.status(400).json({ message: 'Cannot delete your own account' });
  }
  
  // Delete user
  db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
    if (err) {
      console.error('Error deleting user:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update systems to have null userId
    db.run('UPDATE systems SET userId = NULL WHERE userId = ?', [id]);
    
    res.json({ message: 'User deleted successfully' });
  });
});

export default router;

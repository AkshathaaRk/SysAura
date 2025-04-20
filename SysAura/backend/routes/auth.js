import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db/database.js';

const router = express.Router();

// Register a new user
router.post('/register', (req, res) => {
  const { email, password, firstName, lastName, phoneNumber } = req.body;
  
  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  
  // Check if user already exists
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
    
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);
    
    // Create new user (default role is 'user')
    db.run(
      'INSERT INTO users (email, password, firstName, lastName, phoneNumber, role) VALUES (?, ?, ?, ?, ?, ?)',
      [email, hashedPassword, firstName || '', lastName || '', phoneNumber || '', 'user'],
      function(err) {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Server error' });
        }
        
        // Generate JWT token
        const token = jwt.sign(
          { id: this.lastID, email, role: 'user' },
          process.env.JWT_SECRET || 'your_jwt_secret',
          { expiresIn: '1d' }
        );
        
        res.status(201).json({
          token,
          user: {
            id: this.lastID,
            email,
            firstName: firstName || '',
            lastName: lastName || '',
            role: 'user'
          }
        });
      }
    );
  });
});

// Login user
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  
  // Find user
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1d' }
    );
    
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  });
});

// Get current user
router.get('/me', (req, res) => {
  // Get token from header
  const token = req.header('x-auth-token');
  
  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    
    // Find user
    db.get('SELECT id, email, firstName, lastName, role FROM users WHERE id = ?', [decoded.id], (err, user) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
      }
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json(user);
    });
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
});

export default router;

import jwt from 'jsonwebtoken';

export const auth = (req, res, next) => {
  // TEMPORARY: Skip authentication for development
  // Set a mock user for development
  req.user = {
    id: 1,
    email: 'admin@sysauraft.com',
    role: 'admin'
  };
  return next();

  // The code below is commented out for development
  /*
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');

    // Add user from payload
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
  */
};

export const adminAuth = (req, res, next) => {
  // TEMPORARY: Skip admin authentication for development
  // Set a mock admin user for development
  req.user = {
    id: 1,
    email: 'admin@sysauraft.com',
    role: 'admin'
  };
  return next();

  // The code below is commented out for development
  /*
  auth(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
    next();
  });
  */
};

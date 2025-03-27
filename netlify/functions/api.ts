import express, { Request, Response, NextFunction } from 'express';
import { Handler } from '@netlify/functions';
import serverless from 'serverless-http';
import { registerRoutes } from '../../server/routes';
import { storage } from '../../server/storage';
import jwt from 'jsonwebtoken';
import { log } from '../../server/vite';
import { loginUserSchema } from '../../shared/schema';
import { db } from '../../server/db';

// Set environment to production for Netlify Functions
process.env.NODE_ENV = 'production';

const app = express();

// Middleware
app.use(express.json());

// Enable CORS for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Register all routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Authentication routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const parsedBody = loginUserSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({ message: 'Invalid login data' });
    }

    const user = await storage.validateUser(parsedBody.data);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    log('Error during login: ' + error, 'error');
    return res.status(500).json({ message: 'Server error during login' });
  }
});

registerRoutes(app);

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Wrap the Express app with serverless
const serverlessHandler = serverless(app);

// Export the handler function for Netlify Functions
export const handler = async (event: any, context: any) => {
  // Make sure we don't process the OPTIONS method for the function
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
      },
      body: ''
    };
  }

  // Call the serverless handler and handle the response
  return await serverlessHandler(event, context);
};
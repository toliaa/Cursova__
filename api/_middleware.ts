// Middleware for routing in Vercel serverless environment
import express from 'express';
import path from 'path';

// Middleware to handle client-side routing
export const clientRoutingMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // Skip API routes
  if (req.path.startsWith('/api/')) {
    return next();
  }

  // If the request is for a file with an extension (like .js, .css, .png, etc.) let it pass through
  if (path.extname(req.path) !== '') {
    return next();
  }

  // For all other cases, serve the index.html file to let the client-side router handle the routing
  if (process.env.NODE_ENV === 'production') {
    const publicPath = path.join(process.cwd(), 'dist', 'public');
    return res.sendFile(path.join(publicPath, 'index.html'));
  }
  
  return next();
}
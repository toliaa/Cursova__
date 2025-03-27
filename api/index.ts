// Vercel API handler for serverless functions
import express from 'express';
import { json, urlencoded } from 'express';
import { registerRoutes } from '../server/routes';
import { log } from '../server/vite';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { storage } from '../server/storage';
import { serveStatic } from '../server/vite';

const app = express();

// Middleware
app.use(json());
app.use(urlencoded({ extended: true }));

// Setup session
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || 'dev-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
  }
});

app.use(sessionMiddleware);

// Setup passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await storage.validateUser({ username, password });
      if (!user) {
        return done(null, false, { message: 'Invalid credentials' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await storage.getUser(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Register API routes
registerRoutes(app);

// Error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  log(`Error: ${err.message}`, 'error');
  
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal Server Error' 
    : err.message;
  
  res.status(statusCode).json({
    error: {
      message,
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    }
  });
});

// Export for Vercel
export default app;
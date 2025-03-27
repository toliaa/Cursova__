import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertNewsSchema, insertGalleryItemSchema, insertSliderItemSchema, insertUserSchema, loginUserSchema } from "@shared/schema";
import jwt from 'jsonwebtoken';

// Secret key for JWT token signing
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Type definition for authenticated user request
interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
}

// Middleware to verify JWT token
const verifyToken = (req: AuthRequest, res: Response, next: () => void) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded as {
      id: number;
      username: string;
      email: string;
      role: string;
    };
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // User registration
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if the user already exists
      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      // Create the user
      const user = await storage.createUser(userData);
      
      // Generate token
      const token = jwt.sign(
        { 
          id: user.id, 
          username: user.username, 
          email: user.email, 
          role: user.role 
        }, 
        JWT_SECRET, 
        { expiresIn: "24h" }
      );
      
      // Return user info and token
      res.status(201).json({
        message: "User registered successfully",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        token
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      console.error("Registration error:", error);
      res.status(500).json({ message: "Failed to register user" });
    }
  });
  
  // User login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const credentials = loginUserSchema.parse(req.body);
      
      // Validate user credentials
      const user = await storage.validateUser(credentials);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // Generate token
      const token = jwt.sign(
        { 
          id: user.id, 
          username: user.username, 
          email: user.email, 
          role: user.role 
        }, 
        JWT_SECRET, 
        { expiresIn: "24h" }
      );
      
      // Return user info and token
      res.json({
        message: "Login successful",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        token
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid login data", errors: error.errors });
      }
      console.error("Login error:", error);
      res.status(500).json({ message: "Failed to login" });
    }
  });
  
  // Get current user profile
  app.get("/api/auth/profile", verifyToken, (req: AuthRequest, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      res.json({ 
        user: req.user
      });
    } catch (error) {
      console.error("Profile error:", error);
      res.status(500).json({ message: "Failed to get user profile" });
    }
  });
  // Get all news items
  app.get("/api/news", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      let news;
      
      if (category) {
        news = await storage.getNewsByCategory(category);
      } else {
        news = await storage.getAllNews();
      }
      
      res.json(news);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch news" });
    }
  });
  
  // Get featured news
  app.get("/api/news/featured", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string || "4", 10);
      const featuredNews = await storage.getFeaturedNews(limit);
      res.json(featuredNews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured news" });
    }
  });
  
  // Get news by ID
  app.get("/api/news/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const news = await storage.getNewsById(id);
      
      if (!news) {
        return res.status(404).json({ message: "News not found" });
      }
      
      res.json(news);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch news" });
    }
  });
  
  // Create news item (protected route)
  app.post("/api/news", verifyToken, async (req: AuthRequest, res) => {
    try {
      const newsData = insertNewsSchema.parse(req.body);
      const createdNews = await storage.createNews(newsData);
      res.status(201).json(createdNews);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid news data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create news" });
    }
  });
  
  // Get all gallery items
  app.get("/api/gallery", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      let galleryItems;
      
      if (category) {
        galleryItems = await storage.getGalleryItemsByCategory(category);
      } else {
        galleryItems = await storage.getAllGalleryItems();
      }
      
      res.json(galleryItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch gallery items" });
    }
  });
  
  // Get gallery item by ID
  app.get("/api/gallery/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const galleryItem = await storage.getGalleryItemById(id);
      
      if (!galleryItem) {
        return res.status(404).json({ message: "Gallery item not found" });
      }
      
      res.json(galleryItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch gallery item" });
    }
  });
  
  // Create gallery item (protected route)
  app.post("/api/gallery", verifyToken, async (req: AuthRequest, res) => {
    try {
      const galleryData = insertGalleryItemSchema.parse(req.body);
      const createdItem = await storage.createGalleryItem(galleryData);
      res.status(201).json(createdItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid gallery item data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create gallery item" });
    }
  });
  
  // Get all slider items
  app.get("/api/slider", async (req, res) => {
    try {
      const sliderItems = await storage.getAllSliderItems();
      res.json(sliderItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch slider items" });
    }
  });
  
  // Get slider item by ID
  app.get("/api/slider/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const sliderItem = await storage.getSliderItemById(id);
      
      if (!sliderItem) {
        return res.status(404).json({ message: "Slider item not found" });
      }
      
      res.json(sliderItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch slider item" });
    }
  });
  
  // Create slider item (protected route)
  app.post("/api/slider", verifyToken, async (req: AuthRequest, res) => {
    try {
      const sliderData = insertSliderItemSchema.parse(req.body);
      const createdItem = await storage.createSliderItem(sliderData);
      res.status(201).json(createdItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid slider item data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create slider item" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

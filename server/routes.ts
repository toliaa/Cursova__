import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertNewsSchema, insertGalleryItemSchema, insertSliderItemSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
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
  
  // Create news item
  app.post("/api/news", async (req, res) => {
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
  
  // Create gallery item
  app.post("/api/gallery", async (req, res) => {
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
  
  // Create slider item
  app.post("/api/slider", async (req, res) => {
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

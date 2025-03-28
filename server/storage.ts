import { 
  users, type User, type InsertUser, type LoginUser,
  news, type News, type InsertNews,
  galleryItems, type GalleryItem, type InsertGalleryItem,
  sliderItems, type SliderItem, type InsertSliderItem
} from "@shared/schema";
import { getDb } from "./db";
import { eq } from "drizzle-orm";
import bcrypt from 'bcryptjs';

// Define the storage interface with CRUD methods
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  validateUser(credentials: LoginUser): Promise<User | null>;
  getAllUsers(): Promise<User[]>;
  deleteUser(id: number): Promise<boolean>;
  
  // News methods
  getAllNews(): Promise<News[]>;
  getNewsByCategory(category: string): Promise<News[]>;
  getFeaturedNews(limit: number): Promise<News[]>;
  getNewsById(id: number): Promise<News | undefined>;
  createNews(news: InsertNews): Promise<News>;
  deleteNews(id: number): Promise<boolean>;
  
  // Gallery methods
  getAllGalleryItems(): Promise<GalleryItem[]>;
  getGalleryItemsByCategory(category: string): Promise<GalleryItem[]>;
  getGalleryItemById(id: number): Promise<GalleryItem | undefined>;
  createGalleryItem(item: InsertGalleryItem): Promise<GalleryItem>;
  
  // Slider methods
  getAllSliderItems(): Promise<SliderItem[]>;
  getSliderItemById(id: number): Promise<SliderItem | undefined>;
  createSliderItem(item: InsertSliderItem): Promise<SliderItem>;
}

// Database storage implementation
export class DbStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const db = getDb();
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const db = getDb();
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const db = getDb();
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }
  
  async createUser(user: InsertUser): Promise<User> {
    const db = getDb();
    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(user.password, 10);
    
    const result = await db.insert(users).values({
      ...user,
      password: hashedPassword
    }).returning();
    
    return result[0];
  }
  
  async validateUser(credentials: LoginUser): Promise<User | null> {
    const user = await this.getUserByUsername(credentials.username);
    
    if (!user) {
      return null;
    }
    
    const isValidPassword = await bcrypt.compare(credentials.password, user.password);
    
    if (!isValidPassword) {
      return null;
    }
    
    return user;
  }
  
  async getAllUsers(): Promise<User[]> {
    const db = getDb();
    const result = await db.select().from(users);
    return result;
  }
  
  async deleteUser(id: number): Promise<boolean> {
    const db = getDb();
    const result = await db.delete(users).where(eq(users.id, id)).returning();
    return result.length > 0;
  }
  
  async deleteNews(id: number): Promise<boolean> {
    const db = getDb();
    const result = await db.delete(news).where(eq(news.id, id)).returning();
    return result.length > 0;
  }
  
  // Implement the rest of the methods for database storage
  async getAllNews(): Promise<News[]> {
    const db = getDb();
    const result = await db.select().from(news).orderBy(news.date);
    return result;
  }
  
  async getNewsByCategory(category: string): Promise<News[]> {
    const db = getDb();
    const result = await db.select().from(news).where(eq(news.category, category)).orderBy(news.date);
    return result;
  }
  
  async getFeaturedNews(limit: number): Promise<News[]> {
    const db = getDb();
    const result = await db.select().from(news).orderBy(news.date).limit(limit);
    return result;
  }
  
  async getNewsById(id: number): Promise<News | undefined> {
    const db = getDb();
    const result = await db.select().from(news).where(eq(news.id, id));
    return result[0];
  }
  
  async createNews(newsItem: InsertNews): Promise<News> {
    const db = getDb();
    const result = await db.insert(news).values(newsItem).returning();
    return result[0];
  }
  
  async getAllGalleryItems(): Promise<GalleryItem[]> {
    const db = getDb();
    const result = await db.select().from(galleryItems);
    return result;
  }
  
  async getGalleryItemsByCategory(category: string): Promise<GalleryItem[]> {
    const db = getDb();
    const result = await db.select().from(galleryItems).where(eq(galleryItems.category, category));
    return result;
  }
  
  async getGalleryItemById(id: number): Promise<GalleryItem | undefined> {
    const db = getDb();
    const result = await db.select().from(galleryItems).where(eq(galleryItems.id, id));
    return result[0];
  }
  
  async createGalleryItem(item: InsertGalleryItem): Promise<GalleryItem> {
    const db = getDb();
    const result = await db.insert(galleryItems).values(item).returning();
    return result[0];
  }
  
  async getAllSliderItems(): Promise<SliderItem[]> {
    const db = getDb();
    const result = await db.select().from(sliderItems);
    return result;
  }
  
  async getSliderItemById(id: number): Promise<SliderItem | undefined> {
    const db = getDb();
    const result = await db.select().from(sliderItems).where(eq(sliderItems.id, id));
    return result[0];
  }
  
  async createSliderItem(item: InsertSliderItem): Promise<SliderItem> {
    const db = getDb();
    const result = await db.insert(sliderItems).values(item).returning();
    return result[0];
  }
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private newsItems: Map<number, News>;
  private gallery: Map<number, GalleryItem>;
  private slider: Map<number, SliderItem>;
  
  private userIdCounter: number;
  private newsIdCounter: number;
  private galleryIdCounter: number;
  private sliderIdCounter: number;

  constructor() {
    this.users = new Map();
    this.newsItems = new Map();
    this.gallery = new Map();
    this.slider = new Map();
    
    this.userIdCounter = 1;
    this.newsIdCounter = 1;
    this.galleryIdCounter = 1;
    this.sliderIdCounter = 1;
    
    // Initialize with sample data
    this.initializeData();
  }
  
  // New methods to implement the updated interface
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
  async deleteUser(id: number): Promise<boolean> {
    return this.users.delete(id);
  }
  
  async deleteNews(id: number): Promise<boolean> {
    return this.newsItems.delete(id);
  }
  
  async validateUser(credentials: LoginUser): Promise<User | null> {
    const user = await this.getUserByUsername(credentials.username);
    
    if (!user) {
      return null;
    }
    
    // For in-memory storage, we compare passwords directly for simplicity
    // In a real app, passwords should be hashed
    if (user.password !== credentials.password) {
      return null;
    }
    
    return user;
  }

  private initializeData() {
    // Add slider items
    this.createSliderItem({
      title: "Advancing Research Excellence",
      subtitle: "Discover groundbreaking research and academic innovations shaping our future.",
      imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
      ctaText: "Learn More",
      ctaLink: "#about",
      secondaryCtaText: "Latest Research",
      secondaryCtaLink: "#news"
    });
    
    this.createSliderItem({
      title: "Innovative Research Programs",
      subtitle: "Our cutting-edge facilities enable breakthrough discoveries in multiple disciplines.",
      imageUrl: "https://images.unsplash.com/photo-1613926053599-096398b9d842?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
      ctaText: "View Research",
      ctaLink: "#gallery",
      secondaryCtaText: "Connect With Us",
      secondaryCtaLink: "#contacts"
    });
    
    this.createSliderItem({
      title: "Collaborative Education",
      subtitle: "Join a community of scholars pushing the boundaries of knowledge and innovation.",
      imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
      ctaText: "Our Mission",
      ctaLink: "#about",
      secondaryCtaText: "Student Success",
      secondaryCtaLink: "#news"
    });
    
    // Add news items
    this.createNews({
      title: "New Quantum Computing Breakthrough",
      content: "Our researchers have achieved a significant milestone in quantum computing stability, paving the way for practical applications. This breakthrough represents years of dedicated work by our quantum research team and opens doors to new possibilities in secure communications, complex system modeling, and advanced algorithm design.",
      summary: "Our researchers have achieved a significant milestone in quantum computing stability, paving the way for practical applications.",
      imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
      category: "Science",
      date: new Date("2023-06-12")
    });
    
    this.createNews({
      title: "AI Model Predicts Climate Patterns",
      content: "A new machine learning model developed by our computer science department can predict climate patterns with 95% accuracy. This breakthrough could revolutionize climate science and help in disaster preparedness across vulnerable regions worldwide.",
      summary: "A new machine learning model developed by our computer science department can predict climate patterns with 95% accuracy.",
      imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
      category: "Technology",
      date: new Date("2023-06-08")
    });
    
    this.createNews({
      title: "Students Win International Competition",
      content: "Our engineering students took first place at the International Robotics Competition in Tokyo with their innovative design. The team's robot demonstrated exceptional precision and adaptability in completing complex tasks, outperforming teams from 45 other top universities worldwide.",
      summary: "Our engineering students took first place at the International Robotics Competition in Tokyo with their innovative design.",
      imageUrl: "https://images.unsplash.com/photo-1576086213369-97a306d36557?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
      category: "Student Life",
      date: new Date("2023-06-05")
    });
    
    this.createNews({
      title: "Research Published in Nature",
      content: "Professor Johnson's groundbreaking research on sustainable materials has been published in Nature, gaining international recognition. This publication represents a significant advancement in biodegradable polymers that could replace conventional plastics in many applications.",
      summary: "Professor Johnson's groundbreaking research on sustainable materials has been published in Nature, gaining international recognition.",
      imageUrl: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
      category: "Publications",
      date: new Date("2023-06-01")
    });
    
    this.createNews({
      title: "Annual Research Symposium Announced",
      content: "The university will host its annual research symposium on July 15-17, featuring keynote speakers from leading global institutions. The event will showcase cutting-edge research across multiple disciplines and provide networking opportunities for students and faculty.",
      summary: "The university will host its annual research symposium on July 15-17, featuring keynote speakers from leading global institutions.",
      imageUrl: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
      category: "Events",
      date: new Date("2023-05-28")
    });
    
    this.createNews({
      title: "New Treatment Method Discovered",
      content: "Our medical researchers have discovered a promising new treatment approach for autoimmune disorders with minimal side effects. Clinical trials are showing remarkable results with a 78% reduction in symptoms across test subjects while maintaining an excellent safety profile.",
      summary: "Our medical researchers have discovered a promising new treatment approach for autoimmune disorders with minimal side effects.",
      imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
      category: "Research",
      date: new Date("2023-05-24")
    });
    
    // Add gallery items
    this.createGalleryItem({
      title: "Advanced Chemical Analysis",
      imageUrl: "https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=400&q=80",
      category: "Science"
    });
    
    this.createGalleryItem({
      title: "Robotics Laboratory",
      imageUrl: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=400&q=80",
      category: "Technology"
    });
    
    this.createGalleryItem({
      title: "Stem Cell Research",
      imageUrl: "https://images.unsplash.com/photo-1579154204601-01588f351e67?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=400&q=80",
      category: "Medicine"
    });
    
    this.createGalleryItem({
      title: "Archaeological Findings",
      imageUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=400&q=80",
      category: "Humanities"
    });
    
    this.createGalleryItem({
      title: "Annual Research Symposium",
      imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=400&q=80",
      category: "Events"
    });
    
    this.createGalleryItem({
      title: "Particle Physics Experiment",
      imageUrl: "https://images.unsplash.com/photo-1576086213369-97a306d36557?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=400&q=80",
      category: "Science"
    });
    
    this.createGalleryItem({
      title: "AI Research Lab",
      imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=400&q=80",
      category: "Technology"
    });
    
    this.createGalleryItem({
      title: "Student Research Day",
      imageUrl: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=400&q=80",
      category: "Events"
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    // Add default values for required properties
    const newUser: User = { 
      id,
      username: user.username,
      email: user.email,
      password: user.password,
      firstName: user.firstName || null,
      lastName: user.lastName || null,
      role: "user",
      isActive: true,
      createdAt: new Date()
    };
    this.users.set(id, newUser);
    return newUser;
  }
  
  // News methods
  async getAllNews(): Promise<News[]> {
    return Array.from(this.newsItems.values()).sort((a, b) => b.date.getTime() - a.date.getTime());
  }
  
  async getNewsByCategory(category: string): Promise<News[]> {
    return Array.from(this.newsItems.values())
      .filter(news => news.category === category)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }
  
  async getFeaturedNews(limit: number): Promise<News[]> {
    return Array.from(this.newsItems.values())
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, limit);
  }
  
  async getNewsById(id: number): Promise<News | undefined> {
    return this.newsItems.get(id);
  }
  
  async createNews(newsItem: InsertNews): Promise<News> {
    const id = this.newsIdCounter++;
    const newNews: News = { ...newsItem, id };
    this.newsItems.set(id, newNews);
    return newNews;
  }
  
  // Gallery methods
  async getAllGalleryItems(): Promise<GalleryItem[]> {
    return Array.from(this.gallery.values());
  }
  
  async getGalleryItemsByCategory(category: string): Promise<GalleryItem[]> {
    return Array.from(this.gallery.values())
      .filter(item => item.category === category);
  }
  
  async getGalleryItemById(id: number): Promise<GalleryItem | undefined> {
    return this.gallery.get(id);
  }
  
  async createGalleryItem(item: InsertGalleryItem): Promise<GalleryItem> {
    const id = this.galleryIdCounter++;
    const newItem: GalleryItem = { ...item, id };
    this.gallery.set(id, newItem);
    return newItem;
  }
  
  // Slider methods
  async getAllSliderItems(): Promise<SliderItem[]> {
    return Array.from(this.slider.values());
  }
  
  async getSliderItemById(id: number): Promise<SliderItem | undefined> {
    return this.slider.get(id);
  }
  
  async createSliderItem(item: InsertSliderItem): Promise<SliderItem> {
    const id = this.sliderIdCounter++;
    const newItem: SliderItem = { 
      ...item, 
      id,
      secondaryCtaText: item.secondaryCtaText || null,
      secondaryCtaLink: item.secondaryCtaLink || null
    };
    this.slider.set(id, newItem);
    return newItem;
  }
}

// Use the database storage implementation 
export const storage = new DbStorage();

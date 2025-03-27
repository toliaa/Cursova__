import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  role: text("role").default("user"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true, 
  password: true,
  firstName: true,
  lastName: true,
  role: true,
});

export const loginUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const news = pgTable("news", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  summary: text("summary").notNull(),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(),
  date: timestamp("date").notNull(),
});

export const insertNewsSchema = createInsertSchema(news).omit({
  id: true,
});

export const galleryItems = pgTable("gallery_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(),
});

export const insertGalleryItemSchema = createInsertSchema(galleryItems).omit({
  id: true,
});

export const sliderItems = pgTable("slider_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull(),
  imageUrl: text("image_url").notNull(),
  ctaText: text("cta_text").notNull(),
  ctaLink: text("cta_link").notNull(),
  secondaryCtaText: text("secondary_cta_text"),
  secondaryCtaLink: text("secondary_cta_link"),
});

export const insertSliderItemSchema = createInsertSchema(sliderItems).omit({
  id: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;

export type News = typeof news.$inferSelect;
export type InsertNews = z.infer<typeof insertNewsSchema>;

export type GalleryItem = typeof galleryItems.$inferSelect;
export type InsertGalleryItem = z.infer<typeof insertGalleryItemSchema>;

export type SliderItem = typeof sliderItems.$inferSelect;
export type InsertSliderItem = z.infer<typeof insertSliderItemSchema>;

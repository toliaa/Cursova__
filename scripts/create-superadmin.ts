import bcrypt from 'bcryptjs';
import { db } from '../server/db';
import { users, type InsertUser } from '../shared/schema';
import { eq } from 'drizzle-orm';

console.log("===== Creating Superadmin Account =====");

async function createSuperAdmin() {
  try {
    const username = "superadmin";
    const email = "admin@example.com";
    const password = "admin123";  // You should change this password after first login
    
    // Check if username exists
    const existingUser = await db.select().from(users).where(eq(users.username, username));
    if (existingUser.length > 0) {
      console.log("Admin user already exists. Skipping creation.");
      return;
    }

    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Create admin user
    const newUser: InsertUser = {
      username,
      email,
      password: hashedPassword,
      firstName: "Super",
      lastName: "Admin",
      role: "admin"
    };

    const [createdUser] = await db.insert(users).values(newUser).returning();

    console.log("\n===== Admin User Created Successfully =====");
    console.log("ID:", createdUser.id);
    console.log("Username:", createdUser.username);
    console.log("Email:", createdUser.email);
    console.log("Password: admin123 (change this after first login)");
    console.log("Role:", createdUser.role);
    console.log("==========================================");
    
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    process.exit(0);
  }
}

createSuperAdmin();
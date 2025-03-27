import * as readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import bcrypt from 'bcryptjs';
import { db } from '../server/db';
import { users, type InsertUser } from '../shared/schema';

console.log("===== Admin User Creation =====");
console.log("Use this script to create an admin user");
console.log("==============================\n");

async function promptQuestion(question: string): Promise<string> {
  const rl = readline.createInterface({ input, output });
  const answer = await rl.question(question);
  rl.close();
  return answer;
}

async function createAdminUser() {
  try {
    const username = await promptQuestion("Enter username: ");
    if (!username) {
      console.error("Username cannot be empty");
      return;
    }

    // Check if username exists
    const existingUser = await db.select().from(users).where(users.username.equals(username));
    if (existingUser.length > 0) {
      console.error("Username already exists");
      return;
    }

    const email = await promptQuestion("Enter email: ");
    if (!email) {
      console.error("Email cannot be empty");
      return;
    }

    // Check if email exists
    const existingEmail = await db.select().from(users).where(users.email.equals(email));
    if (existingEmail.length > 0) {
      console.error("Email already exists");
      return;
    }

    const password = await promptQuestion("Enter password (min 6 characters): ");
    if (!password || password.length < 6) {
      console.error("Password must be at least 6 characters");
      return;
    }

    const firstName = await promptQuestion("Enter first name (optional): ");
    const lastName = await promptQuestion("Enter last name (optional): ");

    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Create admin user
    const newUser: InsertUser = {
      username,
      email,
      password: hashedPassword,
      firstName: firstName || null,
      lastName: lastName || null,
      role: "admin"
    };

    const [createdUser] = await db.insert(users).values(newUser).returning();

    console.log("\n===== Admin User Created =====");
    console.log("ID:", createdUser.id);
    console.log("Username:", createdUser.username);
    console.log("Email:", createdUser.email);
    console.log("Role:", createdUser.role);
    console.log("==============================");
    
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    process.exit(0);
  }
}

createAdminUser();
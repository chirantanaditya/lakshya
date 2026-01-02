import bcrypt from 'bcryptjs';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

const BCRYPT_ROUNDS = 12; // Increased from 10 for better security

/**
 * Hash password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

/**
 * Verify password against hash
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Create a new user account
 */
export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phoneNo?: string;
  education?: string;
}) {
  // Check if user already exists
  const existingUser = await getUserByEmail(data.email);
  if (existingUser) {
    throw new Error('User with this email already exists');
  }
  
  const hashedPassword = await hashPassword(data.password);
  const slug = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  
  const [user] = await db.insert(users).values({
    name: data.name,
    slug,
    email: data.email,
    password: hashedPassword,
    firstName: data.firstName,
    lastName: data.lastName,
    phoneNo: data.phoneNo,
    education: data.education,
  }).returning();
  
  // Remove password from returned user
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return user;
}

/**
 * Get user by ID
 * Throws error if database connection fails
 */
export async function getUserById(id: string) {
  try {
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    if (!user) {
      return null;
    }
    
    // Remove password from returned user
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error: any) {
    // Re-throw with more context
    console.error('Error fetching user by ID:', error);
    throw new Error(`Database connection failed: ${error.message}`);
  }
}

/**
 * Authenticate user with email and password
 * Returns user without password on success, null on failure
 */
export async function authenticateUser(email: string, password: string) {
  const user = await getUserByEmail(email);
  if (!user || !user.password) {
    return null;
  }
  
  // Verify password
  const isValid = await verifyPassword(password, user.password);
  if (!isValid) {
    return null;
  }
  
  // Update last login timestamp (if you add this field)
  // await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, user.id));
  
  // Remove password from returned user
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

/**
 * Update user password
 */
export async function updateUserPassword(userId: string, newPassword: string) {
  const hashedPassword = await hashPassword(newPassword);
  await db.update(users)
    .set({ password: hashedPassword, updatedAt: new Date() })
    .where(eq(users.id, userId));
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function validatePasswordStrength(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

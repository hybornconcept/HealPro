
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "./db/schema";
import { eq, ilike } from "drizzle-orm";

// Lightweight auth functions optimized for Cloudflare Workers
export class SimpleAuth {
  private db: PostgresJsDatabase<typeof schema>;

  constructor(db: PostgresJsDatabase<typeof schema>) {
    this.db = db;
  }

  // Helper: Hex string to Uint8Array
  private hexToBytes(hex: string): Uint8Array {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
    }
    return bytes;
  }

  // Helper: Uint8Array to Hex string
  private bytesToHex(bytes: Uint8Array): string {
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Hash password using Web Crypto API (PBKDF2)
  async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iterations = 10000;

    const keyMaterial = await crypto.subtle.importKey(
      "raw", data, { name: "PBKDF2" }, false, ["deriveBits"]
    );

    const derivedBits = await crypto.subtle.deriveBits(
      { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
      keyMaterial,
      256
    );

    const saltHex = this.bytesToHex(salt);
    const hashHex = this.bytesToHex(new Uint8Array(derivedBits));
    
    return `v2:${iterations}:${saltHex}:${hashHex}`;
  }

  // Verify password
  async verifyPassword(password: string, storedHash: string): Promise<boolean> {
    try {
      const parts = storedHash.split(":");
      if (parts[0] !== "v2") return false;

      const iterations = parseInt(parts[1]);
      const saltHex = parts[2];
      const originalHashHex = parts[3];
      const salt = this.hexToBytes(saltHex);

      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      
      const keyMaterial = await crypto.subtle.importKey(
        "raw", data, { name: "PBKDF2" }, false, ["deriveBits"]
      );

      const derivedBits = await crypto.subtle.deriveBits(
        { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
        keyMaterial,
        256
      );
      
      const computedHashHex = this.bytesToHex(new Uint8Array(derivedBits));
      return computedHashHex === originalHashHex;
    } catch (e) {
      console.error("Verify Error:", e);
      return false;
    }
  }

  // Generate simple session token
  generateSessionToken(): string {
     const bytes = crypto.getRandomValues(new Uint8Array(32));
     return btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  // Sign up new user
  async signUp(email: string, password: string, name?: string, userType?: string) {
    try {
      const normalizedEmail = email.toLowerCase();
      
      // Check if user exists
      const existing = await this.db
        .select()
        .from(schema.userTable)
        .where(eq(schema.userTable.email, normalizedEmail))
        .limit(1);

      if (existing.length > 0) {
        throw new Error("Email already registered");
      }

      // Create user
      const userId = crypto.randomUUID().replace(/-/g, ''); // Use UUID for ID
      const hashedPassword = await this.hashPassword(password);

      const [user] = await this.db
        .insert(schema.userTable)
        .values({
          id: userId,
          email: normalizedEmail,
          password: hashedPassword,
          name: name || normalizedEmail.split("@")[0],
          emailVerified: false,
          userType: userType || "patient",
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      // Create session
      const sessionToken = this.generateSessionToken();
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

      const [session] = await this.db
        .insert(schema.session)
        .values({
          id: crypto.randomUUID().replace(/-/g, ''),
          userId: user.id,
          token: sessionToken,
          expiresAt,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return { user, session, sessionToken };
    } catch (error: any) {
      console.error("[SIMPLE-AUTH] Sign Up Failed:", error);
      throw new Error(error.message || "Sign up failed");
    }
  }

  // Sign in existing user
  async signIn(email: string, password: string) {
    try {
      const normalizedEmail = email.toLowerCase();
      console.log(`[SIMPLE-AUTH] Attempting login for: ${normalizedEmail}`);

      // Find user (Case Insensitive)
      const [user] = await this.db
        .select()
        .from(schema.userTable)
        .where(ilike(schema.userTable.email, normalizedEmail))
        .limit(1);

      if (!user) {
        console.warn(`[SIMPLE-AUTH] User not found: ${normalizedEmail}`);
        throw new Error("Invalid credentials");
      }

      // Verify password
      const isValid = await this.verifyPassword(password, user.password);
      if (!isValid) {
        console.warn(`[SIMPLE-AUTH] Password verification failed for: ${user.email}`);
        throw new Error("Invalid credentials");
      }

      console.log(`[SIMPLE-AUTH] Login successful for: ${user.email}`);
      return this.createSessionForUser(user);
    } catch (error: any) {
      console.error("[SIMPLE-AUTH] Sign In Failed:", error);
      throw new Error(error.message || "Sign in failed");
    }
  }

  private async createSessionForUser(user: any) {
      // Create session
      const sessionToken = this.generateSessionToken();
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      const [session] = await this.db
        .insert(schema.session)
        .values({
          id: crypto.randomUUID().replace(/-/g, ''),
          userId: user.id,
          token: sessionToken,
          expiresAt,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return { user, session, sessionToken };
  }

  // Get session
  async getSession(sessionToken: string) {
    try {
      const [session] = await this.db
        .select()
        .from(schema.session)
        .where(eq(schema.session.token, sessionToken))
        .limit(1);

      if (!session || session.expiresAt < new Date()) {
        return null;
      }

      const [user] = await this.db
        .select()
        .from(schema.userTable)
        .where(eq(schema.userTable.id, session.userId))
        .limit(1);

      return { user, session };
    } catch {
      return null;
    }
  }

  // Sign out
  async signOut(sessionToken: string) {
    try {
      await this.db
        .delete(schema.session)
        .where(eq(schema.session.token, sessionToken));
      return true;
    } catch {
      return false;
    }
  }
}

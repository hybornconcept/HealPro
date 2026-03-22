import { Hono } from "hono";
import { factory } from "../lib/factory";
import { SimpleAuth } from "../lib/simple-auth";
import { setCookie, deleteCookie } from "hono/cookie";

// Helper functions defined first or after, usually after. 
// But inside routes we can call them.

async function handleSignUp(c: any) {
    try {
      const db = c.get("db");
      const body = await c.req.json();
      const { email, password, name, userType } = body;

      if (!email || !password) {
        return c.json({ error: "Email and password required" }, 400);
      }

      const auth = new SimpleAuth(db);
      const { user, sessionToken } = await auth.signUp(email, password, name, userType);

      // Set session cookie
      setCookie(c, "session_token", sessionToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: "/",
      });

      return c.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          userType: user.userType,
        },
      });
    } catch (error: any) {
      console.error("[SIMPLE-AUTH] Sign up error:", error);
      return c.json({ error: error.message || "Sign up failed" }, 400);
    }
}

async function handleSignIn(c: any) {
    try {
      const db = c.get("db");
      const body = await c.req.json();
      const { email, password } = body;

      if (!email || !password) {
        return c.json({ error: "Email and password required" }, 400);
      }

      const auth = new SimpleAuth(db);
      const { user, sessionToken } = await auth.signIn(email, password);

      // Set session cookie
      setCookie(c, "session_token", sessionToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });

      return c.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          userType: user.userType,
        },
      });
    } catch (error: any) {
      console.error("[SIMPLE-AUTH] Sign in error:", error);
      return c.json({ error: error.message || "Invalid credentials" }, 401);
    }
}

export const simpleAuthRoute = factory.createApp()
  // Sign up (support both paths for compatibility)
  .post("/sign-up/email", async (c) => {
    return handleSignUp(c);
  })
  .post("/sign-up", async (c) => {
    return handleSignUp(c);
  })

  // Sign in (support both paths)
  .post("/sign-in/email", async (c) => {
    return handleSignIn(c);
  })
  .post("/sign-in", async (c) => {
    return handleSignIn(c);
  })

  // Get session
  .get("/session", async (c) => {
    try {
      const db = c.get("db");
      const sessionToken = c.req.header("cookie")?.match(/session_token=([^;]+)/)?.[1];

      if (!sessionToken) {
        return c.json({ user: null }, 401);
      }

      const auth = new SimpleAuth(db);
      const result = await auth.getSession(sessionToken);

      if (!result) {
        return c.json({ user: null }, 401);
      }

      return c.json({
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          userType: result.user.userType,
        },
      });
    } catch (error) {
      console.error("[SIMPLE-AUTH] Session error:", error);
      return c.json({ user: null }, 401);
    }
  })

  // Sign out
  .post("/sign-out", async (c) => {
    try {
      const db = c.get("db");
      const sessionToken = c.req.header("cookie")?.match(/session_token=([^;]+)/)?.[1];

      if (sessionToken) {
        const auth = new SimpleAuth(db);
        await auth.signOut(sessionToken);
      }

      deleteCookie(c, "session_token", { path: "/" });
      return c.json({ success: true });
    } catch (error) {
      console.error("[SIMPLE-AUTH] Sign out error:", error);
      return c.json({ success: false }, 500);
    }
  });

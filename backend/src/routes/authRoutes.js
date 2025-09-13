import express from "express";
import {
  getGoogleAuthURL,
  exchangeCodeForTokens,
  verifyIdToken,
} from "../utils/googleAuth.js";
import * as User from "../models/User.js";

const router = express.Router();

/*Step 1: Redirect user to Google login page */
export const redirectToGoogle = (req, res) => {
  const url = getGoogleAuthURL();
  return res.redirect(url);
};

/**Step 2: Google redirects back with `code` */
export const googleCallback = async (req, res, next) => {
  try {
    const code = req.query.code;
    if (!code) {
      return res.status(400).json({ error: "Missing code" });
    }

    // Exchange code for tokens
    const { id_token } = await exchangeCodeForTokens(code);

    // Validate ID token & extract profile
    const profile = await verifyIdToken(id_token);

    // Find or create user in DB
    const user = await User.findOrCreate(profile);

    // Store user in session
    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    };

    // Redirect to frontend (success page)
    return res.redirect(process.env.FRONTEND_URL + "/auth/success");
    // OR if using API only:
    // return res.json({ ok: true, user: req.session.user });
  } catch (err) {
    console.error("OAuth error:", err);
    return res.status(500).json({ error: "Authentication failed" });
  }
};

/**Step 3: Logout */
export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Session destroy error:", err);
      return res.status(500).json({ error: "Logout failed" });
    }
    res.clearCookie("connect.sid");
    return res.json({ ok: true });
    // OR res.redirect(process.env.FRONTEND_URL + "/auth/logout-success");
  });
};

/*Step 4: Get current user (session) */
export const me = (req, res) => {
  if (req.session?.user) {
    return res.json(req.session.user);
  } else {
    return res.status(401).json({ error: "Not authenticated" });
  }
};

// Attach handlers to routes
router.get("/auth/google", redirectToGoogle);
router.get("/auth/google/callback", googleCallback);
router.post("/auth/logout", logout);
router.get("/auth/me", me);

export default router;

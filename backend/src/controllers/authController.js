import { verifyGoogleToken } from "../utils/googleauth.js";
import pool from "../config/db.js";

// Redirects to Google OAuth consent screen
export const login = (req, res) => {
  const redirectUri = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&response_type=code&scope=openid%20email%20profile`;
  res.redirect(redirectUri);
};

// Handles Google redirect and creates session
export const callback = async (req, res) => {
  try {
    const code = req.query.code;

    if (!code) {
      return res.status(400).json({ error: "Authorization code not found" });
    }

    // Verify and get user info
    const userData = await verifyGoogleToken(code);

    // Store user in DB (create if new, else fetch existing)
    const query = `
      INSERT INTO users (google_id, name, email, picture)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (google_id)
      DO UPDATE SET name = EXCLUDED.name, email = EXCLUDED.email, picture = EXCLUDED.picture
      RETURNING *;
    `;
    const values = [userData.googleId, userData.name, userData.email, userData.picture];
    const result = await pool.query(query, values);

    const user = result.rows[0];

    // Save user info in session
    req.session.user = {
      id: user.id,
      googleId: user.google_id,
      name: user.name,
      email: user.email,
      picture: user.picture,
    };

    // Redirect to frontend
    res.redirect("http://localhost:3000");
  } catch (err) {
    console.error("OAuth Callback Error:", err);
    res.status(500).json({ error: "Authentication failed" });
  }
};

// Get logged-in user
export const getCurrentUser = (req, res) => {
  if (req.session.user) {
    return res.json(req.session.user);
  }
  res.status(401).json({ message: "Not logged in" });
};

// Logout user
export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ message: "Logout failed" });
    }
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out successfully" });
  });
};

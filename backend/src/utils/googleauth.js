import fetch from "node-fetch";

import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";

const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export function getGoogleAuthURL() {
  const scopes = [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
  ];

  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes,
  });
}

export async function exchangeCodeForTokens(code) {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}

export async function verifyIdToken(id_token) {
  const ticket = await oauth2Client.verifyIdToken({
    idToken: id_token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  return {
    google_id: payload.sub,
    email: payload.email,
    name: payload.name,
    avatar: payload.picture,
  };
}

export async function redirectToGoogle(req, res) {
  const url = getGoogleAuthURL();
  res.redirect(url);
}

export async function googleCallback(req, res, next) {
  try {
    const code = req.query.code;
    if (!code) {
      return res.status(400).json({ error: "Missing authorization code" });
    }

    const { id_token } = await exchangeCodeForTokens(code);
    const profile = await verifyIdToken(id_token);

    const user = await User.findOrCreate(profile);

    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    };

    res.redirect(process.env.FRONTEND_URL + "/auth/success");
  } catch (err) {
    next(err);
  }
}

export function logout(req, res) {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ ok: true });
  });
}

export function me(req, res) {
  if (req.session?.user) {
    return res.json(req.session.user);
  }
  return res.status(401).json({ error: "Not authenticated" });
}


export const verifyGoogleToken = async (code) => {
  try {
    // 1️⃣ Exchange "code" for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.id_token) {
      throw new Error("Failed to get ID token from Google");
    }

    // 2️⃣ Decode ID token payload (base64)
    const base64Payload = tokenData.id_token.split(".")[1];
    const decodedPayload = JSON.parse(
      Buffer.from(base64Payload, "base64").toString()
    );

    // 3️⃣ Return structured user data
    return {
      googleId: decodedPayload.sub,
      email: decodedPayload.email,
      name: decodedPayload.name,
      picture: decodedPayload.picture,
    };
  } catch (err) {
    console.error("Google OAuth Verification Error:", err);
    throw new Error("Google token verification failed");
  }
};

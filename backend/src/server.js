import session from "express-session";
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import pgSession from 'connect-pg-simple';
import { pool } from './config/db.js';
dotenv.config();

const app = express();

//Middlewares
app.use(helmet());
app.use(morgan('dev'));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Session setup
const PgSession = pgSession(session);

app.use(
  session({
    store: new PgSession({
      pool, // connection pool
      tableName: 'session', // you’ll need to create this table via connect-pg-simple docs
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    },
  })
);


import authRoutes from "./routes/authRoutes.js";
app.use("/api", authRoutes);

import postRoutes from "./routes/postRoutes.js";
app.use("/api", postRoutes);

import commentRoutes from "./routes/commentRoutes.js";
app.use("/api", commentRoutes);



app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // set true in production with HTTPS
      sameSite: "lax", // important for local dev with different ports
    },
  })
);

app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

//Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ message: err.message, ...(process.env.NODE_ENV === 'development' && { stack: err.stack }) });
});

//Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});


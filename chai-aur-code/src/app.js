// app.js
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from './utils/passport.js';

// Load environment variables from .env (only locally)
dotenv.config();

const app = express();

// ==================== CORS ====================
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "https://faseehvision.netlify.app"  // your deployed frontend
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow Postman or server-to-server requests
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error("CORS policy: This origin is not allowed"));
  },
  credentials: true, // important for sending cookies
  methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Set-Cookie"]
}));
// ============================================

// Body parser
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));
app.use(cookieParser());

// Session (required for passport)
app.use(session({
  secret: process.env.ACCESS_TOKEN,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Serve static files
app.use(express.static("public"));

// ==================== Routers ====================
import pushRouter from './routes/push.router.js';
import userRouter from './routes/user.router.js';
import videoRouter from './routes/video.router.js';
import playlistRouter from './routes/playlist.router.js';
import commentRouter from './routes/comment.router.js';
import likeRouter from './routes/like.router.js';
import subRouter from './routes/subcription.router.js';
import tweetRouter from './routes/tweet.router.js';
import dashRouter from './routes/dashboard.router.js';
import healthRouter from './routes/healthcheck.router.js';
import authRouter from './routes/auth.router.js';


app.use("/api/v1/user", userRouter);
app.use("/api/v2/video", videoRouter);
app.use("/api/v3/playlist", playlistRouter);
app.use("/api/v4/comment", commentRouter);
app.use("/api/v5/tweet", tweetRouter);
app.use("/api/v6/like", likeRouter);
app.use("/api/v7/dashboard", dashRouter);
app.use("/api/v8/healthcheck", healthRouter);
app.use("/api/v9/subscription", subRouter);
app.use("/api/v10/push", pushRouter);
app.use("/auth", authRouter);
// ================================================

// Error handling middleware (optional but recommended)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message });
});

export default app;
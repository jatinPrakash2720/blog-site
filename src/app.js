import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import { configurePassport } from "./utils/passport.util.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(",")[0]
      : "http://34.69.58.115",
    credentials: true,
  })
);

// Allow iframe embedding for web previews
app.use((req, res, next) => {
  res.removeHeader("X-Frame-Options");
  res.setHeader("Content-Security-Policy", "frame-ancestors *");
  next();
});

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

configurePassport();
app.use(passport.initialize());
//routes import
import userRouter from "./routes/user.route.js";
app.use("/api/v1/users", userRouter);

import blogRouter from "./routes/blog.route.js";
app.use("/api/v1/blogs", blogRouter);

import categoryRouter from "./routes/categories.route.js";
app.use("/api/v1/categories", categoryRouter);

import followRouter from "./routes/userfollow.route.js";
app.use("/api/v1/follow", followRouter);

import saveRouter from "./routes/save.route.js";
app.use("/api/v1/saves", saveRouter);

import likeRouter from "./routes/like.route.js";
app.use("/api/v1/likes", likeRouter);

import commentRouter from "./routes/comment.route.js";
app.use("/api/v1/comments", commentRouter);

// import { apiLimiter } from "./middlewares/ratelimiter.middleware.js";
// app.use("/api", apiLimiter);

//centrailized error control
import { ApiError } from "./utils/ApiError.util.js";
app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: err.errors,
    });
  }
  console.error(err);

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
    errors: [],
  });
});
export { app };

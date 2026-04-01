import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import type { NextFunction, Request, Response } from "express";
import { userRouter } from "./routes/user.route.js";
import { propertyRouter } from "./routes/property.route.js";
import { favouriteRouter } from "./routes/favourite.route.js";
import { ApiError } from "./utils/ApiError.js";

const app = express();

const allowedOrigins = [
  process.env.CORS_ORIGIN,
  "http://localhost:5173",
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow tools like Postman/curl (no Origin header) and configured frontends.
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/properties", propertyRouter);
app.use("/api/v1/favourites", favouriteRouter);

app.use((err: unknown, _: Request, res: Response, __: NextFunction) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      statusCode: err.statusCode,
      message: err.message,
      errors: err.errors,
      success: false,
    });
  }

  return res.status(500).json({
    statusCode: 500,
    message: "Internal Server Error",
    success: false,
  });
});

export { app };


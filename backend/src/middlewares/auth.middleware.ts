import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError.ts";
import { asyncHandler } from "../utils/AsyncHandler.ts";
import jwt from "jsonwebtoken";
import prisma from "../db/index.ts";

export const verifyJWT = asyncHandler(
  async (req: Request, _: Response, next: NextFunction) => {
    try {
      const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

      // console.log(token);
      if (!token) {
        throw new ApiError(401, "Unauthorized request");
      }
      if (!process.env.ACCESS_TOKEN_SECRET) {
        throw new ApiError(500, "Internal Server Error");
      }

      const decodedToken = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET
      ) as { id: number };

      // Fetch user from database using Prisma
      const user = await prisma.user.findUnique({
        where: { id: Number(decodedToken.id) },
        select: {
          id: true,
          email: true,
        },
      });

      if (!user) {
        throw new ApiError(401, "Invalid Access Token");
      }

      req.user = user;
      next();
    } catch (error: unknown) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new ApiError(401, "Token expired");
      }

      throw new ApiError(401, "Invalid access token");
    }
  }
);

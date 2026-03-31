import type { Request, Response } from "express";
import { ApiError } from "../utils/ApiError.ts";
import { asyncHandler } from "../utils/AsyncHandler.ts";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/ApiResponse.ts";
import {
  RegisterUserSchema,
  LoginUserSchema,
} from "../validators/auth.validator.ts";
import prisma from "../db/index.ts";
import bcrypt from "bcrypt";

// ─── Token helpers ────────────────────────────────────────────────────────────

export const generateAccessToken = (userId: number) => {
  return jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY as any,
  });
};

export const generateRefreshToken = (userId: number) => {
  return jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY as any,
  });
};

const generateAccessAndRefreshTokens = (userId: number) => {
  try {
    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);
    return { accessToken, refreshToken };
  } catch {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

// ─── Password helpers ─────────────────────────────────────────────────────────

const encryptPassword = (password: string) => bcrypt.hash(password, 10);

const isPasswordCorrect = (password: string, hash: string) =>
  bcrypt.compare(password, hash);

// ─── Controllers ──────────────────────────────────────────────────────────────

const registerUser = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { fullName, email, password } = RegisterUserSchema.parse(req.body);

    // Duplicate email check
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ApiError(409, "An account with this email already exists");
    }

    const encryptedPassword = await encryptPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        fullName,
        role: "buyer",
        password: encryptedPassword,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
        refreshToken: true,
      },
    });

    return res
      .status(201)
      .json(new ApiResponse(201, user, "User registered successfully"));
  }
);

const loginUser = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = LoginUserSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new ApiError(404, "No user found with this email");
    }

    const isPasswordValid = await isPasswordCorrect(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Incorrect password");
    }

    const { accessToken, refreshToken } = generateAccessAndRefreshTokens(
      user.id
    );

    const loggedInUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        fullName: true,
      },
    });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(
        new ApiResponse(
          200,
          { user: loggedInUser, accessToken, refreshToken },
          "Logged in successfully"
        )
      );
  }
);

export { registerUser, loginUser };

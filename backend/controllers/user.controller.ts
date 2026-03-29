import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/AsyncHandler";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/ApiResponse";
import {
  RegisterUserSchema,
  LoginUserSchema,
} from "../validators/auth.validator";
import prisma from "../db";
import bcrypt from "bcrypt";

const generateAccessAndRefereshTokens = async (userId: number) => {
  try {
    // By ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    const accessToken = generateAccessToken({ _id: userId });
    const refreshToken = generateRefreshToken(userId);

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req: Request, res: Response) => {

  const { fullName, email, password } = RegisterUserSchema.parse(req.body);

  const encryptedPassword = await encryptPassword(password);

  const user = await prisma.user.create({
    data: {
      email: email,
      fullName: fullName,
      role: "buyer",
      password: encryptedPassword,
    },
  });
  console.log(user);

  return res
    .status(201)
    .json(new ApiResponse(200, user, "User registered Successfully"));
});


const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = LoginUserSchema.parse(req.body);
  console.log(email);

  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await isPasswordCorrect(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
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

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});


export const generateAccessToken = (user: any) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      fullName: user.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};


export const generateRefreshToken = (userId: any) => {
  return jwt.sign(
    {
      id: userId,
    },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

const encryptPassword = async (password: string) => {
  const encryptedPassword = await bcrypt.hash(password, 10);
  return encryptedPassword;
};

const isPasswordCorrect = async (
  password: string,
  encryptedPassword: string
) => {
  return await bcrypt.compare(password, encryptedPassword);
};

export { loginUser, registerUser };

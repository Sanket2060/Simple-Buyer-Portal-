import type { Request, Response } from "express";
import { ApiError } from "../utils/ApiError.ts";
import { ApiResponse } from "../utils/ApiResponse.ts";
import { asyncHandler } from "../utils/AsyncHandler.ts";
import prisma from "../db/index.ts";

const getFavouritePropertiesById = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    if (!id) {
      throw new ApiError(400, "User ID is required");
    }
    const property = await prisma.favourite.findMany({
      where: { userId: Number(id) },
      include: {
        property: true,
      },
    });
    return res
      .status(200)
      .json(new ApiResponse(200, property, "Property fetched successfully"));
  }
);

const removeFavouriteProperty = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, "Unauthorized");
    }
    const { propertyId } = req.params;
    if (!propertyId) {
      throw new ApiError(400, "No property ID provided");
    }

    await prisma.favourite.delete({
      where: {
        userId_propertyId: {
          userId: Number(userId),
          propertyId: Number(propertyId),
        },
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Property removed from favorites"));
  }
);

const addFavouriteProperty = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, "Unauthorized");
    }
    const { propertyId } = req.body;
    if (!propertyId) {
      throw new ApiError(400, "No property ID provided");
    }

    const favourite = await prisma.favourite.create({
      data: {
        userId: Number(userId),
        propertyId: Number(propertyId),
      },
    });

    return res
      .status(201)
      .json(new ApiResponse(201, favourite, "Property added to favorites"));
  }
);

export {
  getFavouritePropertiesById,
  removeFavouriteProperty,
  addFavouriteProperty,
};

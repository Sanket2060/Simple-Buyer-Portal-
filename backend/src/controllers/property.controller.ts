import type { Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import prisma from "../db/index.js";

const getAllProperties = asyncHandler(
  async (_: Request, res: Response): Promise<Response> => {
    const properties = await prisma.property.findMany({
      omit: {
        description: true,
      },
    });
    return res
      .status(201)
      .json(
        new ApiResponse(200, properties, "Properties fetched successfully")
      );
  }
);

const getPropertyById = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const property = await prisma.property.findUnique({
      where: { id: Number(id) },
    });
    return res
      .status(201)
      .json(new ApiResponse(200, property, "Property fetched successfully"));
  }
);

export { getAllProperties, getPropertyById };


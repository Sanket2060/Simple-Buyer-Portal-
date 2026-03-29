import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError.ts";
import { ApiResponse } from "../utils/ApiResponse.ts";
import { asyncHandler } from "../utils/AsyncHandler.ts";
import prisma from "../db/index.ts";

const getAllProperties = asyncHandler(async (_: Request, res: Response) => {
  const properties = await prisma.property.findMany({
    omit: {
      description: true,
    },
  });
  return res
    .status(201)
    .json(new ApiResponse(200, properties, "Properties fetched successfully"));
});

const getPropertyById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const property = await prisma.property.findUnique({
    where: { id: Number(id) },
  });
  return res
    .status(201)
    .json(new ApiResponse(200, property, "Property fetched successfully"));
});

export { getAllProperties, getPropertyById };

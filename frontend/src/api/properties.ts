import apiClient from "../lib/axios";
import type { ApiResponse, Property } from "../types";

export const getAllProperties = async (): Promise<Property[]> => {
  const { data } = await apiClient.get<ApiResponse<Property[]>>(
    "/properties/getAllProperties",
  );
  return data.data;
};

export const getPropertyById = async (id: number): Promise<Property> => {
  const { data } = await apiClient.get<ApiResponse<Property>>(
    `/properties/getPropertyById/${id}`,
  );
  return data.data;
};

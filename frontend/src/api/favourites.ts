import apiClient from "../lib/axios";
import type { ApiResponse, Favourite, AddFavouritePayload } from "../types";

export const getFavourites = async (): Promise<Favourite[]> => {
  const { data } = await apiClient.get<ApiResponse<Favourite[]>>(
    "/favourites/favourites",
  );
  return data.data;
};

export const addFavourite = async (
  payload: AddFavouritePayload,
): Promise<void> => {
  await apiClient.post<ApiResponse<unknown>>("/favourites/favourites", payload);
};

export const removeFavourite = async (propertyId: number): Promise<void> => {
  await apiClient.delete<ApiResponse<null>>(
    `/favourites/favourites/${propertyId}`,
  );
};

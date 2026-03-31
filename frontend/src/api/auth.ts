import apiClient from "../lib/axios";
import type {
  ApiResponse,
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  User,
} from "../types";

export const loginUser = async (
  payload: LoginPayload,
): Promise<LoginResponse> => {
  const { data } = await apiClient.post<ApiResponse<LoginResponse>>(
    "/users/login",
    payload,
  );
  return data.data;
};

export const registerUser = async (
  payload: RegisterPayload,
): Promise<User> => {
  const { data } = await apiClient.post<ApiResponse<User>>(
    "/users/register",
    payload,
  );
  return data.data;
};

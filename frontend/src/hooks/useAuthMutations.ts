import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { loginUser, registerUser } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import type { LoginPayload, RegisterPayload } from "../types";

// ─── Login ────────────────────────────────────────────────────────────────────

export const useLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: LoginPayload) => loginUser(payload),
    onSuccess: (data) => {
      login(data.user, data.accessToken);
      navigate("/dashboard", { replace: true });
    },
  });
};

// ─── Register ─────────────────────────────────────────────────────────────────

export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => registerUser(payload),
    onSuccess: () => {
      // After successful registration redirect to login
      navigate("/", { replace: true });
    },
  });
};

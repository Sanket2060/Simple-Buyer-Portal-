import * as z from "zod";

const RegisterUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name must be at most 50 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must be at most 20 characters"),
});

const LoginUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type RegisterUser = z.infer<typeof RegisterUserSchema>;
type LoginUser = z.infer<typeof LoginUserSchema>;

export { RegisterUserSchema, LoginUserSchema };
export type { RegisterUser, LoginUser };

import * as z from "zod";

const RegisterUserSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(2).max(50),
  role: z.enum(["BUYER", "SELLER"]),
  password: z.string().min(6).max(20),
});

const LoginUserSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type RegisterUser = z.infer<typeof RegisterUserSchema>;
type LoginUser = z.infer<typeof LoginUserSchema>;

export { RegisterUserSchema, LoginUserSchema };
export type { RegisterUser, LoginUser };

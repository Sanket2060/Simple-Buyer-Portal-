import { Router } from "express";
import { loginUser, registerUser } from "../controllers/user.controller.ts";

const router = Router();

router.route("/login").post(loginUser);
router.route("/register").post(registerUser);

export { router as userRouter };

import { Router } from "express";
import { loginUser } from "../controllers/user.controller.ts";

const router = Router();

router.route("/login").post(loginUser);

export { router as userRouter };

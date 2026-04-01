import { Router } from "express";
import {
  loginUser,
  refreshAccessToken,
  registerUser,
} from "../controllers/user.controller.js";

const router = Router();

router.route("/login").post(loginUser);
router.route("/register").post(registerUser);
router.route("/refresh-token").post(refreshAccessToken);

export { router as userRouter };


import { Router } from "express";
import {
  getAllProperties,
  getPropertyById,
} from "../controllers/property.controller.ts";
import { verifyJWT } from "../middlewares/auth.middleware.ts";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/getAllProperties").get(getAllProperties);
router.route("/getPropertyById/:id").get(getPropertyById);

export { router as propertyRouter };

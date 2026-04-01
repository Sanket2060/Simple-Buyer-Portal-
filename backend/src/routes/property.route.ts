import { Router } from "express";
import {
  getAllProperties,
  getPropertyById,
} from "../controllers/property.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/getAllProperties").get(getAllProperties);
router.route("/getPropertyById/:id").get(getPropertyById);

export { router as propertyRouter };


import { Router } from "express";
import {
  getAllProperties,
  getPropertyById,
} from "../controllers/property.controller.ts";

const router = Router();

router.route("/getAllProperties").get(getAllProperties);
router.route("/getPropertyById/:id").get(getPropertyById);

export { router as propertyRouter };

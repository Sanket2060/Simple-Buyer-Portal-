import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.ts";
import {
  addFavouriteProperty,
  getFavouritePropertiesById,
  removeFavouriteProperty,
} from "../controllers/favourite.controller.ts";

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/favourites").post(addFavouriteProperty);
router.route("/favourites/:id").delete(removeFavouriteProperty);
router.route("/favourites").get(getFavouritePropertiesById);

export { router as favouriteRouter };

import { Router } from "express";
import {
  createSubCategory,
  getFilterableSubCategories,
  getSubCategories,
  getTopLevelCategories,
} from "../controllers/category.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT);

router.route("/top-level").get(getTopLevelCategories);
router.route("/:parentId/sub-categories").get(getSubCategories);
router
  .route("/filterable-subcategories")
  .get(getFilterableSubCategories);
// router
//   .route("/:parentId/filterable-subcategories")
//   .get(getFilterableSubCategories);
router.route("/:parentId/sub-categories").post(createSubCategory);

export default router;

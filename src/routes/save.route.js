import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createSaveCollection,
  deleteSaveCollection,
  getBlogsInCollection,
  getUserCollections,
  toggleBlogInCollection,
  updateSaveCollectionDescription,
  updateSaveCollectionName,
} from "../controllers/save.controller.js";

const router = Router();
router.use(verifyJWT);

router.route("/").post(createSaveCollection);
router.route("/").get(getUserCollections);
router
  .route("/:collectionId")
  .get(getBlogsInCollection)
  .delete(deleteSaveCollection);
router.route("/:collectionId/name").patch(updateSaveCollectionName);
router
  .route("/:collectionId/description")
  .patch(updateSaveCollectionDescription);
router.route("/toggle/:collectionId/:blogId").patch(toggleBlogInCollection);

export default router;

import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createBlog,
  deleteBlog,
  getBlogByOwner,
  getSearchedBlog,
  getBlogs,
  getBlogsBySubCategory,
  getBlogsByTopLevelCategory,
  getFollowingFeed,
  restoreBlog,
  toggleBlogStatus,
  updateBlogContent,
  updateBlogDetails,
  updateBlogThumbnail,
  updateBlogTitle,
} from "../controllers/blog.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();
router.use(verifyJWT);

router.route("/").get(getBlogs);
router.route("/").post(createBlog);
router.route("/:blogId/details").patch(upload.single("thumbnail"), updateBlogDetails);
router.route("/:blogId").get(getSearchedBlog);
router.route("/own/:blogId").get(getBlogByOwner)
router.route("/own/:blogId/title").patch(updateBlogTitle);
router.route("/own/:blogId/content").patch(updateBlogContent);
router
  .route("/own/:blogId/thumbnail")
  .patch(upload.single("thumbnail"), updateBlogThumbnail);
router.route("/own/:blogId/toggle-status").patch(toggleBlogStatus);
router.route("/own/:blogId").delete(deleteBlog);
router.route("/own/:blogId/restore").patch(restoreBlog);
router.route("/by-category/:categoryId").get(getBlogsByTopLevelCategory);
router.route("/by-sub-category/:subCategoryId").get(getBlogsBySubCategory);
router.route("/feed/following").get(getFollowingFeed);

export default router;

import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getBlogLikes,
  getBlogsLikedByUser,
  getCommentLikes,
  toggleBlogLike,
  toggleCommentLike,
} from "../controllers/like.controller.js";

const router = Router();
router.use(verifyJWT);

router.route("/toggle/blog/:blogId").post(toggleBlogLike);
router.route("/toggle/comment/:commentId").post(toggleCommentLike);
router.route("/blogs").get(getBlogsLikedByUser);
router.route("/blog/:blogId").get(getBlogLikes);
router.route("/comment/:commentId").get(getCommentLikes);

export default router;

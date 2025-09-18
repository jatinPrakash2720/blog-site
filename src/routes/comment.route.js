import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  addCommentToBlogs,
  deleteComment,
  getBlogComments,
} from "../controllers/comment.controller.js";

const router = Router();
router.use(verifyJWT);

router.route("/:blogId").get(getBlogComments);
router.route("/:blogId").post(addCommentToBlogs);
router.route("/c/:commentId").delete(deleteComment);

export default router;

import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getUserFollowers,
  getUserFollowing,
  toggleFollow,
  getSuggestedUsers,
} from "../controllers/userfollow.controller.js";

const router = Router();
router.use(verifyJWT);

router.route("/toggle/:userIdToFollow").post(toggleFollow);
router.route("/followers/:userId").get(getUserFollowers);
router.route("/following/:userId").get(getUserFollowing);
router.route("/suggested").get(getSuggestedUsers);

export default router;

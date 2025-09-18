import { Router } from "express";
import {
  changeCurrentPassword,
  forgotPassword,
  getCurrentUser,
  getReadHistory,
  getUserPageProfile,
  loginUser,
  loginWithGithub,
  loginWithGoogle,
  logoutUser,
  refreshAccessToken,
  registerUser,
  restorePassword,
  updateUserAvatar,
  updateUserCoverImage,
  updateUserEmail,
  updateUserFullName,
  updateUserProfileImages,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getBlogsByUserId } from "../controllers/blog.controller.js";
// import { authLimiter } from "../middlewares/ratelimiter.middleware.js";
import passport from "passport";
const router = Router();
// console.log("User routes loaded");

router.route("/register").post(registerUser);
router.route("/:userId/profile-images").patch(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]), updateUserProfileImages
);
router.route("/login").post(loginUser);
router.route("/logout").get(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-fullname").patch(verifyJWT, updateUserFullName);
router.route("/update-email").patch(verifyJWT, updateUserEmail);
router
  .route("/update-avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
router
  .route("/update-cover")
  .patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);
router.route("/c/:username").get(verifyJWT, getUserPageProfile);
router.route("/history").get(verifyJWT, getReadHistory);
router.route("/:userId/blogs").get(verifyJWT, getBlogsByUserId);
router
  .route("/google")
  .get(passport.authenticate("google", { scope: ["profile", "email"] }));
router.route("/google/callback").get(
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CORS_ORIGIN.split(",")[0]}/login`,
  }),
  loginWithGoogle
);
router.route("/github").get(passport.authenticate("github", { scope: ["user:email"] }));
router.route("/github/callback").get(
  passport.authenticate("github", {
    session: false,
    failureRedirect:`${process.env.CORS_ORIGIN.split(",")[0]}/login`,
  }),
  loginWithGithub
)
router.route("/forgot-password").post(forgotPassword);
router.route("/restore-password/:token").post(restorePassword);
// router.route("/login").post(registerUser);

export default router;

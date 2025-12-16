import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import { User } from "../models/user.model.js";
import { Blog } from "../models/blog.model.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.util.js";
import { generateAccessAndRefreshToken } from "../utils/genAccessAndRefreshToken.util.js";
import { ApiError } from "../utils/ApiError.util.js";
import jwt from "jsonwebtoken";
import { IMAGE_FOLDERS } from "../constants.js";
// import { sendEmail } from "../utils/mailer.util.js";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.util.js";

const option = {
  httpOnly: true,
  secure: true,
};

// Add this for OAuth cookies (accessible by JavaScript)
const oauthOption = {
  httpOnly: false, // Allow JavaScript access
  secure: true,
};

const signUpUser = asyncHandler(async (req, res) => {
  const { username, email, password, saveLogin } = req.body;
  if (
    [username, email, password].some((field) => !field || field?.trim() === "")
  ) {
    throw new ApiError(400, "All Fields are required");
  }
  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(409, "User with email already exists");
  }
  const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiryDate = new Date();
  expiryDate.setMinutes(expiryDate.getMinutes() + 5);

  const user = await User.create({
    email: email,
    username: username,
    password: password,
    verifyCode: verifyCode,
    verifyCodeExpiry: expiryDate,
  });

  if (!user) {
    throw new ApiError(500, "Something went wrong registering the user");
  }

  const emailResponse = await sendEmail(email, username, verifyCode);
  if (!emailResponse.success) {
    throw new ApiError(500, emailResponse.message);
  }
  // Destructure and return only necessary user fields (excluding sensitive data)
  const { email: userEmail } = user.toObject();

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { email: userEmail, saveLogin: saveLogin },
        "User registered successfully. Please verify your email"
      )
    );
});
const resendVerifyCode = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new ApiError(401, "Resending Verify Code failed, Retry");
  }

  const user = await User.findOne({ email: email });
  if (!user) {
    throw new ApiError(500, "Retry, after few minutes");
  }

  const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiryDate = new Date();
  expiryDate.setMinutes(expiryDate.getMinutes() + 5);

  user.email = email;
  user.verifyCode = verifyCode;
  user.verifyCodeExpiry = expiryDate;

  const newUser = await user.save();

  if (!newUser) {
    throw new ApiError(500, "resending verify code failed");
  }

  const emailResponse = await sendEmail(email, newUser.username, verifyCode);

  if (!emailResponse.success) {
    throw new ApiError(500, emailResponse.message);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "Verify code resend successfully, Please check your email"
      )
    );
});
const verifyUser = asyncHandler(async (req, res) => {
  const { email, code, saveLogin } = req.body;
  if (!email || !code) {
    throw new ApiError(400, "Email, code  are required");
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const isCodeValid = user.verifyCode === code;
  const isCodeExpired = user.verifyCodeExpiry < new Date();
  console.log("isCodeValid :", isCodeValid);
  console.log("isCodeExpired :", isCodeExpired);

  if (!isCodeValid) {
    throw new ApiError(402, "Invalid code");
  }
  if (isCodeExpired) {
    throw new ApiError(403, "Code expired");
  }
  if (isCodeValid && !isCodeExpired) {
    user.verifyCode = undefined;
    user.verifyCodeExpiry = undefined;
    const newUser = await user.save({ validateBeforeSave: false, new: true });

    const {
      _id,
      username: userUsername,
      email: userEmail,
      fullName,
      avatar,
      coverImage,
      bio,
      createdAt,
      updatedAt,
    } = newUser.toObject();
    if (saveLogin) {
      const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        newUser._id
      );
      return res
        .status(200)
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .json(
          new ApiResponse(
            200,
            {
              user: {
                _id,
                username: userUsername,
                email: userEmail,
                fullName,
                avatar,
                coverImage,
                bio,
                createdAt,
                updatedAt,
              },
              accessToken: accessToken,
              refreshToken: refreshToken,
            },
            "User verified successfully with saving login"
          )
        );
    } else {
      return res.status(200).json(
        new ApiResponse(
          200,
          {
            user: {
              _id,
              username: userUsername,
              email: userEmail,
              fullName,
              avatar,
              coverImage,
              bio,
              createdAt,
              updatedAt,
            },
          },
          "User verified successfully without saving login"
        )
      );
    }
  }
  throw new ApiError(401, "Invalid code or code expired");
});
const loginUser = asyncHandler(async (req, res) => {
  /*
  user se data lenge
  validate krlenge,
  user nikal lenge
  uska password validate krenge
  gen token, 
  loggedinuser ki details bej denge
  aur cookies mein kr denge, with options
  */
  const { identifier, password, saveLogin } = req.body;
  console.log("identifier :", identifier);
  console.log("password :", password);
  console.log("saveLogin :", saveLogin);
  if (!identifier) {
    throw new ApiError(400, "email is required");
  }
  if (!password) {
    throw new ApiError(400, "password is required");
  }
  const user = await User.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  });
  console.log(user);
  if (!user) {
    throw new ApiError(404, "User does not exists");
  }
  // If the account was created via OAuth (google/github), redirect to the correct provider
  if (user.googleId) {
    return res
      .status(409)
      .json(
        new ApiResponse(
          409,
          { provider: "google" },
          "Account uses OAuth. Redirect to Google sign in."
        )
      );
  }
  if (user.githubId) {
    return res
      .status(408)
      .json(
        new ApiResponse(
          408,
          { provider: "github" },
          "Account uses OAuth. Redirect to Github sign in."
        )
      );
  }
  const isPasswordValid = await user.isPasswordCorrect(password);
  console.log(isPasswordValid);
  if (!isPasswordValid) {
    throw new ApiError(401, "Password not matched");
  }
  const {
    _id,
    username: userUsername,
    email: userEmail,
    fullName,
    avatar,
    coverImage,
    bio,
    createdAt,
    updatedAt,
  } = user.toObject();
  const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshToken(
    user._id
  );
  if (saveLogin) {
    return res
      .status(200)
      .cookie("accessToken", newAccessToken, option)
      .cookie("refreshToken", newRefreshToken, option)
      .json(
        new ApiResponse(
          200,
          {
            user: {
              _id,
              username: userUsername,
              email: userEmail,
              fullName,
              avatar,
              coverImage,
              bio,
              createdAt,
              updatedAt,
            },
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          },
          "User logged in Successfully with saving login"
        )
      );
  } else {
    return res
      .status(200)
      .cookie("accessToken", newAccessToken, option)
      .cookie("refreshToken", newRefreshToken, option)
      .json(
        new ApiResponse(
          200,
          {
            user: {
              _id,
              username: userUsername,
              email: userEmail,
              fullName,
              avatar,
              coverImage,
              bio,
              createdAt,
              updatedAt,
            },
          },
          "User logged in Successfully without saving login"
        )
      );
  }
});
const logoutUser = asyncHandler(async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $unset: { refreshToken: 1 },
      },
      {
        new: true,
      }
    );

    // const option = {
    //   httpOnly: true,
    //   secure: true,
    // };

    return res
      .status(200)
      .clearCookie("accessToken", option)
      .clearCookie("refreshToken", option)
      .json(new ApiResponse(200, {}, "User logged Out Succesfully"));
  } catch (error) {
    throw new ApiError(500, error?.message || "Internal Error during logout");
  }
});
const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    const incomingRefreshToken =
      req.cookies?.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
      throw new ApiError(401, "no refresh token found");
    }

    const decodedRefreshToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedRefreshToken?._id);
    if (!user) {
      throw new ApiError(401, "invalid refresh token");
    }
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired");
    }

    const { newAccessToken, newRefreshToken } =
      await generateAccessAndRefreshToken(decodedRefreshToken?._id);
    return res
      .status(200)
      .cookie("accessToken", newAccessToken, option)
      .cookie("refreshToken", newRefreshToken, option)
      .json(
        new ApiResponse(
          200,
          {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          },
          "Access Token refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(
      401,
      error?.message || "Error while fetching refresh token"
    );
  }
});
const changeCurrentPassword = asyncHandler(async (req, res) => {
  try {
    const { oldPassword, newPassword, newConfirmPassword } = req.body;

    if (!(newPassword === newConfirmPassword)) {
      throw new ApiError(
        400,
        "new password and confirm password does not match"
      );
    }
    const user = await User.findById(req.user?._id);

    const isPasswordValid = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordValid) {
      throw new ApiError(400, "Invalid old password");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "password changed successfully"));
  } catch (error) {
    throw new ApiError(402, "password details not fetched from user");
  }
});
const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current User fetched successfully"));
});
const updateUserFullName = asyncHandler(async (req, res) => {
  const { fullName } = req.body;

  if (!fullName) {
    throw new ApiError(400, "FullName is required");
  }

  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName: fullName,
      },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, { fullName: fullName }, "FullName is updated"));
});
const updateUserEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        email: email,
      },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, { email: email }, "Email is updated"));
});
const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath, {
    folder: IMAGE_FOLDERS.AVATAR,
    userId: req.user?._id,
  });

  if (!avatar.url) {
    throw new ApiError(408, "Error while uploading on Cloudinary");
  }
  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: { avatar: avatar.url },
    },
    { new: true }
  );
  await deleteFromCloudinary(req.user?.avatar);

  return res
    .status(200)
    .json(new ApiResponse(200, { avatarUrl: avatar.url }, "Avatar Updated"));
});
const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover Image file is missing");
  }
  const coverImage = await uploadOnCloudinary(coverImageLocalPath, {
    folder: IMAGE_FOLDERS.COVER,
    userId: req.user?._id,
  });

  if (!coverImage.url) {
    throw new ApiError(408, "Error while uploading on Cloudinary");
  }
  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: { coverImage: coverImage.url },
    },
    { new: true }
  );

  await deleteFromCloudinary(req.user?.coverImage);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { coverImageUrl: coverImage.url },
        "cover image Updated"
      )
    );
});
const getUserPageProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;
  if (!username?.trim) {
    throw new ApiError(400, "username is missing");
  }
  const userPage = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "userfollows",
        localField: "_id",
        foreignField: "followingid",
        as: "followers",
      },
    },
    {
      $lookup: {
        from: "userfollows",
        localField: "_id",
        foreignField: "followerid",
        as: "following",
      },
    },
    {
      $addFields: {
        followerCount: {
          $size: "$followers",
        },
        followingCount: {
          $size: "$following",
        },
        isFollowed: {
          $cond: {
            if: {
              $in: [
                req.user?._id,
                {
                  $map: {
                    input: "$followers",
                    as: "s",
                    in: "$$s.followerid",
                  },
                },
              ],
            },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        fullName: 1,
        username: 1,
        followerCount: 1,
        followingCount: 1,
        isFollowed: 1,
        avatar: 1,
        coverImage: 1,
        bio: 1,
      },
    },
  ]);
  if (!userPage) {
    throw new ApiError(404, "channel does not exists");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, userPage[0], "User Page fetched successfully"));
});
const getReadHistory = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  // Fetch the user's readHistory array
  const user = await User.findById(req.user._id).select("readHistory");
  if (!user) throw new ApiError(404, "User not found");

  // Prepare the aggregation pipeline to fetch blog details
  const pipeline = [
    {
      $match: {
        _id: { $in: user.readHistory },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    {
      $unwind: {
        path: "$owner",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        title: 1,
        thumbnail: 1,
        slug: 1,
        views: 1,
        isPublished: 1,
        createdAt: 1,
        updatedAt: 1,
        owner: {
          _id: "$owner._id",
          username: "$owner.username",
          fullName: "$owner.fullName",
          avatar: "$owner.avatar",
        },
      },
    },
  ];

  // Execute the paginated aggregation
  const result = await Blog.aggregatePaginate(Blog.aggregate(pipeline), {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  });

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Read history fetched successfully"));
  /*await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "blogs",
        localField: "readHistory",
        foreignField: "_id",
        as: "readHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
            },
          },
          {
            $unwind: {
              path: "$owner",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              title: 1,
              thumbnail: 1,
              slug: 1,
              views: 1,
              isPublished: 1,
              createdAt: 1,
              updatedAt: 1,
              owner: {
                _id: "$owner._id",
                username: "$owner.username",
                fullName: "$owner.fullName",
                avatar: "$owner.avatar",
              },
            },
          },
        ],
      },
    },
  ]);*/
});
const loginWithGoogle = asyncHandler(async (req, res) => {
  console.log("Google OAuth callback triggered");
  console.log("Environment variables:");
  console.log("DEPLOYE_URL:", process.env.DEPLOYE_URL);
  console.log("CORS_ORIGIN:", process.env.CORS_ORIGIN);

  const user = req.user;
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const redirectOrigin = process.env.DEPLOYE_URL;
  // const redirectOrigin = process.env.CORS_ORIGIN.split(",")[0];
  // const redirectOrigin = process.env.LOCAL_BACKEND_URL;

  const redirectURL = `${redirectOrigin}/auth/google/callback`;

  console.log("Redirecting to:", redirectURL);

  return res
    .status(200)
    .cookie("accessToken", accessToken, oauthOption) // Use oauthOption
    .cookie("refreshToken", refreshToken, oauthOption) // Use oauthOption
    .redirect(redirectURL);
});
const loginWithGithub = asyncHandler(async (req, res) => {
  const user = req.user;
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );
  const redirectOrigin = process.env.DEPLOYE_URL;
  // const redirectOrigin = process.env.CORS_ORIGIN.split(",")[0];
  const redirectURL = `${redirectOrigin}/auth/github/callback`;

  return res
    .status(200)
    .cookie("accessToken", accessToken, oauthOption) // Use oauthOption
    .cookie("refreshToken", refreshToken, oauthOption) // Use oauthOption
    .redirect(redirectURL);
});
const forgotPassword = asyncHandler(async (req, res) => {
  const { identifier } = req.body;
  if (!identifier) {
    throw new ApiError(400, "Email or username is required");
  }

  const user = await User.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  });
  if (!user) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { success: false, message: "No user found with that identifier" },
          "If an account with that identifier exists, a reset link has been sent."
        )
      );
  }

  const resetToken = user.generatePasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // const resetUrl = `${process.env.DEPLOYE_URL}/auth/restore-password/${resetToken}`;
  const resetUrl = `http://localhost:3000/auth/restore-password/${resetToken}`;
  console.log("reset Url: ,", resetUrl);
  const message = `You requested a password reset. Plic click this link to reset your password: \n\n ${resetUrl} \n\nIf you did not request this, ignore this email.`;
  try {
    const emailResponse = await sendEmail(
      user.email,
      user.username,
      "",
      resetUrl
    );
    if (!emailResponse.success) {
      throw new ApiError(500, emailResponse.message);
    }
    res.status(200).json(
      new ApiResponse(
        200,
        {
          success: true,
          message:
            "If an account with that identifier exists, a reset link has been sent.",
        },
        "Token sent to email!"
      )
    );
  } catch (error) {
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    await user.save({ validateBeforeSave: false });
    throw new ApiError(500, error.message || "Email could not be sent");
  }
});
const restorePassword = asyncHandler(async (req, res) => {
  const { password } = req.body;

  if (!password) {
    throw new ApiError(400, "Password is required");
  }

  // 1. Find the user by the hashed token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    forgotPasswordToken: hashedToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(401, "Token is invalid or has expired");
  }

  // 2. Manually hash the new password
  // const hashedPassword = await bcrypt.hash(password, 10);
  console.log(password);
  // 3. Update the user directly in the database
  user.password = password;
  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;

  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "Password reset successfully. Redirecting to sign in..."
      )
    );
});
const uniqueUsername = asyncHandler(async (req, res) => {
  const { username } = req.body;
  if (!username) {
    throw new ApiError(400, "Username is required");
  }
  const user = await User.findOne({ username: username });
  if (user) {
    throw new ApiError(404, "Username is not available");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Username is available"));
});

export {
  signUpUser,
  uniqueUsername,
  verifyUser,
  resendVerifyCode,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateUserFullName,
  updateUserEmail,
  updateUserAvatar,
  updateUserCoverImage,
  getUserPageProfile,
  getReadHistory,
  loginWithGoogle,
  loginWithGithub,
  forgotPassword,
  restorePassword,
};

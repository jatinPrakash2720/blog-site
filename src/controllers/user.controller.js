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
import { sendEmail } from "../utils/mailer.util.js";
import crypto from "crypto";

const option = {
  httpOnly: true,
  secure: true,
};

// Add this for OAuth cookies (accessible by JavaScript)
const oauthOption = {
  httpOnly: false, // Allow JavaScript access
  secure: true,
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, fullName, email, password } = req.body;

  if (
    [fullName, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const user = await User.create({
    fullName,
    avatar: "",
    coverImage: "", // Safely access the URL
    email,
    username: username.toLowerCase(),
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully!"));
});
const updateUserProfileImages = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath && !coverImageLocalPath) {
    throw new ApiError(400, "At least one image file is required.");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (avatarLocalPath) {
    const avatar = await uploadOnCloudinary(avatarLocalPath, {
      folder: IMAGE_FOLDERS.AVATAR,
      userId: userId,
    });
    if (!avatar?.url) {
      throw new ApiError(500, "Error while uploading avatar.");
    }
    user.avatar = avatar.url;
  }

  if (coverImageLocalPath) {
    const coverImage = await uploadOnCloudinary(coverImageLocalPath, {
      folder: IMAGE_FOLDERS.COVER,
      userId: userId,
    });
    if (!coverImage?.url) {
      throw new ApiError(500, "Error while uploading cover image.");
    }
    user.coverImage = coverImage.url;
  }

  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Profile images updated successfully."));
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
   const { email, password } = req.body;
   console.log(password);
   if (!email) {
     throw new ApiError(400, "email is required");
   }
   const user = await User.findOne({ email });
   console.log(user);
   if (!user) {
     throw new ApiError(404, "User does not exists");
   }
   const isPasswordValid = await user.isPasswordCorrect(password);
   console.log(isPasswordValid);
   if (!isPasswordValid) {
     throw new ApiError(401, "Invalid user credentials");
   }

   const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
     user._id
   );
   const loggedInUser = await User.findById(user._id).select(
     "-password -refreshToken"
   );

   // const option = {
   //   httpOnly: true,
   //   secure: true,
   // };
   return res
     .status(200)
     .cookie("accessToken", accessToken, option)
     .cookie("refreshToken", refreshToken, option)
     .json(
       new ApiResponse(
         200,
         {
           user: loggedInUser,
           accessToken: accessToken,
           refreshToken: refreshToken,
         },
         "User logged in Successfully"
       )
     );
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

  return res.status(200).json(new ApiResponse(200, {}, "FullName is updated"));
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

  return res.status(200).json(new ApiResponse(200, {}, "Email is updated"));
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

  return res.status(200).json(new ApiResponse(200, {}, "Avatar Updated"));
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

  return res.status(200).json(new ApiResponse(200, {}, "cover image Updated"));
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
        fullName: 1,
        username: 1,
        followerCount: 1,
        followingCount: 1,
        isFollowed: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
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
  const user = req.user;
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );
  const redirectOrigin = process.env.DEPLOYE_URL;
  // const redirectOrigin = process.env.CORS_ORIGIN.split(",")[0];
  const redirectURL = `${redirectOrigin}/auth/google/callback`;
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
          {},
          "If an account with that identifier exists, a reset link has been sent."
        )
      );
  }

  const resetToken = user.generatePasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CORS_ORIGIN.split(",")[0]}/auth/restore-password/${resetToken}`;
  const message = `You requested a password reset. Plic click this link to reset your password: \n\n ${resetUrl} \n\nIf you did not request this, ignore this email.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset Token",
      message,
    });
    res.status(200).json(new ApiResponse(200, {}, "Token sent to email!"));
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
      new ApiResponse(200, {}, "Password reset successfully. Please log in.")
    );
});

export {
  registerUser,
  updateUserProfileImages,
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

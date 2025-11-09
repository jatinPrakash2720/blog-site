import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ApiError } from "../utils/ApiError.util.js";
import { UserFollow } from "../models/userFollow.model.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";

const toggleFollow = asyncHandler(async (req, res) => {
  const { userIdToFollow } = req.params;
  const followerId = req.user._id;

  if (!mongoose.isValidObjectId(userIdToFollow)) {
    throw new ApiError(400, "Invalid user id.");
  }
  if (followerId.toString() === userIdToFollow) {
    throw new ApiError(400, "You cannot follow yourself.");
  }

  const userToFollow = await User.findById(userIdToFollow);
  if (!userToFollow) {
    throw new ApiError(404, "User to follow does not exist.");
  }
  const existingFollow = await UserFollow.findOne({
    followerId: followerId,
    followingId: userIdToFollow,
  });
  if (existingFollow) {
    //Unfollow
    await UserFollow.findByIdAndDelete(existingFollow._id);
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { followed: false },
          "User unfollowed successfully."
        )
      );
  } else {
    //follow
    await UserFollow.create({
      followerId: followerId,
      followingId: userIdToFollow,
    });
    return res
      .status(200)
      .json(
        new ApiResponse(200, { followed: true }, "User followed successfully.")
      );
  }
});

const getUserFollowers = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user Id.");
  }

  const followers = await UserFollow.aggregate([
    {
      $match: {
        followingId: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "followerId",
        foreignField: "_id",
        as: "followerDetails",
        pipeline: [
          {
            $project: {
              username: 1,
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$followerDetails",
    },
    {
      $replaceRoot: { newRoot: "$followerDetails" },
    },
  ]);

  if (!followers) {
    throw new ApiError(404, "Could not fetch followers.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, followers, "Followers fetched successfully."));
});

const getUserFollowing = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user Id.");
  }

  const following = await UserFollow.aggregate([
    {
      $match: {
        followerId: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "followingId",
        foreignField: "_id",
        as: "followingDetails",
        pipeline: [
          {
            $project: {
              username: 1,
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$followingDetails",
    },
    {
      $replaceRoot: { newRoot: "$followingDetails" },
    },
  ]);

  if (!following) {
    throw new ApiError(404, "Could not fetch followed users.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, following, "Followed users fetched succesfully.")
    );
});

const getSuggestedUsers = asyncHandler(async (req, res) => {
  const currentUserId = req.user._id;

  // Fetch any 5 users excluding the current user
  const suggestedUsers = await User.aggregate([
    {
      $match: {
        _id: { $ne: new mongoose.Types.ObjectId(currentUserId) },
      },
    },
    {
      $project: {
        username: 1,
        fullName: 1,
        avatar: 1,
        bio: 1,
        _id: 1,
      },
    },
    {
      $sample: { size: 5 },
    },
  ]);

  if (!suggestedUsers) {
    throw new ApiError(404, "Could not fetch suggested users.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        suggestedUsers,
        "Suggested users fetched successfully."
      )
    );
});

export { toggleFollow, getUserFollowers, getUserFollowing, getSuggestedUsers };

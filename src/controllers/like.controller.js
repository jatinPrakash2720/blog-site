import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ApiError } from "../utils/ApiError.util.js";
import { Blog } from "../models/blog.model.js";
import { Like } from "../models/like.model.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";

const toggleBlogLike = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  const userId = req.user._id;

  if (!mongoose.isValidObjectId(blogId)) {
    throw new ApiError(400, "Invalid blog ID.");
  }
  const blog = await Blog.findById(blogId);
  if (!blog || blog.isDeleted) {
    throw new ApiError(404, "Blog not found");
  }

  const likeCriteria = { blog: blogId, likedBy: userId };
  const existingLike = await Like.findOne(likeCriteria);

  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);
    await Blog.findByIdAndUpdate(blogId, { $inc: { likeCount: -1 } });
    return res
      .status(200)
      .json(
        new ApiResponse(200, { liked: false }, "Blog unliked successfully.")
      );
  } else {
    await Like.create(likeCriteria);
    await Blog.findByIdAndUpdate(blogId, { $inc: { likeCount: 1 } });
    return res
      .status(200)
      .json(new ApiResponse(200, { liked: true }, "Blog liked successfully."));
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  if (!mongoose.isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment ID.");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  const likeCriteria = { comment: commentId, likedBy: userId };
  const existingLike = await Like.findOne(likeCriteria);

  if (existingLike) {
    await Like.findByIdAndUpdate(existingLike._id);
    return res
      .status(200)
      .json(
        new ApiResponse(200, { liked: false }, "Comment unliked successfully.")
      );
  } else {
    await Like.create(likeCriteria);
    return res
      .status(200)
      .json(
        new ApiResponse(200, { liked: true }, "Comment liked successfully.")
      );
  }
});

const getBlogsLikedByUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const likedBlogs = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(userId),
        blog: { $exists: true, $ne: null },
      },
    },
    {
      $lookup: {
        from: "blogs",
        localField: "blogs",
        foreignField: "_id",
        as: "blogDetails",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "ownerDetails",
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $unwind: "$ownerDetails",
          },
          {
            $project: {
              title: 1,
              thumbnail: 1,
              slug: 1,
              views: 1,
              createdAt: 1,
              owner: "$ownerDetails",
            },
          },
        ],
      },
    },
    {
      $unwind: "$blogDetails",
    },
    {
      $replaceRoot: { newRoot: "$blogDetails" },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, likedBlogs, "Liked blogs fetched successfully.")
    );
});

const getBlogLikes = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  if (!mongoose.isValidObjectId(blogId)) {
    throw new ApiError(400, "Invalid blog ID");
  }

  const likes = await Like.aggregate([
    {
      $match: {
        blog: new mongoose.Types.ObjectId(blogId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "likedBy",
        foreignField: "_id",
        as: "userDetails",
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
      $unwind: "$userDetails",
      $replaceRoot: { newRoot: "$userDetails" },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, likes, "Blog liked fetched successfully."));
});

const getCommentLikes = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  if (!mongoose.isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid Comment ID");
  }

  const likes = await Like.aggregate([
    {
      $match: {
        comment: new mongoose.Types.ObjectId(commentId),
      },
    },
    {
      $lookup: {
        from: "users",
        foreignField: "_id",
        as: "userDetails",
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
      $unwind: "$userDetails",
    },
    {
      $replaceRoot: { newRoot: "$userDetails" },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, likes, "Comment likes fetched successfully."));
});

export {
  toggleBlogLike,
  toggleCommentLike,
  getBlogsLikedByUser,
  getBlogLikes,
  getCommentLikes,
};

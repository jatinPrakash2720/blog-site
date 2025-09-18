import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ApiError } from "../utils/ApiError.util.js";
import { Blog } from "../models/blog.model.js";
import { Comment } from "../models/comment.model.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";

const getBlogComments = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!mongoose.isValidObjectId(blogId)) {
    throw new ApiError(400, "Invalid blog ID.");
  }

  const blog = await Blog.findById(blogId);
  if (!blog) {
    throw new ApiError(404, "Blog not found.");
  }

  const commentsAggregate = await Comment.aggregate([
    {
      $match: {
        blog: new mongoose.Types.ObjectId(blogId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails",
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
      $unwind: "$ownerDetails",
    },
    {
      $project: {
        ownerDetails: 0,
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
  ]);

  const comments = await Comment.aggregatePaginate(commentsAggregate, {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  });

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched successfully."));
});

const addCommentToBlogs = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  const { content } = req.body;
  const ownerId = req.user._id;

  if (!content || content.trim() === "") {
    throw new ApiError(400, "Comment content cannot be empty.");
  }

  if (!mongoose.isValidObjectId(blogId)) {
    throw new ApiError(400, "Invalid blog ID.");
  }

  const blog = await Blog.findById(blogId);

  if (!blog || blog.isDeleted) {
    throw new ApiError(404, "Blog not found or has been deleted.");
  }

  const comment = await Comment.create({
    content: content,
    blog: blogId,
    owner: ownerId,
  });

  if (!comment) {
    throw new ApiError(500, "Failed to create comment.");
  }

  await Blog.findByIdAndUpdate(blogId, { $inc: { commentCount: 1 } });
  return res
    .status(201)
    .json(new ApiResponse(201, comment, "Comment added successfully."));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  if (!mongoose.isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment ID.");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found.");
  }
  const blog = await Blog.findById(comment.blog);
  if (!blog) {
    throw new ApiError(
      404,
      "The blog associated with this comment was not found."
    );
  }
  const isCommentOwner = comment.owner.toString() === userId.toString();
  const isBlogOwner = blog.owner.toString() === userId.toString();

  if (!isCommentOwner && !isBlogOwner) {
    throw new ApiError(403, "You are not authorized to delete this comment.");
  }
  await Blog.findByIdAndUpdate(comment.blog, { $inc: { commentCount: -1 } });
  
  await Comment.findByIdAndDelete(commentId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment deleted successfully."));
});

export { getBlogComments, addCommentToBlogs, deleteComment };

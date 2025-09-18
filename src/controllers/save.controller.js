import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.util.js";
import { Save } from "../models/save.model.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import { Blog } from "../models/blog.model.js";

const createSaveCollection = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const ownerId = req.user_id;

  if (!name || name.trim() === "") {
    throw new ApiError(400, "Collection name is required.");
  }

  const existingCollection = await Save.findOne({ owner: ownerId, name: name });
  if (existingCollection) {
    throw new ApiError(409, `A collection with name ${name} already exists.`);
  }
  const collection = await Save.create({
    name: name,
    description: description || "",
    owner: ownerId,
    blogs: [],
  });
  if (!collection) {
    throw new ApiError(500, "Failed to create the collection.");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, collection, "Collection created successfully."));
});

const toggleBlogInCollection = asyncHandler(async (req, res) => {
  const { collectionId, blogId } = req.params;
  const ownerId = req.user._id;
  if (
    !mongoose.isValidObjectId(collectionId) ||
    !mongoose.isValidObjectId(blogId)
  ) {
    throw new ApiError(400, "Invalid collection or blog Id");
  }

  const collection = await Save.findById(collectionId);

  if (!collection) {
    throw new ApiError(404, "Collection not found.");
  }

  if (collection.owner.toString() !== ownerId.toString()) {
    throw new ApiError(
      403,
      "You are not authorized to modify this collection."
    );
  }

  const isBlogSaved = collection.blogs.includes(blogId);
  let updateOperation;
  let message;

  if (isBlogSaved) {
    updateOperation = { $pull: { blogs: blogId } };
    message = "Blog removed from collection";
  } else {
    updateOperation = { $addtoSet: { blogs: blogId } };
    message = "Blog added to collection.";
  }

  const updatedCollection = await Save.findByIdAndUpdate(
    collectionId,
    updateOperation,
    { new: true }
  );
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { saved: !isBlogSaved, collection: updatedCollection },
        message
      )
    );
});

const getUserCollections = asyncHandler(async (req, res) => {
  const ownerId = req.user._id;

  const collection = await Save.find({ owner: ownerId }).select(
    "name description blogs"
  );

  if (!collection) {
    throw new ApiError(404, "No collections found for this user.");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        getUserCollections,
        "User collections fetched succesfully."
      )
    );
});

const getBlogsInCollection = asyncHandler(async (req, res) => {
  const { collectionId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!mongoose.isValidObjectId(collectionId)) {
    throw new ApiError(400, "Invalid collection ID.");
  }

  const collection = await Save.findById(collectionId);

  if (!collection) {
    throw new ApiError(404, "Collection not found.");
  }

  if (collection.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to view this collection.");
  }
  const blogsAggregation = Blog.aggregate([
    {
      $match: {
        _id: { $in: collection.blogs },
      },
    },
  ]);

  const paginatedBlogs = await Blog.aggregatePaginate(blogsAggregation, {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        paginatedBlogs,
        "Blogs in collection fetched successfully."
      )
    );
});

const updateSaveCollectionName = asyncHandler(async (req, res) => {
  const { collectionId } = req.params;
  const name = req.body;

  if (!name) {
    throw new ApiError(400, "New name is required to update.");
  }

  const collection = await Save.findById(collectionId);

  if (!collection) {
    throw new ApiError(404, "Collection not found.");
  }

  if (collection.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(
      403,
      "You are not authorized to update this collection."
    );
  }
  collection.name = name;
  await collection.save({ validateBeforeSave: true });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        collection,
        "Collection's name updated successfully."
      )
    );
});

const updateSaveCollectionDescription = asyncHandler(async (req, res) => {
  const { collectionId } = req.params;
  const description = req.body;

  if (!description) {
    throw new ApiError(400, "New description is required to update.");
  }

  const collection = await Save.findById(collectionId);

  if (!collection) {
    throw new ApiError(404, "Collection not found.");
  }

  if (collection.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(
      403,
      "You are not authorized to update this collection."
    );
  }
  collection.description = description;
  await collection.save({ validateBeforeSave: true });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        collection,
        "Collection's description updated successfully."
      )
    );
});

const deleteSaveCollection = asyncHandler(async (req, res) => {
  const { collectionId } = req.params;

  const collection = await Save.findOne({
    _id: collectionId,
    owner: req.user._id,
  });
  if (!collection) {
    throw new ApiError(404, "Collection not found or you are not the owner.");
  }

  await Save.findByIdAndDelete(collectionId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Collection deleted successfully."));
});

export {
  createSaveCollection,
  toggleBlogInCollection,
  getUserCollections,
  getBlogsInCollection,
  updateSaveCollectionName,
  updateSaveCollectionDescription,
  deleteSaveCollection,
};

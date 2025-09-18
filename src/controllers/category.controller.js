import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import { ApiError } from "../utils/ApiError.util.js";
import { Category } from "../models/category.model.js";
import mongoose from "mongoose";

const createSubCategory = asyncHandler(async (req, res) => {
  try {
    const { parentId } = req.params;
    const { name, slug, description } = req.body;

    if (!mongoose.isValidObjectId(parentId)) {
      throw new ApiError(400, "Invalid parent category ID.");
    }

    if (!name || !slug) {
      throw new ApiError(400, "Sub-category name and slug are required.");
    }
    const parentCategory = await Category.findById(parentId);

    if (!parentCategory) {
      throw new ApiError(404, "Parent category not found.");
    }

    if (parentCategory !== "pre-defined") {
      throw new ApiError(
        400,
        "Cannot create a sub-category under a non-pre-defined category."
      );
    }

    const existingSubCategory = await Category.findOne({
      parent: parentId,
      slug,
    });

    if (existingSubCategory) {
      throw new ApiError(
        409,
        `Sub-category with slug ${slug} already exists under this parent.`
      );
    }

    const newSubCategory = await Category.create({
      name: name,
      slug: slug,
      parent: parentId,
      type: "user-defined",
      description:description,
    });

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          newSubCategory,
          "Sub-category created successfully."
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      error.message || "Internal Server Error during creating Sub-Category."
    );
  }
});

const getTopLevelCategories = asyncHandler(async (req, res) => {
  try {
    const topLevelCategories = await Category.find({ parent: null });

    if (!topLevelCategories) {
      throw new ApiError(404, "Top Level Categories not found.");
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          topLevelCategories,
          "Top-level categories fetched successfully."
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      error.message ||
        "Internal Server Error during fetching top level categories."
    );
  }
});

const getSubCategories = asyncHandler(async (req, res) => {
  try {
    const { parentId } = req.params;
    if (!mongoose.isValidObjectId(parentId)) {
      throw new ApiError(400, "Invalid parent Id.");
    }

    const subCategories = await Category.find({ parent: parentId });

    if (!subCategories) {
      throw new ApiError(404, "Sub-categories not found.");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          subCategories,
          "Sub-categories fetched successfully."
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      error.message || "Internal Error during fetching Sub-categories."
    );
  }
});

const getFilterableSubCategories = asyncHandler(async (req, res) => {
  // const { parentId } = req.params;
  // // const threshold = 5;
  // const threshold = parseInt(req.query.threshold, 10) || 5;

  // if (!mongoose.isValidObjectId(parentId)) {
  //   throw new ApiError(400, "Invalid parent ID.");
  // }

  // const filterableCategories = await Category.find({
  //   parent: parentId,
  //   blogCount: { $gte: threshold },
  // });

  const mainCategories = [
    {
      // Using new mongoose.Types.ObjectId() to simulate a real database ID
      _id: new mongoose.Types.ObjectId(),
      slug: "technology",
      name: "Technology",
      type: "pre-defined",
    },
    {
      _id: new mongoose.Types.ObjectId(),
      slug: "design",
      name: "Design",
      type: "pre-defined",
    },
    {
      _id: new mongoose.Types.ObjectId(),
      slug: "productivity",
      name: "Productivity",
      type: "pre-defined",
    },
  ];

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        mainCategories,
        "filterable sub-categories fetched successfully."
      )
    );
});

export {
  createSubCategory,
  getTopLevelCategories,
  getSubCategories,
  getFilterableSubCategories,
};

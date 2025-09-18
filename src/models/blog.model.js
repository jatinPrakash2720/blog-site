import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import MongooseDelete from "mongoose-delete";
import { Category } from "./category.model.js";

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    excerpt: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      required:true,
    },
    thumbnail: {
      type: String,
    },
    views: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived", "pending"],
      default: "draft",
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    likeCount: {
      type: Number,
      default: 0,
    },
    commentCount: {
      type: Number,
      default: 0,
    },
    // isDeleted: {
    //   type: Boolean,
    //   default: false,
    // },
    // deletedAt: {
    //   type: Date,
    //   default: null,
    // },
  },
  { timestamps: true }
);

blogSchema.index({ owner: 1, slug: 1 }, { unique: true });

blogSchema.plugin(mongooseAggregatePaginate);

blogSchema.plugin(MongooseDelete, {
  overrideMethods: "all",
  deletedAt: true,
});

blogSchema.pre("save", async function (next) {
  if (this.isModified("categories")) {
    if (this.isNew) {
      this._previousCategories = [];
    } else {
      const doc = await this.constructor
        .findById(this._id)
        .select("categories");
      this._previousCategories = doc
        ? doc.categories.map((c) => c.toString())
        : [];
    }
  }
  next();
});

blogSchema.post("save", async function (doc, next) {
  if (doc.isModified("categories") || doc.isNew) {
    const currentCategories = doc.categories.map((c) => c.toString());

    const addedCategories = currentCategories.filter(
      (cat) => !this._previousCategories.includes(cat)
    );
    const removedCategories = this._previousCategories.filter(
      (cat) => !currentCategories.includes(cat)
    );

    if (addedCategories.length > 0) {
      await Category.updateMany(
        { _id: { $in: addedCategories } },
        { $inc: { blogCount: 1 } }
      );
    }

    if (removedCategories.length > 0) {
      await Category.updateMany(
        { _id: { $in: removedCategories } },
        { $inc: { blogCount: -1 } }
      );
    }
  }
  next();
});

blogSchema.post("delete", async function (doc, next) {
  if (doc.categories && doc.categories.length > 0) {
    await Category.updateMany(
      { _id: { $in: doc.categories } },
      { $inc: { blogCount: -1 } }
    );
  }
  next();
});

blogSchema.post("restore", async function (doc, next) {
  if (doc.categories && doc.categories.length > 0) {
    await Category.updateMany(
      { _id: { $in: doc.categories } },
      { $inc: { blogCount: 1 } }
    );
  }
  next();
});

export const Blog = mongoose.model("Blog", blogSchema);

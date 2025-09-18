import mongoose, { Schema } from "mongoose";
import mongooseDelete from "mongoose-delete";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    type: {
      type: String,
      enum: ["pre-defined", "user-defined"],
      default: "user-defined",
    },
    blogCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

categorySchema.index({ slug: 1, parent: 1 }, { unique: true });

categorySchema.plugin(mongooseDelete, {
  overrideMethods: "all",
  deletedAt: true,
});

export const Category = mongoose.model("Category", categorySchema);

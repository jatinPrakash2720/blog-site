import mongoose, { Schema } from "mongoose";
import mongooseDelete from "mongoose-delete";

const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    blog: {
      type: Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

commentSchema.plugin(mongooseDelete, {
  overrideMethods: "all",
  deleteAt: true,
});

export const Comment = mongoose.model("Comment", commentSchema);

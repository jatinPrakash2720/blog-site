import mongoose, { Schema } from "mongoose";
import MongooseDelete from "mongoose-delete";

const likeSchema = new Schema(
  {
    blog: {
      type: Schema.Types.ObjectId,
      ref: "Blog",
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
    likedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

likeSchema.index(
  { blog: 1, likedBy: 1 },
  { unique: true, partialFilterExpression: { blog: { $exists: true } } }
);
likeSchema.index(
  { comment: 1, likedBy: 1 },
  { unique: true, partialFilterExpression: { comment: { $exists: true } } }
);
likeSchema.plugin(MongooseDelete, { overrideMethods: "all", deletedAt: true });

export const Like = mongoose.model("Like", likeSchema);

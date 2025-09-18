import mongoose, { Schema } from "mongoose";
import MongooseDelete from "mongoose-delete";

const userFollowSchema = new Schema(
  {
    followerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    followingId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

userFollowSchema.index({ followerId: 1, followingId: 1 }, { unique: true });
userFollowSchema.plugin(MongooseDelete, {
  overrideMethods: "all",
  deletedAt: true,
});
export const UserFollow = mongoose.model("UserFollow", userFollowSchema);

import mongoose, { Schema } from "mongoose";
import mongooseDelete from "mongoose-delete";

const saveSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    blog: [
      {
        type: Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

saveSchema.plugin(mongooseDelete, { overrideMethods: "all", deletedAt: true });

export const Save = mongoose.model("Save", saveSchema);

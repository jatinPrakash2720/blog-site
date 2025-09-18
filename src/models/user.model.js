import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import MongooseDelete from "mongoose-delete";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String, // cloudinary URL
    },
    coverImage: {
      type: String, //cloudinary URL
    },
    bio: {
      type: String,
      required: false,
    },
    readHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],
    googleId: {
      type: String,
    },
    githubId: {
      // <-- ADD THIS
      type: String,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId && !this.githubId;
      },
    },
    refreshToken: {
      type: String,
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  console.log("--- PRE-SAVE HOOK TRIGGERED ---"); // <-- Add this line
  console.log("Is password modified?", this.isModified("password")); // <-- And this line
  if (!this.isModified("password")) return next();
  // ✅ Corrected: Added 'await' to wait for the hashing to finish
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  console.log(password);
  console.log(this.password);
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generatePasswordResetToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.forgotPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.forgotPasswordExpiry = Date.now() + 10 * 60 * 1000; //TOken expires in 10 minutes

  return resetToken;
};
userSchema.plugin(MongooseDelete, { overrideMethods: "all", deleteAt: true });
export const User = mongoose.model("User", userSchema);

import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    profilepic: String,
    name: {
      type: String,
      required: true,
    },
    bio: String,
    phoneNumber: Number,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    refreshTokens: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", UserSchema);

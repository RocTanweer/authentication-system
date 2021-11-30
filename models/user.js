import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    photo: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      default: "",
    },
    phone: {
      type: Number,
      default: 0,
    },
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

import express from "express";
import {
  userRegistration,
  userLogin,
  getUserProfile,
  patchUserProfile,
  handleEveryrouteElse,
} from "../controllers/user.js";

const router = express.Router();

router.post("/register", userRegistration);
router.post("/login", userLogin);
router.get("/profile/:userId", getUserProfile);
router.patch("/profile/:userId", patchUserProfile);
router.get("*", handleEveryrouteElse);

export default router;

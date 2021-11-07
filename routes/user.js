import express from "express";
import {
  userRegistration,
  userLogin,
  userLogout,
  getUserProfile,
  patchUserProfile,
  handleEveryrouteElse,
} from "../controllers/user.js";
import { checkForAuthorizationToken } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", userRegistration);
router.post("/login", userLogin);
router.delete("/logout", userLogout);
router.get("/profile/:userId", checkForAuthorizationToken, getUserProfile);
router.patch("/profile/:userId", checkForAuthorizationToken, patchUserProfile);
router.get("*", handleEveryrouteElse);

export default router;

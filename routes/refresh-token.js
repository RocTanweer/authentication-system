import express from "express";
import { getAccessTokenUsingRefreshToken } from "../controllers/refresh-token.js";

const router = express.Router();

router.post("/", getAccessTokenUsingRefreshToken);

export default router;

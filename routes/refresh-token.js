import express from "express";
import { getAccessTokenUsingRefreshToken } from "../controllers/refresh-token";

const router = express.Router();

router.post("/", getAccessTokenUsingRefreshToken);

export default router;

import express from "express";
import jsonwebtoken from "jsonwebtoken";
import { User } from "../models/user.js";
import { REFRESH_TOKEN_SECRET } from "../config/envVar.js";
import { generateAccessToken } from "../utils/functions.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { refreshToken, id } = req.body;
    if (!(refreshToken && id)) {
      res.status(400);
      throw new Error("Either id or refresh token is not present");
    }
    // check if a user exist with that userId and there is a refresh token in the body
    const userFromDB = await User.findOne({ _id: id });
    if (!userFromDB) {
      res.status(400);
      throw new Error("No user found for this id");
    }
    // check if token exist in that user data
    if (!userFromDB.refreshTokens.includes(refreshToken)) {
      res.status(400);
      throw new Error("Refresh token did not match for this User");
    }

    // verify the token
    jsonwebtoken.verify(
      refreshToken,
      REFRESH_TOKEN_SECRET,
      (err, tokenPayload) => {
        if (err) {
          res.status(400).json({ ...err });
          // to ensure that id and refresh token belongs to the same User
        } else if (tokenPayload.id !== id) {
          res.status(400).json({ message: "Unauthorized Token" });
        } else {
          // generate access token
          const accessToken = generateAccessToken(tokenPayload.id);
          // send access token
          res.status(200).json({ accessToken });
        }
      }
    );
  } catch (err) {
    res.json(err.message);
  }
});

export default router;

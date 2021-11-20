import jsonwebtoken from "jsonwebtoken";
import { User } from "../models/user.js";
import { REFRESH_TOKEN_SECRET } from "../config/envVar.js";
import { generateAccessToken } from "../utils/functions.js";

export const getAccessTokenUsingRefreshToken = async (req, res) => {
  try {
    const { refreshToken, id } = req.body;
    if (!(refreshToken && id)) {
      res.status(401);
      throw new Error(
        "Unauthorized, Either id or refresh token is not present"
      );
    }
    // check if a user exist with that userId and there is a refresh token in the body
    const userFromDB = await User.findOne({ _id: id });
    if (!userFromDB) {
      res.status(401);
      throw new Error("Unauthorized, No user found for this id");
    }
    // check if token exist in that user data
    if (!userFromDB.refreshTokens.includes(refreshToken)) {
      res.status(401);
      throw new Error(
        "Unauthorized, Refresh token did not match for this User"
      );
    }

    // verify the token
    jsonwebtoken.verify(
      refreshToken,
      REFRESH_TOKEN_SECRET,
      (err, tokenPayload) => {
        if (err) {
          res.status(401).json({
            ...err,
            message: "Unauthorized, Token can not be verified",
          });
          // to ensure that id and refresh token belongs to the same User
        } else if (tokenPayload.id !== id) {
          res
            .status(401)
            .json({
              message: "Unauthorized,Token does not belong to this user",
            });
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
};

import jsonwebtoken from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../config/envVar.js";

export const checkForAuthorizationToken = (req, res, next) => {
  const token = req.headers["authorization"].split(" ")[1];
  if (!token) {
    res
      .status(401)
      .json({ message: "Unauthorized, No Access Token is provided!" });
  }
  jsonwebtoken.verify(token, ACCESS_TOKEN_SECRET, (err, tokenPayload) => {
    if (err) {
      res
        .status(401)
        .json({ ...err, message: "Unauthorized, Token has expired" });
      // to ensure that id and refresh token belongs to the same User
    } else if (tokenPayload.id !== req.params.userId) {
      res
        .status(401)
        .json({ message: "Unauthorized, Token does not belong to this user" });
    } else {
      next();
    }
  });
};

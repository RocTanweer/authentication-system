import jsonwebtoken from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../config/envVar.js";

export const generateAccessToken = (id) => {
  return jsonwebtoken.sign({ id: id }, ACCESS_TOKEN_SECRET, {
    expiresIn: "60s",
  });
};

export const generateRefreshToken = (id) => {
  return jsonwebtoken.sign({ id: id }, REFRESH_TOKEN_SECRET);
};

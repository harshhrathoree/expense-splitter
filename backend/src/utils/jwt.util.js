import jwt from "jsonwebtoken";
import config from "../config/config.js";

export const generateAccessToken = (userId) => {
  return jwt.sign(
    { userId },
    config.JWT_SECRET,
    {
      expiresIn: "15m",
    }
  );
};

export const verifyAccessToken = (token) => {
    return jwt.verify(
      token,
      config.JWT_SECRET
    );
  };

  export const generateRefreshToken = (
    userId,
    sessionId
  ) => {
    return jwt.sign(
      {
        userId,
        sessionId,
      },
      config.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
  };

  export const verifyRefreshToken = (token) => {
    return jwt.verify(
      token,
      config.JWT_SECRET
    );
  };
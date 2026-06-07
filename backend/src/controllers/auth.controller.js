import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import Session from "../models/session.model.js";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../utils/jwt.util.js";
import { cookieOptions } from "../utils/cookieOptions.js";

export const register = async (req, res) => {
  try {
    const { name, email, mobileNumber, password } = req.body;

    if (!name || !email || !mobileNumber || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { mobileNumber }],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      mobileNumber,
      password: hashedPassword,
    });

    const session = await Session.create({
      user: user._id,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    const accessToken = generateAccessToken(user._id);

    const refreshToken = generateRefreshToken(user._id, session._id);

    session.refreshTokenHash = await bcrypt.hash(refreshToken, 10);

    await session.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
      }
  
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }
  
      const isPasswordValid = await bcrypt.compare(
        password,
        user.password
      );
  
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }
  
      const session = await Session.create({
        user: user._id,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
        refreshTokenHash: "temp",
      });
  
      const accessToken = generateAccessToken(user._id);
  
      const refreshToken = generateRefreshToken(
        user._id,
        session._id
      );
  
      session.refreshTokenHash = await bcrypt.hash(
        refreshToken,
        10
      );
  
      await session.save();
  
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
  
      return res.status(200).json({
        success: true,
        message: "Login successful",
        accessToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          mobileNumber: user.mobileNumber,
        },
        sessionid:session._id,
        accessToken
      });
    } catch (error) {
      console.error(error);
  
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };


  export const refreshToken = async (
    req,
    res
  ) => {
    try {
      const refreshToken =
        req.cookies.refreshToken;
  
      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: "Refresh token missing",
        });
      }
  
      const decoded =
        verifyRefreshToken(refreshToken);
  
      const session =
        await Session.findOne({
          _id: decoded.sessionId,
          user: decoded.userId,
        });
  
      if (!session) {
        return res.status(401).json({
          success: false,
          message: "Session not found",
        });
      }
  
      if (session.revoked) {
        return res.status(401).json({
          success: false,
          message: "Session revoked",
        });
      }

      
  
      const isValidToken =
        await bcrypt.compare(
          refreshToken,
          session.refreshTokenHash
        );
  
      if (!isValidToken) {
        return res.status(401).json({
          success: false,
          message: "Invalid refresh token",
        });
      }

      const user = await User.findById(
        decoded.userId
      ).select("-password");
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
  
      const newAccessToken =
        generateAccessToken(
          decoded.userId
        );
  
      const newRefreshToken =
        generateRefreshToken(
          decoded.userId,
          decoded.sessionId
        );
  
      session.refreshTokenHash =
        await bcrypt.hash(
          newRefreshToken,
          10
        );
  
      await session.save();
  
      res.cookie(
        "refreshToken",
        newRefreshToken,
        cookieOptions
      );
  
      return res.status(200).json({
        success: true,
        accessToken:
          newAccessToken,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            mobileNumber:
              user.mobileNumber,
          }
          
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid or expired refresh token",
      });
    }
  };



  export const logout = async (req, res) => {
    try {
      const refreshToken =
        req.cookies.refreshToken;
  
      if (!refreshToken) {
        return res.status(200).json({
          success: true,
          message: "Logged out successfully",
        });
      }
  
      const decoded =
        verifyRefreshToken(refreshToken);
  
      await Session.findByIdAndUpdate(
        decoded.sessionId,
        {
          revoked: true,
        }
      );
  
      res.clearCookie(
        "refreshToken",
        cookieOptions
      );
  
      return res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      res.clearCookie(
        "refreshToken",
        cookieOptions
      );
  
      return res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    }
  };



  export const logoutAllDevices = async (
    req,
    res
  ) => {
    try {
      await Session.updateMany(
        {
          user: req.user._id,
        },
        {
          revoked: true,
        }
      );
  
      res.clearCookie(
        "refreshToken",
        cookieOptions
      );
  
      return res.status(200).json({
        success: true,
        message:
          "Logged out from all devices successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };



  export const getCurrentUser = async (req, res) => {
    try {
      return res.status(200).json({
        success: true,
        user: req.user,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
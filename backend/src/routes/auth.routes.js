import { Router } from "express";

import {
  register,login,refreshToken,logout,logoutAllDevices,getCurrentUser
} from "../controllers/auth.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

// Public Routes
router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);

// Protected Routes
router.get(
    "/me",
    authMiddleware,
    getCurrentUser
  );

router.post("/logout", logout);

router.post(
  "/logout-all",
  authMiddleware,
  logoutAllDevices
);

export default router;
import { Router } from "express";

import { searchUserByMobileNumber } from "../controllers/user.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/search", authMiddleware, searchUserByMobileNumber);

export default router;

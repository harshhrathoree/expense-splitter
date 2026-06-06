
import { Router } from "express";

import {
deleteSettlement,updateSettlement
} from "../controllers/settlement.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();


router.delete(
    "/:settlementId",
    authMiddleware,
    deleteSettlement
  );


router.put(
    "/:settlementId",
    authMiddleware,
    updateSettlement
  );

 export default router
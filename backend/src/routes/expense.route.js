import { Router } from "express";

import {
  getExpenseById,
  deleteExpense,updateExpense
} from "../controllers/expense.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.get(
  "/:expenseId",
  authMiddleware,
  getExpenseById
);

router.delete(
  "/:expenseId",
  authMiddleware,
  deleteExpense
);

router.put(
    "/:expenseId",
    authMiddleware,
    updateExpense
  );

export default router;
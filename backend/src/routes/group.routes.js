import { Router } from "express";

import {
  createGroup,getMyGroups,getGroupById,addMemberToGroup,getGroupMembers,removeMember,leaveGroup,deleteGroup,createExpense,getGroupExpenses,getGroupBalances,createSettlement,getGroupSettlements,getGroupSummary
} from "../controllers/group.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();


router.post(
    "/",
    authMiddleware,
    createGroup
  );
  
  router.get(
    "/",
    authMiddleware,
    getMyGroups
  );
  
  router.get(
    "/:groupId",
    authMiddleware,
    getGroupById
  );


  router.post(
    "/:groupId/members",
    authMiddleware,
    addMemberToGroup
  );

  router.get(
    "/:groupId/members",
    authMiddleware,
    getGroupMembers
  );

  router.delete(
    "/:groupId/members/:memberId",
    authMiddleware,
    removeMember
  );

  router.post(
    "/:groupId/leave",
    authMiddleware,
    leaveGroup
  );

  router.delete(
    "/:groupId",
    authMiddleware,
    deleteGroup
  );

  router.post(
    "/:groupId/expenses",
    authMiddleware,
    createExpense
  );

  router.get(
    "/:groupId/expenses",
    authMiddleware,
    getGroupExpenses
  );

  router.get(
    "/:groupId/balances",
    authMiddleware,
    getGroupBalances
  );

  router.post(
    "/:groupId/settlements",
    authMiddleware,
    createSettlement
  );


  router.get(
    "/:groupId/settlements",
    authMiddleware,
    getGroupSettlements
  );



  router.get(
    "/:groupId/summary",
    authMiddleware,
    getGroupSummary
  );
  

  export default router;
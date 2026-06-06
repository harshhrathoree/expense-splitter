import Group from "../models/group.model.js"
import User from "../models/user.model.js";
import Expense from "../models/expense.model.js";
import Settlement from "../models/settlement.model.js";



export const deleteSettlement =
  async (req, res) => {
    try {
      const { settlementId } =
        req.params;

      const settlement =
        await Settlement.findById(
          settlementId
        );

      if (!settlement) {
        return res.status(404).json({
          success: false,
          message:
            "Settlement not found",
        });
      }

      if (
        settlement.createdBy.toString() !==
        req.user._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Only creator can delete settlement",
        });
      }

      await Settlement.findByIdAndDelete(
        settlementId
      );

      return res.status(200).json({
        success: true,
        message:
          "Settlement deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };


  export const updateSettlement = async (
    req,
    res
  ) => {
    try {
      const { settlementId } = req.params;
  
      const {
        fromUser,
        toUser,
        amount,
      } = req.body;
  
      const settlement =
        await Settlement.findById(
          settlementId
        );
  
      if (!settlement) {
        return res.status(404).json({
          success: false,
          message:
            "Settlement not found",
        });
      }
  
      if (
        settlement.createdBy.toString() !==
        req.user._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Only creator can update settlement",
        });
      }
  
      if (
        !fromUser ||
        !toUser ||
        !amount
      ) {
        return res.status(400).json({
          success: false,
          message:
            "All fields are required",
        });
      }
  
      if (fromUser === toUser) {
        return res.status(400).json({
          success: false,
          message:
            "fromUser and toUser cannot be same",
        });
      }
  
      if (amount <= 0) {
        return res.status(400).json({
          success: false,
          message:
            "Amount must be greater than 0",
        });
      }
  
      const group =
        await Group.findById(
          settlement.group
        );
  
      const groupMemberIds =
        group.members.map((member) =>
          member.user.toString()
        );
  
      if (
        !groupMemberIds.includes(
          fromUser
        ) ||
        !groupMemberIds.includes(
          toUser
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Users must belong to the group",
        });
      }
  
      settlement.fromUser =
        fromUser;
  
      settlement.toUser =
        toUser;
  
      settlement.amount =
        amount;
  
      await settlement.save();
  
      return res.status(200).json({
        success: true,
        message:
          "Settlement updated successfully",
        settlement,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };
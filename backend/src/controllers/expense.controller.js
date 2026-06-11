import Expense from "../models/expense.model.js";
import Group from "../models/group.model.js";


export const getExpenseById = async (
    req,
    res
  ) => {
    try {
      const { expenseId } = req.params;
  
      const expense =
        await Expense.findById(
          expenseId
        )
          .populate(
            "paidBy",
            "name email mobileNumber"
          )
          .populate(
            "createdBy",
            "name email mobileNumber"
          )
          .populate(
            "participants.user",
            "name email mobileNumber"
          );
  
      if (!expense) {
        return res.status(404).json({
          success: false,
          message: "Expense not found",
        });
      }
  
      const group =
        await Group.findById(
          expense.group
        );
  
      const isMember =
        group.members.some(
          (member) =>
            member.user.toString() ===
            req.user._id.toString()
        );
  
      if (!isMember) {
        return res.status(403).json({
          success: false,
          message:
            "You are not a member of this group",
        });
      }
  
      return res.status(200).json({
        success: true,
        expense,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  export const deleteExpense = async (
    req,
    res
  ) => {
    try {
      const { expenseId } = req.params;
  
      const expense =
        await Expense.findById(
          expenseId
        );
  
      if (!expense) {
        return res.status(404).json({
          success: false,
          message: "Expense not found",
        });
      }
  
      if (
        expense.createdBy.toString() !==
        req.user._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Only the creator can delete this expense",
        });
      }
  
      const group =
      await Group.findById(
        expense.group
      );
    
    await Expense.findByIdAndDelete(
      expenseId
    );
    
    await invalidateDashboardCache(
      group
    );
  
      return res.status(200).json({
        success: true,
        message:
          "Expense deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };



  export const updateExpense = async (
    req,
    res
  ) => {
    try {
      const { expenseId } =
        req.params;
  
      const {
        title,
        description,
        amount,
        paidBy,
        participants,
      } = req.body;
  
      const expense =
        await Expense.findById(
          expenseId
        );
  
      if (!expense) {
        return res.status(404).json({
          success: false,
          message:
            "Expense not found",
        });
      }
  
      if (
        expense.createdBy.toString() !==
        req.user._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Only creator can update expense",
        });
      }
  
      const group =
        await Group.findById(
          expense.group
        );
  
      const groupMemberIds =
        group.members.map(
          (member) =>
            member.user.toString()
        );
  
      if (
        !groupMemberIds.includes(
          paidBy
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "PaidBy user must belong to group",
        });
      }
  
      let formattedParticipants =
        [];
  
      if (
        expense.splitType ===
        "equal"
      ) {
        for (const userId of participants) {
          if (
            !groupMemberIds.includes(
              userId
            )
          ) {
            return res.status(400).json({
              success: false,
              message:
                "Participant must belong to group",
            });
          }
        }
  
        const shareAmount =
          Number(amount) /
          participants.length;
  
        formattedParticipants =
          participants.map(
            (userId) => ({
              user: userId,
              shareAmount,
            })
          );
      }
  
      else if (
        expense.splitType ===
        "exact"
      ) {
        let totalShare = 0;
  
        for (const participant of participants) {
          if (
            !groupMemberIds.includes(
              participant.user
            )
          ) {
            return res.status(400).json({
              success: false,
              message:
                "Participant must belong to group",
            });
          }
  
          totalShare +=
            participant.shareAmount;
        }
  
        if (
          Number(totalShare) !==
          Number(amount)
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Shares must equal amount",
          });
        }
  
        formattedParticipants =
          participants;
      }
  
      expense.title =
        title || expense.title;
  
      expense.description =
        description ??
        expense.description;
  
      expense.amount =
        amount || expense.amount;
  
      expense.paidBy =
        paidBy || expense.paidBy;
  
      expense.participants =
        formattedParticipants;
  
      await expense.save();

      await invalidateDashboardCache(
        group
      );
  
      return res.status(200).json({
        success: true,
        message:
          "Expense updated successfully",
        expense,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };
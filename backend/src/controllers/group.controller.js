import Group from "../models/group.model.js";
import User from "../models/user.model.js";
import Expense from "../models/expense.model.js";
import Settlement from "../models/settlement.model.js";
import { calculateGroupBalances } from "../utils/calculateGroupBalances.js";
import {
  invalidateDashboardCache,
} from "../utils/invalidateDashboardCache.js";
export const createGroup = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Group name is required",
      });
    }

    const group = await Group.create({
      name: name.trim(),
      description: description?.trim() || "",

      createdBy: req.user._id,

      members: [
        {
          user: req.user._id,
          role: "admin",
        },
      ],
    });

    await invalidateDashboardCache(
      group
    );

    return res.status(201).json({
      success: true,
      message: "Group created successfully",
      group,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyGroups = async (req, res) => {
  try {
    const groups = await Group.find({
      "members.user": req.user._id,
    })
      .select("name description members createdAt")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: groups.length,
      groups,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getGroupById = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId)
      .populate("createdBy", "name email mobileNumber")
      .populate("members.user", "name email mobileNumber");

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    const isMember = group.members.some(
      (member) => member.user._id.toString() === req.user._id.toString(),
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this group",
      });
    }

    return res.status(200).json({
      success: true,
      group,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const addMemberToGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { mobileNumber } = req.body;

    if (!mobileNumber) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is required",
      });
    }

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    const currentMember = group.members.find(
      (member) => member.user.toString() === req.user._id.toString(),
    );

    if (!currentMember) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this group",
      });
    }

    if (currentMember.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can add members",
      });
    }

    const userToAdd = await User.findOne({
      mobileNumber,
    });

    if (!userToAdd) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isAlreadyMember = group.members.some(
      (member) => member.user.toString() === userToAdd._id.toString(),
    );

    if (isAlreadyMember) {
      return res.status(409).json({
        success: false,
        message: "User is already a member of this group",
      });
    }

    group.members.push({
      user: userToAdd._id,
      role: "member",
    });

    await group.save();

    await group.populate("createdBy", "name email mobileNumber");

    await group.populate("members.user", "name email mobileNumber");

    await invalidateDashboardCache(group);
     

    return res.status(200).json({
      success: true,
      message: "Member added successfully",
      group,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getGroupMembers = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId).populate(
      "members.user",
      "name email mobileNumber profilePicture",
    );

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    const isMember = group.members.some(
      (member) => member.user._id.toString() === req.user._id.toString(),
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this group",
      });
    }

    return res.status(200).json({
      success: true,
      count: group.members.length,
      members: group.members,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeMember = async (req, res) => {
  try {
    const { groupId, memberId } = req.params;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    const currentMember = group.members.find(
      (member) => member.user.toString() === req.user._id.toString(),
    );

    if (!currentMember) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this group",
      });
    }

    if (currentMember.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can remove members",
      });
    }

    if (memberId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Admin cannot remove himself",
      });
    }

    const memberExists = group.members.some(
      (member) => member.user.toString() === memberId,
    );

    if (!memberExists) {
      return res.status(404).json({
        success: false,
        message: "Member not found in group",
      });
    }

    group.members = group.members.filter(
      (member) => member.user.toString() !== memberId,
    );

    await group.save();

    return res.status(200).json({
      success: true,
      message: "Member removed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const leaveGroup = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    const currentMember = group.members.find(
      (member) => member.user.toString() === req.user._id.toString(),
    );

    if (!currentMember) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this group",
      });
    }

    if (currentMember.role === "admin") {
      return res.status(400).json({
        success: false,
        message: "Admin cannot leave the group. Transfer admin role first.",
      });
    }

    // ─── Check user balance using existing utility ───
    const expenses = await Expense.find({ group: groupId });
    const settlements = await Settlement.find({ group: groupId });

    const { netBalances } = calculateGroupBalances(group, expenses, settlements);

    // Find current user's net balance
    const userBalance = netBalances.find(
      (b) => b.user.id.toString() === req.user._id.toString()
    );

    if (userBalance && userBalance.amount !== 0) {
      const message = userBalance.amount > 0
        ? `You are owed ₹${userBalance.amount.toFixed(2)}. Settle all balances before leaving.`
        : `You owe ₹${Math.abs(userBalance.amount).toFixed(2)}. Settle all balances before leaving.`;

      return res.status(400).json({
        success: false,
        message,
      });
    }
    // ─── End balance check ───

    await invalidateDashboardCache(group);

    group.members = group.members.filter(
      (member) => member.user.toString() !== req.user._id.toString(),
    );

    await group.save();

    return res.status(200).json({
      success: true,
      message: "Left group successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    const currentMember = group.members.find(
      (member) => member.user.toString() === req.user._id.toString(),
    );

    if (!currentMember) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this group",
      });
    }

    if (currentMember.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can delete the group",
      });
    }

    // ─── Check if all members are settled ───
    const expenses = await Expense.find({ group: groupId });
    const settlements = await Settlement.find({ group: groupId });

    const { netBalances } = calculateGroupBalances(group, expenses, settlements);

    // Check if anyone has a non-zero balance
    const unsettledMembers = netBalances.filter((b) => b.amount !== 0);

    if (unsettledMembers.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete group. Unsettled balances exist. Please settle all balances first.`,
      });
    }

    // ─── Invalidate dashboard cache for ALL members BEFORE deleting ───
    await invalidateDashboardCache(group);

    // ─── Delete all related data ───
    await Promise.all([
      Expense.deleteMany({ group: groupId }),
      Settlement.deleteMany({ group: groupId }),
    ]);

    // ─── Delete the group ───
    await Group.findByIdAndDelete(groupId);

    return res.status(200).json({
      success: true,
      message: "Group deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createExpense = async (req, res) => {
  try {
    const { groupId } = req.params;

    const { title, description, amount, paidBy, splitType, participants } =
      req.body;

    if (!title || !amount || !paidBy || !splitType || !participants) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    const isMember = group.members.some(
      (member) => member.user.toString() === req.user._id.toString(),
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this group",
      });
    }

    const groupMemberIds = group.members.map((member) =>
      member.user.toString(),
    );

    let formattedParticipants = [];

    // EQUAL SPLIT
    if (splitType === "equal") {
      if (!Array.isArray(participants) || participants.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Participants are required",
        });
      }

      for (const userId of participants) {
        if (!groupMemberIds.includes(userId.toString())) {
          return res.status(400).json({
            success: false,
            message: "All participants must belong to the group",
          });
        }
      }

      const shareAmount = Number(amount) / participants.length;

      formattedParticipants = participants.map((userId) => ({
        user: userId,
        shareAmount,
      }));
    }

    // EXACT SPLIT
    else if (splitType === "exact") {
      let totalShare = 0;

      for (const participant of participants) {
        if (!groupMemberIds.includes(participant.user.toString())) {
          return res.status(400).json({
            success: false,
            message: "All participants must belong to the group",
          });
        }

        totalShare += participant.shareAmount;
      }

      if (Number(totalShare) !== Number(amount)) {
        return res.status(400).json({
          success: false,
          message: "Sum of shares must equal total amount",
        });
      }

      formattedParticipants = participants;
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid split type",
      });
    }

    const expense = await Expense.create({
      group: groupId,
      title,
      description,
      amount,
      paidBy,
      splitType,
      participants: formattedParticipants,
      createdBy: req.user._id,
    });

    await expense.populate("paidBy", "name email mobileNumber");

    await expense.populate("createdBy", "name email mobileNumber");

    await expense.populate("participants.user", "name email mobileNumber");
    await invalidateDashboardCache(
      group
    );

    return res.status(201).json({
      success: true,
      message: "Expense created successfully",
      expense,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getGroupExpenses = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    const isMember = group.members.some(
      (member) => member.user.toString() === req.user._id.toString(),
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this group",
      });
    }

    const expenses = await Expense.find({
      group: groupId,
    })
      .populate("paidBy", "name email mobileNumber")
      .populate("createdBy", "name email mobileNumber")
      .populate("participants.user", "name email mobileNumber")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: expenses.length,
      expenses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getGroupBalances = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId).populate(
      "members.user",
      "name email mobileNumber",
    );

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    const isMember = group.members.some(
      (member) => member.user._id.toString() === req.user._id.toString(),
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this group",
      });
    }

    const expenses = await Expense.find({
      group: groupId,
    });

    const settlements = await Settlement.find({
      group: groupId,
    });

    const { netBalances, balances } = calculateGroupBalances(
      group,
      expenses,
      settlements,
    );

    return res.status(200).json({
      success: true,
      netBalances,
      balances,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createSettlement = async (req, res) => {
  try {
    const { groupId } = req.params;

    const { fromUser, toUser, amount } = req.body;

    if (!fromUser || !toUser || !amount) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (fromUser === toUser) {
      return res.status(400).json({
        success: false,
        message: "fromUser and toUser cannot be same",
      });
    }

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    const requesterIsMember = group.members.some(
      (member) => member.user.toString() === req.user._id.toString(),
    );

    if (!requesterIsMember) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this group",
      });
    }

    const groupMemberIds = group.members.map((member) =>
      member.user.toString(),
    );

    if (
      !groupMemberIds.includes(fromUser) ||
      !groupMemberIds.includes(toUser)
    ) {
      return res.status(400).json({
        success: false,
        message: "Users must belong to the group",
      });
    }

    const settlement = await Settlement.create({
      group: groupId,
      fromUser,
      toUser,
      amount,
      createdBy: req.user._id,
    });

    await settlement.populate("fromUser", "name email mobileNumber");

    await settlement.populate("toUser", "name email mobileNumber");

    await settlement.populate("createdBy", "name email mobileNumber");

    await invalidateDashboardCache(
      group
    );

    return res.status(201).json({
      success: true,
      message: "Settlement created successfully",
      settlement,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getGroupSettlements = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    const isMember = group.members.some(
      (member) => member.user.toString() === req.user._id.toString(),
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this group",
      });
    }

    const settlements = await Settlement.find({
      group: groupId,
    })
      .populate("fromUser", "name email mobileNumber")
      .populate("toUser", "name email mobileNumber")
      .populate("createdBy", "name email mobileNumber")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: settlements.length,
      settlements,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getGroupSummary = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    const isMember = group.members.some(
      (member) => member.user.toString() === req.user._id.toString(),
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this group",
      });
    }

    const expenseCount = await Expense.countDocuments({
      group: groupId,
    });

    const settlementCount = await Settlement.countDocuments({
      group: groupId,
    });

    const expenses = await Expense.find({ group: groupId }, "amount");

    const settlements = await Settlement.find({ group: groupId }, "amount");

    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0,
    );

    const totalSettlements = settlements.reduce(
      (sum, settlement) => sum + settlement.amount,
      0,
    );

    return res.status(200).json({
      success: true,
      summary: {
        groupName: group.name,
        memberCount: group.members.length,
        expenseCount,
        settlementCount,
        totalExpenses,
        totalSettlements,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

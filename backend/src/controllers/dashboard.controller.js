import Group from "../models/group.model.js";
import Expense from "../models/expense.model.js";
import Settlement from "../models/settlement.model.js";

import { calculateGroupBalances }
from "../utils/calculateGroupBalances.js";

export const getDashboard =
  async (req, res) => {

    try {

      const groups =
        await Group.find({
          "members.user":
            req.user._id,
        }).populate(
          "members.user",
          "name email mobileNumber"
        );

      let totalOwed = 0;
      let totalOwes = 0;

      const groupBalances =
        [];

      for (
        const group
        of groups
      ) {

        const expenses =
          await Expense.find({
            group:
              group._id,
          });

        const settlements =
          await Settlement.find({
            group:
              group._id,
          });

        const {
          netBalances,
        } =
          calculateGroupBalances(
            group,
            expenses,
            settlements
          );

        const myBalance =
          netBalances.find(
            (balance) =>
              balance.user.id.toString() ===
              req.user._id.toString()
          );

        const amount =
          myBalance?.amount || 0;

        if (
          amount > 0
        ) {
          totalOwed +=
            amount;
        }

        if (
          amount < 0
        ) {
          totalOwes +=
            Math.abs(
              amount
            );
        }

        groupBalances.push({
          groupId:
            group._id,

          groupName:
            group.name,

          balance:
            amount,
        });
      }

      return res.status(200).json({
        success: true,

        summary: {

          totalGroups:
            groups.length,

          totalOwed:
            Number(
              totalOwed.toFixed(
                2
              )
            ),

          totalOwes:
            Number(
              totalOwes.toFixed(
                2
              )
            ),

          netBalance:
            Number(
              (
                totalOwed -
                totalOwes
              ).toFixed(2)
            ),
        },

        groups:
          groupBalances,
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }
  };
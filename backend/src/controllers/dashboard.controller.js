import Group from "../models/group.model.js";
import Expense from "../models/expense.model.js";
import Settlement from "../models/settlement.model.js";
import redisClient from "../config/redis.js";

import { calculateGroupBalances }
from "../utils/calculateGroupBalances.js";

export const getDashboard =
  async (req, res) => {

    try {

      const cacheKey =
  `dashboard:${req.user._id}`;

const cachedDashboard =
  await redisClient.get(cacheKey);

if (cachedDashboard) {
  console.log(
    `Redis HIT for ${cacheKey}`
  );

  return res.status(200).json(
    JSON.parse(cachedDashboard)
  );
}

console.log(
  `Redis MISS for ${cacheKey}`
);

const groups =
await Group.find({
  "members.user":
    req.user._id,
}).populate(
  "members.user",
  "name email mobileNumber"
);

const groupIds =
  groups.map(
    group => group._id
  );

const allExpenses =
  await Expense.find({
    group: {
      $in: groupIds,
    },
  });

const allSettlements =
  await Settlement.find({
    group: {
      $in: groupIds,
    },
  });

      let totalOwed = 0;
      let totalOwes = 0;

      const groupBalances =
        [];

      for (
        const group
        of groups
      ) {

        const expenses =
        allExpenses.filter(
          expense =>
            expense.group.toString() ===
            group._id.toString()
        );
    
      const settlements =
        allSettlements.filter(
          settlement =>
            settlement.group.toString() ===
            group._id.toString()
        );
    
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

      const response = {
        success: true,
      
        summary: {
          totalGroups:
            groups.length,
      
          totalOwed:
            Number(
              totalOwed.toFixed(2)
            ),
      
          totalOwes:
            Number(
              totalOwes.toFixed(2)
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
      };

      
      try {

        console.log(
          `Saving dashboard to Redis: ${cacheKey}`
        );
      
        await redisClient.setEx(
          cacheKey,
          300,
          JSON.stringify(response)
        );
      
        console.log(
          `Dashboard cached for ${cacheKey}`
        );
      
      } catch (error) {
      
        console.error(
          "Redis SET failed:",
          error
        );
      
      }
      
      return res
        .status(200)
        .json(response);

    } catch (error) {

      console.error(
        "Dashboard error:",
        error
      );
    
      return res.status(500).json({
        success: false,
        message: error.message,
      });

    }
  };
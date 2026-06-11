import redisClient from "../config/redis.js";

export const invalidateDashboardCache =
  async (group) => {
    try {

        const keys =
        group.members.map(
          (member) =>
            `dashboard:${
              member.user._id
                ? member.user._id.toString()
                : member.user.toString()
            }`
        );

      if (keys.length > 0) {

        await redisClient.del(
          keys
        );

        console.log(
          "Invalidated dashboard cache:",
          keys
        );
      }

    } catch (error) {

      console.error(
        "Dashboard cache invalidation failed:",
        error.message
      );

    }
  };
import User from "../models/user.model.js";

export const searchUserByMobileNumber =
  async (req, res) => {
    try {
      const { mobileNumber } =
        req.query;

      if (!mobileNumber) {
        return res.status(400).json({
          success: false,
          message:
            "Mobile number is required",
        });
      }

      const user =
        await User.findOne({
          mobileNumber,
        }).select(
          "_id name email mobileNumber profilePicture"
        );

      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "User not found",
        });
      }

      return res.status(200).json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          mobileNumber:
            user.mobileNumber,
          profilePicture:
            user.profilePicture,
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };
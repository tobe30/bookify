import Order from "../models/Order.js";
import User from "../models/User.js";

// GET /api/users/admin/all
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" })
      .select("fullName regNumber email role createdAt")
      .sort({ createdAt: -1 });

    const orderCounts = await Order.aggregate([
      {
        $match: {
          userId: { $in: users.map((user) => user._id) },
        },
      },
      {
        $group: {
          _id: "$userId",
          count: { $sum: 1 },
        },
      },
    ]);

    const countByUser = new Map(
      orderCounts.map((item) => [item._id.toString(), item.count])
    );

    const usersWithOrderCount = users.map((user) => ({
      ...user.toObject(),
      orderCount: countByUser.get(user._id.toString()) ?? 0,
    }));

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      users: usersWithOrderCount,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

import mongoose from "mongoose";
import Book from "../models/Book.js";
import Order from "../models/Order.js";
import User from "../models/User.js";

// Create Order
export const createOrder = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { deliveryInfo, items, saveAddress, paymentMethod } = req.body ?? {};

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "You must be logged in to place an order",
      });
    }

    const finalDeliveryInfo = {
      fullName:
        deliveryInfo?.fullName?.trim() || req.user.fullName,
      email:
        deliveryInfo?.email?.toLowerCase().trim() || req.user.email,
      phone:
        deliveryInfo?.phone?.trim() || req.user.savedAddress?.phone,
      address:
        deliveryInfo?.address?.trim() || req.user.savedAddress?.address,
    };

    const payment = paymentMethod || "COD";

    if (
      !finalDeliveryInfo.fullName ||
      !finalDeliveryInfo.email ||
      !finalDeliveryInfo.phone ||
      !finalDeliveryInfo.address ||
      !payment
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Full name, email, phone number, delivery address and payment method are required",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your order must contain at least one book",
      });
    }

    const requestedItems = new Map();

    for (const item of items) {
      const bookId = item.bookId ?? item.id;
      const quantity = Number(item.quantity);

      if (
        !mongoose.isValidObjectId(bookId) ||
        !Number.isInteger(quantity) ||
        quantity < 1
      ) {
        return res.status(400).json({
          success: false,
          message: "Every order item must have a valid book ID and quantity",
        });
      }

      requestedItems.set(
        bookId.toString(),
        (requestedItems.get(bookId.toString()) ?? 0) + quantity
      );
    }

    const books = await Book.find({
      _id: { $in: [...requestedItems.keys()] },
    });

    if (books.length !== requestedItems.size) {
      return res.status(404).json({
        success: false,
        message: "One or more books could not be found",
      });
    }

    let subtotal = 0;
    const orderItems = [];

    for (const book of books) {
      const quantity = requestedItems.get(book._id.toString());

      if (book.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${book.stock} copies of "${book.title}" are available`,
        });
      }

      orderItems.push({
        bookId: book._id,
        quantity,
        price: book.price,
      });

      subtotal += book.price * quantity;
    }

    const shipping = subtotal >= 25000 ? 0 : 2500;
    const total = subtotal + shipping;

    const order = await Order.create({
      userId,
      deliveryInfo: finalDeliveryInfo,
      paymentMethod: payment,
      subtotal,
      shipping,
      total,
      orderItems,
    });

    if (saveAddress === true || saveAddress === "true") {
      await User.findByIdAndUpdate(userId, {
        savedAddress: {
          phone: finalDeliveryInfo.phone,
          address: finalDeliveryInfo.address,
        },
      });
    }

    await Book.bulkWrite(
      orderItems.map((item) => ({
        updateOne: {
          filter: { _id: item.bookId },
          update: { $inc: { stock: -item.quantity } },
        },
      }))
    );

    // TODO: Integrate the payment gateway here.
    // After successful payment, set order.isPaid to true and save the order.

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Error in create order controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get all orders for a user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "You must be logged in to view your orders",
      });
    }

    const orders = await Order.find({ userId })
      .populate(
        "orderItems.bookId",
        "title author image category price"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      orders,
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// Update order status by admin
export const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.orderId ?? req.body?.orderId;
    const { status } = req.body ?? {};

    if (!orderId || !status) {
      return res.status(400).json({
        success: false,
        message: "Order ID and status are required",
      });
    }

    if (!mongoose.isValidObjectId(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const validStatuses = [
      "Pending",
      "Processing",
      "Delivered",
      "Cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // TODO: Update isPaid only after confirmation from the payment gateway.

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};




// Get all orders for admin
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate(
        "orderItems.bookId",
        "title author image category price"
      )
      .populate("userId", "fullName email regNumber")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      orders,
    });
  } catch (error) {
    console.error("Error fetching admin orders:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

import mongoose from "mongoose";
import Book from "../models/Book.js";
import User from "../models/User.js";

const cartBookFields = "title author price image stock category";

export const addToCart = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { bookId, quantity = 1 } = req.body ?? {};
    const numericQuantity = Number(quantity);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "You must be logged in to use the cart",
      });
    }

    if (!mongoose.isValidObjectId(bookId)) {
      return res.status(400).json({
        success: false,
        message: "A valid book ID is required",
      });
    }

    if (!Number.isInteger(numericQuantity) || numericQuantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive whole number",
      });
    }

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    if (book.stock < numericQuantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${book.stock} copies are available`,
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const existingItem = user.cart.find(
      (item) => item.bookId.toString() === bookId
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + numericQuantity;

      if (newQuantity > book.stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${book.stock} copies are available`,
        });
      }

      existingItem.quantity = newQuantity;
    } else {
      user.cart.push({
        bookId,
        quantity: numericQuantity,
      });
    }

    await user.save();
    await user.populate("cart.bookId", cartBookFields);

    return res.status(200).json({
      success: true,
      message: "Book added to cart",
      cart: user.cart,
    });
  } catch (error) {
    console.error("Error adding book to cart:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getCart = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "You must be logged in to view the cart",
      });
    }

    const user = await User.findById(userId).populate(
      "cart.bookId",
      cartBookFields
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      cart: user.cart,
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateCartQuantity = async (req, res) => {
  try {
    const userId = req.user?._id;
    const bookId = req.params.bookId ?? req.body?.bookId;
    const numericQuantity = Number(req.body?.quantity);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "You must be logged in to update the cart",
      });
    }

    if (!mongoose.isValidObjectId(bookId)) {
      return res.status(400).json({
        success: false,
        message: "A valid book ID is required",
      });
    }

    if (!Number.isInteger(numericQuantity) || numericQuantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive whole number",
      });
    }

    const [user, book] = await Promise.all([
      User.findById(userId),
      Book.findById(bookId),
    ]);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    if (numericQuantity > book.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${book.stock} copies are available`,
      });
    }

    const cartItem = user.cart.find(
      (item) => item.bookId.toString() === bookId
    );

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Book is not in your cart",
      });
    }

    cartItem.quantity = numericQuantity;
    await user.save();
    await user.populate("cart.bookId", cartBookFields);

    return res.status(200).json({
      success: true,
      message: "Cart quantity updated",
      cart: user.cart,
    });
  } catch (error) {
    console.error("Error updating cart quantity:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const removeItemFromCart = async (req, res) => {
  try {
    const userId = req.user?._id;
    const bookId = req.params.bookId ?? req.body?.bookId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "You must be logged in to update the cart",
      });
    }

    if (!mongoose.isValidObjectId(bookId)) {
      return res.status(400).json({
        success: false,
        message: "A valid book ID is required",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { cart: { bookId } } },
      { new: true }
    ).populate("cart.bookId", cartBookFields);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Book removed from cart",
      cart: user.cart,
    });
  } catch (error) {
    console.error("Error removing book from cart:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "You must be logged in to clear the cart",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { cart: [] } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      cart: [],
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

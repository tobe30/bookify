import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }
}, { _id: false }); // prevent auto _id for each orderItem

const orderSchema = new mongoose.Schema({
  subtotal: { type: Number, required: true },
  shipping: { type: Number, required: true, default: 0 },
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ["Pending", "Processing", "Delivered", "Cancelled"],
    default: "Pending"
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  deliveryInfo: {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      required: true,
      trim: true
    }
  },

  isPaid: { type: Boolean, default: false },
  paymentReference: { type: String, trim: true },
  paymentMethod: {
    type: String,
    enum: ["COD", "CARD", "TRANSFER"],
    required: true
  },
  orderItems: [orderItemSchema]
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
export default Order;

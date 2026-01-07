import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    items: [
      {
        productId: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    status: {
      type: String,
      required: true,
    },
    idempotencyKey: {
      type: String,
      required: true,
      index: true,
    },
    reservedItems: [
      {
        productId: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    paymentIntentId: {
      type: String,
      index: true,
    },
    paymentStatus: {
      type: String,
    },
    cancelReason: String,
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", OrderSchema);

import { Schema } from "mongoose";
import mongoose from "mongoose";
const SubscriptionHistorySchema = new Schema(
  {
    userId: {
      //which user created the Subscription
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Subscription",
    },
    startDate: {type: Date, default: Date.now()},
    expireDate: {type: Date, default: Date.now()},
    active: {type: Boolean, default: false},
    redeem: { type: Boolean, default: true },
  },

  { timestamps: true }
);

const SubscriptionHistory = mongoose.model("SubscriptionHistory", SubscriptionHistorySchema);

export default SubscriptionHistory;

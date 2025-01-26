import { Schema } from "mongoose";
import mongoose from "mongoose";
const SubscriptionSchema = new Schema(
  {
    type: { type: String, required: true },
    createdBy: { //which user created the Subscription
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "User",
      default: null
    },
    duration: {type: String, default: null, require: true},
    amount: {type: String, default: null, require: true},
    redeemCode: {type: String, default: null}
  },
  
  { timestamps: true }
);

const Subscription = mongoose.model("Subscription", SubscriptionSchema);

export default Subscription;

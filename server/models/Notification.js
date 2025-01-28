import { Schema } from "mongoose";
import mongoose from "mongoose";
const notificationSchema = new Schema(
  {
    message: { type: String, required: true },
    CryptoLogId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "CryptoLogs",
    },
    createdAt: { type: Date, default: Date.now },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;

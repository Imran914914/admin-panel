import mongoose, { Schema } from "mongoose";

const BlockedUserAgentSchema = new Schema(
  {
    userAgent: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("BlockedUserAgent", BlockedUserAgentSchema);

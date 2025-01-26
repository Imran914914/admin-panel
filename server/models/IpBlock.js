// Account.ts (Mongoose Model)

import mongoose, { Schema } from "mongoose";

const IpBlockSchema = new Schema(
  {
    blockerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    ip: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("IpBlock", IpBlockSchema);

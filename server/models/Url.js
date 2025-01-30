import mongoose from "mongoose";

const UrlSchema = new mongoose.Schema(
  {
    status: { type: String }, // 'success' or 'failed'
    cryptoLogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CryptoLogs",
      require: true,
    },
    appLogo: { type: String, default: "" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, //userId
    description: { type: String },
    redirectUrl: { type: String, default: "" },
    title: { type: String, default: "" },
  },
  { timestamps: true }
);

const Url = mongoose.model("Url", UrlSchema);

export default Url;

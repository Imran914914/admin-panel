import mongoose from "mongoose";

const UrlSchema = new mongoose.Schema(
  {
    status: { type: String }, // 'success' or 'failed'
    cryptoLogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CryptoLogs",
      require: true,
    },
    appName: { type: String, default: "" },
    appLogo: {type: String, default: ''},
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    description: { type: String },
    redirectUrl: { type: String, default: "" },
    backgroundcolor: { type: String, default: "" },
    btnColor: { type: String, default: "" },
    modalColor: { type: String, default: "" },
  },
  { timestamps: true }
);

const Url = mongoose.model("Url", UrlSchema);

export default Url;

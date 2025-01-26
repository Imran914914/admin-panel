import mongoose from "mongoose";

const UrlSchema = new mongoose.Schema(
  {
    status: { type: String }, // 'success' or 'failed'
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, //userId
    description: { type: String },
    title: { type: String, default: "" },
    
  },
  { timestamps: true }
);

const Url = mongoose.model("Url", UrlSchema);

export default Url;

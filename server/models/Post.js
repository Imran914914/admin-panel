import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    status: { type: String }, // 'success' or 'failed'
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, //userId
    description: { type: String },
    title: { type: String, default: "" },
    
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", PostSchema);

export default Post;

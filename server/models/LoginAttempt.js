import mongoose from "mongoose";

const loginAttemptSchema = new mongoose.Schema({
  status: { type: String, required: true }, // 'success' or 'failed'
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  description: { type: String, required: true },
  location: {type: Object, default: {}},
  timestamp: { type: Date, default: Date.now },
});

const LoginAttempt = mongoose.model("LoginAttempt", loginAttemptSchema);

export default LoginAttempt;

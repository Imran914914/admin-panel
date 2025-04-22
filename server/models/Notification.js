// import { Schema } from "mongoose";
// import mongoose from "mongoose";
// const notificationSchema = new Schema(
//   {
//     message: { type: String, required: true },
//     CryptoLogId: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//       ref: "CryptoLogs",
//     },
//     createdAt: { type: Date, default: Date.now },
//     deleted: { type: Boolean, default: false },
//   },
//   { timestamps: true }
// );

// const Notification = mongoose.model("Notification", notificationSchema);

// export default Notification;

import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';

const Notification = sequelize.define('Notification', {
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false, // Make true if system-wide notifications are allowed
  },
}, {
  timestamps: true,
});

export default Notification;

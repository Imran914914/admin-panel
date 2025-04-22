// models/Message.js
import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js"; // adjust this path to your sequelize instance

const Message = sequelize.define(
  "Message",
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false, // Make true if system-wide notifications are allowed
    },
  },
  {
    timestamps: true,
  }
);

export default Message;

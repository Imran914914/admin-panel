// models/SubscriptionHistory.js
import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";

const SubscriptionHistory = sequelize.define(
  "SubscriptionHistory",
  {
    startDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    expireDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    redeem: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    userId: {
      // Add userId field
      type: DataTypes.INTEGER,
      allowNull: false, // Ensure that userId is required
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

export default SubscriptionHistory;

import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";

const Subscription = sequelize.define("Subscription", {
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  duration: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  },
  amount: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  },
  redeemCode: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  createdBy: {
    type: DataTypes.INTEGER, // or STRING depending on your use case
    allowNull: true // or false, based on your logic
  }
}, {
  timestamps: true,
});

export default Subscription;

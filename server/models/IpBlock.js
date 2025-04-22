// models/IpBlock.js
import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";

const IpBlock = sequelize.define(
  "IpBlock",
  {
    blockerId: {
      type: DataTypes.INTEGER, // Or UUID depending on your User model
      allowNull: false,
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

export default IpBlock;

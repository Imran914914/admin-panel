// models/BlockedUserAgent.js

// models/BlockedUserAgent.js
import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";

const BlockedUserAgent = sequelize.define(
  "BlockedUserAgent",
  {
    userAgent: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

export default BlockedUserAgent;

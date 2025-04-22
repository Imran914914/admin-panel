// models/Url.js
import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";

const Url = sequelize.define(
  "Url",
  {
    status: {
      type: DataTypes.STRING,
      allowNull: false, // This is what caused your error
      defaultValue: "pending", // You can change this to 'success' or 'failed' as needed
    },
    cryptoLogId: {
      type: DataTypes.INTEGER, // or DataTypes.UUID if you're using UUIDs
      allowNull: false,
    },
    appName: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    appLogo: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    userId: {
      type: DataTypes.INTEGER, // Or UUID depending on your User model
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    redirectUrl: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    backgroundcolor: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    btnColor: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    modalColor: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
  },
  {
    timestamps: true,
  }
);

export default Url;

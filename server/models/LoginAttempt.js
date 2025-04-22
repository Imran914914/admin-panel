import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js'; // Adjust path if needed
import User from './Users.js'; // Make sure this is the correct import

const LoginAttempt = sequelize.define('LoginAttempt', {
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    // You can enforce values using ENUM if needed
    // type: DataTypes.ENUM('success', 'failed', 'locked'),
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User, // Directly referencing the imported model
      key: 'id',
    },
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.JSON,
    defaultValue: {},
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: true, // adds createdAt and updatedAt
  indexes: [
    {
      fields: ['userId'],
    },
  ],
});

export default LoginAttempt;

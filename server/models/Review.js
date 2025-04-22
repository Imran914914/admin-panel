import {Sequelize, DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';

const Review = sequelize.define('Review', {
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  }
}, {
  timestamps: true,
});

export default Review;

import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';

const Post = sequelize.define('Post', {
  status: {
    type: DataTypes.STRING, // 'success' or 'failed'
  },
  description: {
    type: DataTypes.STRING,
  },
  title: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false, // make sure it's required unless you want it optional
  }
}, {
  timestamps: true,
});

export default Post;

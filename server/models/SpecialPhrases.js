// models/Phrase.js
import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";

const Phrase = sequelize.define("Phrase", {
  phrase: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: true,
});

export default Phrase;

const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password_hash: DataTypes.STRING,
  role: {
    type: DataTypes.ENUM("principal", "teacher"),
  },
});

module.exports = User;
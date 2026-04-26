const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Content = sequelize.define("Content", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: DataTypes.TEXT,
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  file_path: DataTypes.STRING,
  file_type: DataTypes.STRING,
  file_size: DataTypes.INTEGER,

  status: {
    type: DataTypes.ENUM("pending", "approved", "rejected"),
    defaultValue: "pending",
  },
  rejection_reason: DataTypes.TEXT,
  approved_by: DataTypes.INTEGER,
  approved_at: DataTypes.DATE,

  start_time: DataTypes.DATE,
  end_time: DataTypes.DATE,
});

module.exports = Content;
const sequelize = require("../config/db");

const User = require("./User");
const Content = require("./Content");
const Schedule = require("./Schedule");

User.hasMany(Content, { foreignKey: "uploaded_by" });
Content.belongsTo(User, { foreignKey: "uploaded_by" });

Content.hasMany(Schedule, { foreignKey: "content_id" });
Schedule.belongsTo(Content, { foreignKey: "content_id" });

module.exports = {
  sequelize,
  User,
  Content,
  Schedule,
};
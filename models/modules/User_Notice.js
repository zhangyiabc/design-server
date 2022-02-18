// 用户消息通知表
const { sequelize } = require('../db')
const { DataTypes } = require('sequelize')

const User_Notice = sequelize.define("User_Notice",
  {
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    targetType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    targetId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    },
    targetAuthorId: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    createdAt: true,
    updatedAt: false,
    paranoid: true
  }
)

module.exports = User_Notice
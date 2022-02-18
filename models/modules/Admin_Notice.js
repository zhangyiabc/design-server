// 系统消息表
const { sequelize } = require('../db')
const { DataTypes } = require('sequelize')
const Admin_Notice = sequelize.define(
  'Admin_Notice',
  {
    status: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
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

module.exports = Admin_Notice
// 管理员信息表
const { sequelize } = require('../db')
const { DataTypes } = require('sequelize')
const Admin = sequelize.define('Admin',
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    author: {
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

module.exports = Admin
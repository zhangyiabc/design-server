// 用户账号信息表

// 管理员信息表
const { sequelize } = require('../db')
const { DataTypes } = require('sequelize')
const User = sequelize.define('User',
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
    },
    online: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'no'
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  },
  {
    createdAt: true,
    updatedAt: false,
    paranoid: true
  }
)

module.exports = User
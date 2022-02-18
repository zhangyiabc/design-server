// 文章标签表
const { sequelize } = require('../db')
const { DataTypes } = require('sequelize')

const Label = sequelize.define(
  'Label',
  {
    tag: {
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

module.exports = Label
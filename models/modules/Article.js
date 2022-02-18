// 文章表
const { sequelize } = require('../db')
const { DataTypes } = require('sequelize')

const Article = sequelize.define(
  'Article',
  {
    cover: {
      type: DataTypes.STRING,
      allowNull: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    abstract:{
      type: DataTypes.STRING,
      allowNull: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    viewcount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    review: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "waiting"
    }
  },
  {
    createdAt: true,
    updatedAt: true,
    paranoid: true
  }
)

module.exports = Article
// 评论表
const { sequelize } = require('../db')
const { DataTypes } = require('sequelize')

const Comment = sequelize.define(
  'Comment',
  {
    type: {
      type:DataTypes.STRING,
      allowNull:false
    },
    content:{
      type:DataTypes.STRING,
      allowNull:false
    },
    objectId:{
      type:DataTypes.STRING,
      allowNull:false
    }
  },
  {
    createdAt:true,
    paranoid:true,
    updatedAt:false
  }
)

module.exports = Comment
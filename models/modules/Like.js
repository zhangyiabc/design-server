// 文章点赞表
const { sequelize } = require('../db')



const Like = sequelize.define(
  'Like',
  {},
  {
    createdAt: true,
    updatedAt: false,
    paranoid: true
  }
)

module.exports = Like
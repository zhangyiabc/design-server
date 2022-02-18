// 用户具体信息表
const { sequelize } = require('../db')
const { DataTypes } = require('sequelize')
const UserInfo = sequelize.define(
  "UserInfo",
  {
    avatar: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "http://test-zyd.oss-cn-beijing.aliyuncs.com/zhangyida/0417307-teudpo.jpg"
    },
    sex: {
      type: DataTypes.STRING,
      defaultValue: '0',
      allowNull: false
    },
    // 生日
    tel: {
      type: DataTypes.STRING(11),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    // 个性签名
    autograph: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    createdAt: true,
    updatedAt: false,
    paranoid: true
  }
)

module.exports = UserInfo
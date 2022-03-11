// 用户具体信息表
const { sequelize } = require('../db')
const { DataTypes } = require('sequelize')
function randomString(e) {
  e = e || 32;
  var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
    a = t.length,
    n = "";
  for (i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
  return n
}
const str = randomString(6)
const UserInfo = sequelize.define(
  "UserInfo",
  {
    avatar: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "https://api.multiavatar.com/" + str
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
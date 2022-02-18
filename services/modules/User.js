/**关于用户的一些操作 */
const validate = require('validate.js')
const User = require('../../models/modules/User')
const { pick } = require('../../utils/pick')
const { addUserInfo, updateUserInfo } = require('./UserInfo')
const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;
const UserInfo = require('../../models/modules/UserInfo');
const { hasProperty } = require('../../utils/hasProperty');
const { addAdminNotice } = require('./AdminNotice');
const {sequelize} = require('../../models/db')
// 更改用户在线状态(使用频率较高)
// 目前不知道需不需要返回东西
const changeOnlineStatus = async (userId, status) => {
  if (!status || !userId) {
    return
  }
  const userObj = {
    online: status
  }
  await User.update(userObj, {
    where: {
      id: userId
    }
  })
}

// 登录
// 登录成功设置用户在线状态为 在线
const login = async (username, password) => {
  let result = await User.findOne({
    attributes: ['id', 'username', 'password', 'online'],
    where: {
      username,
      password
    }
  })
  if (result && result.password === password) {
    result = result.toJSON()
    await changeOnlineStatus(result.id, 'yes')
    return {
      code: '200',
      data: result
    }
  }

  return {
    code: '400',
    msg: "账号或者密码不正确"
  }
}

// 注册
const addUser = async (userObj) => {
  // 新增用户
  // 1.判断用户是否存在，如果存在不能添加
  // 2.对用户名密码进行限制

  if (!userObj.online) {
    userObj.online = 'no'
  }

  userObj = pick(userObj, "author", "username", "password", 'online');
  const isHas = await User.findOne({
    where: {
      username: userObj.username
    }
  })

  if (!isHas) {
    // 此时准备添加的用户信息不存在
    const rules = {
      author: {
        presence: {
          allowEmpty: false,
        },
        type: "string",
        length: {
          minimum: 1,
          maximum: 10,
          message: "must be length is 1- 10",
        },
      },
      username: {
        presence: {
          allowEmpty: false,
        },
        type: "string",
        length: {
          minimum: 6,
          maximum: 20,
          message: "must be length is 6-20",
        },
      },
      online: {
        presence: {
          allowEmpty: false,
        },
        type: "string"
      },
      password: {
        presence: {
          allowEmpty: false,
        },
        type: "string",
        length: {
          minimum: 8,
          maximum: 20,
          message: "must be length is 8-20",
        }
      },
    }
    try {
      await validate.async(userObj, rules)
    } catch (error) {
      return {
        code: "400",
        msg: error
      }
    }
    // 此时需要新添加一条为空的用户资料数据
    const info = await addUserInfo()
    userObj.UserInfoId = info.id
    const ins = User.build(userObj)
    const res = await ins.save()
    const result = res.toJSON()
    // 此时已经注册成功，仅需要写入一条消息


    const noticeRes = await addAdminNotice({
      content: `${result.author} 欢迎您来到本系统! 在使用过程中希望您为本系统提出宝贵意见，联系微信：<b>qwxz20</b> `,
      UserId: result.id
    })
    if (noticeRes.code == '200') {
      console.log('写入系统消息成功')
    } else {
      console.log('写入系统消息失败')

    }
    return {
      code: '200',
      data: pick(result, 'id', 'username', 'author', 'online', 'UserInfoId', 'createdAt')
    }
  } else {
    return {
      code: '400',
      msg: "username is only,please check your username"
    }

  }
}

// 获取所有用户 
// 需要拿到用户的账号、id、昵称、性别、头像、在线状态、邮箱、个性签名
// 可以根据账号、性别、在线状态进行筛选
const getAllUsers = async ({
  page = 1,
  size = 10,
  author = '',
  online = 'all',
  sex = 'all'
}) => {

  let options = {};
  // 昵称模糊查询
  if (author) {
    options.author = {
      [Op.like]: `%${author}%`
    }
  }
  // 性别查询
  if (sex != 'all') {
    options.sex = sex
  }
  // 在线状态查询
  if (online != 'all') {
    options.online = online
  }
  const res = await User.findAndCountAll(
    {
      attributes: ['id', 'username', 'count', 'author', 'online', 'createdAt'],
      offset: (page - 1) * size,
      limit: +size,
      where: pick(options, 'online', 'author'),
      include: [
        {
          model: UserInfo,
          attributes: ['avatar', 'sex', 'tel', 'email', 'autograph'],
          where: pick(options, 'sex'),
        }
      ]
    }
  );
  const result = JSON.parse(JSON.stringify(res.rows))
  return {
    code: '200',
    data: {
      data: result,
      total: res.count,
      size: size
    }
  }
}

/**
 * 更改用户信息 只能更改密码、昵称 以及个人信息部分
 * @param {*} userId 
 * @param {Object} userObj 这个对象中有一部分信息有用户的账号信息、有一部分个人信息
 */
const updateUser = async (userId, userObj) => {
  if (!userId) {
    return {
      code: '400',
      msg: "参数缺失"
    }
  }
  // 判断用户是否存在
  // 将账号信息部分进行更改
  // 将个人信息交给userInfo

  // 判断用户是否存在
  const currentUser = await User.findByPk(+userId)
  if (!currentUser) {
    return {
      code: '400',
      msg: "该用户不存在"
    }
  }

  if (!hasProperty(userObj)) {
    return {
      code: '400',
      msg: "参数缺失"
    }
  }
  const finRes = currentUser.toJSON()
  // 存储账号以及个人信息
  const user = pick(userObj, 'password', 'author')
  const info = pick(userObj, 'sex', 'avatar', 'tel', 'email', 'autograph')

  // 制定账号可修改信息规则
  const rules = {
    author: {
      presence: undefined,
      type: "string",
      length: {
        minimum: 1,
        maximum: 10,
        message: "must be length is 1- 10",
      },
    },
    password: {
      presence: undefined,
      type: "string",
      length: {
        minimum: 8,
        maximum: 20,
        message: "must be length is 8-20",
      }
    },
  }

  // 开始更新个人信息部分
  if (hasProperty(info) && hasProperty(user)) {
    const updateInfoRes = await updateUserInfo(finRes.UserInfoId, info)
    if (updateInfoRes.code !== '200') {
      return {
        code: '400',
        msg: "个人信息部分更新失败"
      }
    }
    // 开始验证
    try {
      await validate.async(user, rules)
    } catch (error) {
      return {
        code: '400',
        msg: error
      }
    }
    // 进行更新
    const updateRes = await User.update(user, {
      where: {
        id: +userId
      }
    })
    if (Array.isArray(updateRes)) {
      return updateRes[0] ? { code: '200', msg: '更新成功' } : { code: '100', msg: "个人信息更新成功，账号信息更新失败" };
    } else {
      return updateRes ? { code: '200', msg: '更新成功' } : { code: '100', msg: "个人信息更新成功，账号信息更新失败" };
    }
  } else if (hasProperty(info) && !hasProperty(user)) {
    const updateInfoRes = await updateUserInfo(finRes.UserInfoId, info)
    return updateInfoRes
  } else if (!hasProperty(info) && hasProperty(user)) {
    try {
      await validate.async(user, rules)
    } catch (error) {
      return {
        code: "400",
        msg: error
      }
    }
    // 进行更新
    const updateRes = await User.update(user, {
      where: {
        id: +userId
      }
    })
    if (Array.isArray(updateRes)) {
      return updateRes[0] ? { code: '200', msg: '更新成功' } : { code: '100', msg: "个人信息更新成功，账号信息更新失败" };
    } else {
      return updateRes ? { code: '200', msg: '更新成功' } : { code: '100', msg: "个人信息更新成功，账号信息更新失败" };
    }
  }
}

// 根据用户id获取单个用户详情
const getUserDetail = async (userId) => {
  if (!userId) {
    return {
      code: '400',
      msg: "User-services 参数缺失"
    }
  }
  const findRes = await User.findOne({
    attributes: ['id', 'username', 'count', 'author', 'createdAt'],
    where: {

      id: +userId
    },
    include: [
      {
        model: UserInfo,
        attributes: ['avatar', 'sex', 'tel', 'email', 'autograph'],
      }
    ]
  })
  if (!findRes) {
    return {
      code: '400',
      msg: "请检查请求参数",
    }
  }
  return {
    code: '200',
    data: findRes.toJSON(),

  }
}

const getTotalUsers = async () => {
  const res = await User.findAll({
    attributes: ['id', 'username', 'author']
  })
  return {
    code: '200',
    data: res.map(it => it.toJSON())
  }
}

const addCount = async (id) => {
  const res = await User.findByPk(+id)
  const result = res.toJSON()
  // console.log(result)
  const count = result.count + 1
  await User.update({ count }, {
    where: {
      id: +id
    }
  })
}

const orderUser = async (userObj) => {
  const res = await User.findAll({
    order: [
      ['count', 'DESC'],
    ],
    limit: +userObj.size
  })
  return {
    code: "200",
    data: res.map(item => item.toJSON())
  }
}

const countUserSex = async () => {
  const male = await UserInfo.count({
    where: {
      sex: '1'
    }
  })
  const female = await UserInfo.count({
    where: {
      sex: '0'
    }
  })
  return {
    code: "200",
    data: {
      male,
      female
    }

  }
}

module.exports = {
  addUser,
  getTotalUsers,
  login,
  getAllUsers,
  updateUser,
  orderUser,
  getUserDetail,
  changeOnlineStatus,
  addCount,
  countUserSex
}
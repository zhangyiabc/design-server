const UserInfo = require("../../models/modules/UserInfo");
const { pick } = require("../../utils/pick");

/* 用户信息 */
const validate = require('validate.js')

const rules = {
  sex: {
    presence: undefined,
    type: "string",
  },
  tel: {
    presence: undefined,
    type: 'string',
    format: {
      pattern:
        /^1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/,
      message: "number is out of specification",
    },
  },
  email: {
    presence: undefined,
    type: 'string',
    format: {
      pattern:
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      message: "email is out of specification",
    },
  }
};

const addUserInfo = async (userInfoObj) => {
  userInfoObj = pick(userInfoObj, 'avatar', 'sex', 'tel', 'email', 'autograph')
  // 对用户信息进行验证
  try {
    await validate.async(userInfoObj, rules)
  } catch (error) {
    return {
      code: '400',
      msg: error
    }
  }
  const ins = UserInfo.build(userInfoObj)
  const result = await ins.save()
  return result.toJSON();
}

const updateUserInfo = async (userInfoId, infoObj) => {
  if (!userInfoId) {
    return {
      code: "400",
      msg: "userInfo-services 该用户不存在"
    }
  }
  infoObj = pick(infoObj, 'avatar', 'sex', 'tel', 'email', 'autograph')
  try {
    await validate.async(infoObj, rules)
  } catch (error) {
    return {
      code: '400',
      msg: error
    }
  }
  const updateRes = await UserInfo.update(infoObj, {
    where: {
      id: +userInfoId
    }
  })

  if (Array.isArray(updateRes)) {
    return updateRes[0] ? { code: '200', msg: '更新成功' } : { code: '-1', msg: "更新失败" };
  } else {
    return updateRes ? { code: '200', msg: '更新成功' } : { code: '-1', msg: "更新失败" };
  }

}

module.exports = {
  addUserInfo,
  updateUserInfo
}
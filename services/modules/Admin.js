// 关于管理员用户的操作
const Admin = require('../../models/modules/Admin')
const { pick } = require('../../utils/pick')
const { hasProperty } = require('../../utils/hasProperty');
const { Sequelize } = require("sequelize");
const validate = require('validate.js')
const Op = Sequelize.Op;

/**
 * 新增管理员用户
 * @param {*} adminObj 
 */
const addAdmin = async (adminObj) => {
  adminObj = pick(adminObj, 'username', 'password', 'author')
  if (!hasProperty(adminObj)) {
    return {
      code: "400",
      msg: "参数缺失"
    }
  }
  const isHas = await Admin.findOne({
    where: {
      username: adminObj.username
    }
  })
  if (!isHas) {
    // 此时需要新建的用户不存在
    // 定义规则
    const rules = {
      presence: {
        allowEmpty: false,
      },
      type: "string",
      length: {
        minimum: 1,
        maximum: 10,
        message: "must be length is 1- 10",
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
      password: {
        presence: {
          allowEmpty: false,
        },
        type: "string",
        length: {
          minimum: 6,
          maximum: 20,
          message: "must be length is 6-20",
        }
      }
    }
    // 开始验证
    try {
      await validate.async(adminObj, rules)
    } catch (error) {
      return {
        code: '400',
        msg: error
      }
    }
    const ins = Admin.build(adminObj)
    const res = await ins.save()
    const result = res.toJSON()
    return {
      code: '200',
      data: pick(result, 'id', 'username', 'password', 'author')
    }
  } else {
    return {
      code: '403',
      msg: "该用户已存在"
    }
  }
}

/**
 * 删除管理员用户
 * @param {*} adminId 
 */
const deleteAdmin = async (adminId) => {
  if (!adminId) {
    return {
      code: '400',
      msg: "参数缺失"
    }
  }
  const res = await Admin.destroy({
    where: {
      id: +adminId
    }
  })
  if (Array.isArray(res)) {
    return res[0] ? { code: '200', msg: '删除成功', data: "删除成功" } : { code: "400", msg: "删除失败" };
  } else {
    return res ? { code: '200', msg: '删除成功', data: "删除成功" } : { code: "400", msg: "删除失败" };
  }

}

/**
 * 修改管理员用户信息
 * @param {*} adminId 
 * @param {*} adminObj 
 */
const updateAdmin = async (adminId, adminObj) => {
  if (!adminId || !hasProperty(adminObj)) {
    return {
      code: '400',
      msg: "参数缺失"
    }
  }
  const currentAdmin = await Admin.findByPk(+adminId)
  if (!currentAdmin) {
    return {
      code: '400',
      msg: "admin services该用户不存在"
    }
  }
  adminObj = pick(adminObj, 'author', 'password')
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
  try {
    await validate.async(adminObj, rules)
  } catch (error) {
    return {
      code: "400",
      msg: error
    }
  }
  const updateRes = Admin.update(adminObj, {
    where: {
      id: adminId
    }
  })
  if (Array.isArray(updateRes)) {
    return updateRes[0] ? { code: '200', msg: '删除成功', data: "删除成功" } : { code: "400", msg: "删除失败" };
  } else {
    return updateRes ? { code: '200', msg: '删除成功', data: "删除成功" } : { code: "400", msg: "删除失败" };
  }
}

/**
 * 获取所有管理员用户
 * @param {*} param0 
 */
const getAllAdmin = async ({ author = '', username = '' }) => {
  let options = {}
  if (author) {
    options.author = {
      [Op.like]: `%${author}%`
    }
  }
  if (username) {
    options.username = {
      [Op.like]: `%${username}%`
    }
  }
  const res = await Admin.findAll({
    attributes: ['id', 'username', 'author', 'createdAt'],
    where: options
  })
  return {
    code: '200',
    data: res.map(it => it.toJSON())
  }
}

/**
 * 管理员用户登录
 * @param {string} username 
 * @param {string} password 
 */
const login = async (username, password) => {
  if (!username || !password) {
    return {
      code: '400',
      msg: "参数缺失"
    }
  }
  let result = await Admin.findOne({
    attributes: ['id', 'username', 'author'],
    where: {
      username,
      password
    }

  })
  if (result) {
    return {
      code: '200',
      data: result.toJSON()
    }
  }

}

module.exports = {
  login,
  addAdmin,
  deleteAdmin,
  updateAdmin,
  getAllAdmin
}

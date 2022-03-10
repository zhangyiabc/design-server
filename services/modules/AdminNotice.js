/**系统通知表 */
const validate = require('validate.js')
const AdminNotice = require('../../models/modules/Admin_Notice')
const { pick } = require('../../utils/pick')
const User = require('../../models/modules/User')
const UserInfo = require('../../models/modules/UserInfo')

/**
 * 新增一条系统消息
 * @param {*} noticeObj 
 */
const addAdminNotice = async (noticeObj) => {
  noticeObj.status = 'unread'
  noticeObj = pick(noticeObj, 'status', 'content', 'UserId')
  const rules = {
    status: {
      presence: {
        allowEmpty: false,
      },
      type: "string",
    },
    UserId: {
      presence: {
        allowEmpty: false,
      },
      numericality: {
        onlyInteger: true,
        strict: false,
      },
      // 拓展的方法
      UserIsExist: true,
    },
    content: {
      presence: {
        allowEmpty: false,
      },
      type: "string",
    }
  };

  try {
    await validate.async(noticeObj, rules)
  } catch (error) {
    return {
      code: '400',
      msg: error
    }
  }
  const ins = AdminNotice.build(noticeObj)
  const res = await ins.save()
  return {
    code: "200",
    msg: 'success',
    data: res.toJSON()
  }
}

/**
 * 获取消息详情
 * @param {*} noticeId 
 */
const getAdminNoticeDetail = async (noticeId) => {
  // 获取详情时需要把阅读状态更改
  if (!noticeId) {
    return {
      code: "400",
      msg: "参数缺失"
    }
  }
  const res = await AdminNotice.findOne({
    where: {
      id: +noticeId
    }
  })
  const updateRes = await updateAdminNoticeReadStatus(noticeId, 'read')
  if (updateRes.code == '200') {
    return {
      code: '200',
      data: res.toJSON()
    }
  }
}

/**
 * 更新消息状态
 * @param {*} noticeId 
 * @param {*} status 新状态
 * @returns 
 */
const updateAdminNoticeReadStatus = async (noticeId, status) => {
  if (!noticeId || !status) {
    return {
      code: "400",
      msg: "参数缺失"
    }
  }
  const res = await AdminNotice.update({ status }, {
    where: {
      id: +noticeId
    }
  })
  if (Array.isArray(res)) {
    return res[0] ? { code: '200', msg: '修改成功', data: "修改成功" } : { code: "400", msg: "修改失败" };
  } else {
    return res ? { code: '200', msg: '修改成功', data: "修改成功" } : { code: "400", msg: "修改失败" };
  }
}

const getAllAdminNotice = async ({ page = 1, size = 10, status = 'all', userId = '' } = {}) => {
  // console.log('110',userId)
  let option = {}
  if (userId) {
    option.UserId = userId
  }
  if (status != 'all') {
    option.status = status
  }
  const res = await AdminNotice.findAndCountAll({
    attributes: ['id', 'createdAt', 'UserId', 'content', 'status'],
    offset: (page - 1) * +size,
    limit: +size,
    where: option,
    order: [
      ['createdAt', 'DESC'],
    ],
    include: [
      {
        model: User,
        attributes: ['author'],
        include: [
          {
            model: UserInfo,
            attributes: ['avatar']
          }
        ]
      }
    ]
  })

  return {
    code: '200',
    msg: 'success',
    data: {
      data: JSON.parse(JSON.stringify(res.rows)),
      total: res.count,
      size: size
    }
  }
}

module.exports = {
  addAdminNotice,
  getAdminNoticeDetail,
  getAllAdminNotice
}
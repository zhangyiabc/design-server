/**用户操作后的通知信息 */
const UserNotice = require('../../models/modules/User_Notice')
const validate = require('validate.js')
const { pick } = require('../../utils/pick')
const User = require('../../models/modules/User')
const UserInfo = require('../../models/modules/UserInfo')
const Article = require('../../models/modules/Article')
const Comment = require('../../models/modules/Comment')

/**
 * 添加一条消息
 * @param {*} noticeObj 
 * @returns 
 */
const addUserNotice = async (noticeObj) => {
  noticeObj.status = 'unread'
  // type 为commit时 target就是文章id type为"
  noticeObj = pick(noticeObj, 'targetAuthorId', 'status', 'type', 'UserId', 'targetId', 'targetType')
  const rules = {
    status: {
      presence: {
        allowEmpty: false,
      },
      type: "string",
    },
    type: {
      presence: {
        allowEmpty: false,
      },
      type: "string",
    },
    targetType: {
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
    targetAuthorId: {
      presence: {
        allowEmpty: false,
      },
      numericality: {
        onlyInteger: true,
        strict: false,
      },
      // 拓展的方法
      UserIsExist: true,
    }

  }
  if (noticeObj.targetAuthorId == noticeObj.UserId) {
    return {
      code: "400",
      msg: "自己点赞自己没必要"
    }
  }
  if (noticeObj.targetType == 'art') {
    rules.targetId = {
      presence: {
        allowEmpty: false,
      },
      numericality: {
        onlyInteger: true,
        strict: false,
      },
      ArticleIsExist: true
    }
  } else if (noticeObj.targetType == 'comment') {
    rules.targetId = {
      presence: {
        allowEmpty: false,
      },
      numericality: {
        onlyInteger: true,
        strict: false,
      },
      CommentIsExist: true
    }
  }
  try {
    await validate.async(noticeObj, rules)
  } catch (error) {
    return {
      code: '400',
      msg: error
    }
  }
  const ins = UserNotice.build(noticeObj)
  const res = await ins.save()
  const result = res.toJSON()
  return {
    code: "200",
    msg: "success",
    data: result
  }
}

/**
 * 获取消息详情
 * @param {*} noticeId 
 */
const getUserNoticeDetail = async (noticeId) => {
  // 获取详情时需要把阅读状态更改
  if (!noticeId) {
    return {
      code: "400",
      msg: "参数缺失"
    }
  }
  const res = await UserNotice.findOne({
    where: {
      id: +noticeId
    }
  })
  const updateRes = await updateUserNoticeReadStatus(noticeId, 'read')
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
const updateUserNoticeReadStatus = async (noticeId, status) => {
  if (!noticeId || !status) {
    return {
      code: "400",
      msg: "参数缺失"
    }
  }
  const res = await UserNotice.update({ status }, {
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

/**
 * 获取所有的通知信息，需要根据targetId 和targetType获取到消息发生的详情、消息发生的位置，根据userId获取用户的昵称、头像
 * @param {*} param0 
 */
const getAllNotice = async ({ page = 1, size = 10, status = 'all', targetAuthorId } = {}) => {
  // 把消息发生的位置（文章id）告诉前端，点击获取详情时 跳转至该文章详情
  if (!targetAuthorId) {
    return {
      code: "400",
      msg: "targetAuthorId is must have"
    }
  }
  let options = {}
  if (status != 'all') {
    options.status = status
  }
  if (targetAuthorId) {
    options.targetAuthorId = targetAuthorId
  }
  const res = await UserNotice.findAndCountAll({
    attributes: ['id', 'type', 'targetId', 'targetType', 'status', 'UserId', 'createdAt'],
    offset: (page - 1) * +size,
    limit: +size,
    where: options,
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
  const temp = JSON.parse(JSON.stringify(res.rows))
  const result = await findHappenDetail(temp)
  
  return {
    code: "200",
    msg: "success",
    data: {
      data: result,
      total: res.count,
      size: +size
    }
  }
}

/**
 * 获取消息发生的位置信息
 * @param {Array} arr 
 */
const findHappenDetail = async (arr) => {
  const result = await Promise.all(arr.map(async (item) => {
    let happenArticleId, happenInfo;
    if (item.targetType == 'art') {
      // 消息发生在文章，targetId就是文章id，只需要吧文章标题查询出来
      let obj = await Article.findOne({
        where: {
          id: +item.targetId
        }
      })
      obj = obj.toJSON()

      happenArticleId = item.targetId;
      happenInfo = obj.title
    } else if (item.targetType == 'comment') {
      // 消息发生在评论上，需要根据评论id(targetId)查询出文章信息（标题），还需要把评论内容查询出来
      let obj = await Comment.findOne({
        where: {
          id: +item.targetId
        }
      })
      obj = obj.toJSON()
      if (obj.type === 'art') {
        happenArticleId = obj.objectId
        happenInfo = obj.content
      }
    }
    return {
      ...item,
      happenArticleId,
      happenInfo
    }
  }))

  return result
}

module.exports = {
  getUserNoticeDetail,
  getAllNotice,

  addUserNotice
}
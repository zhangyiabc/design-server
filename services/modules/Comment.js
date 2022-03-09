/**用户的评论操作 */
const Comment = require('../../models/modules/Comment')
const Article = require('../../models/modules/Article')
const User = require('../../models/modules/User')
const UserInfo = require('../../models/modules/UserInfo')
const validate = require('validate.js')
const { pick } = require('../../utils/pick')
const { addUserNotice } = require('./UserNotice')

// 评论功能目前只做 用户只能对文章进行评论(对评论进行评论后续再做)

/**
 * 获取文章下所有评论
 * @param {*} param0 
 * @returns 
 */
const getAllComment = async ({ page = 1, size = 10, articleId } = {}) => {
  if (!articleId) {
    return {
      code: '400',
      msg: '参数缺失'
    }
  }
  const res = await Comment.findAndCountAll({
    attributes: ['id', 'UserId', 'objectId', 'content', 'type', 'createdAt'],
    limit: +size,
    offset: (page - 1) * size,
    where: {
      objectId: articleId
    },
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
    data: {
      data: JSON.parse(JSON.stringify(res.rows)),
      total: res.count,
      size: +size
    }
  }
}

/**
 * 新增一条评论
 * @param {*} param0 
 */
const addComment = async (commentObj) => {
  commentObj.type = 'art'
  commentObj = pick(commentObj, 'objectId', 'UserId', 'content', 'type')
  const { objectId, UserId, content, type } = commentObj
  if (!objectId || !UserId || !content) {
    return {
      code: '400',
      msg: '参数缺失'
    }
  }
  const rules = {
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
    },
    type: {
      presence: {
        allowEmpty: false,
      },
      type: "string",
    }
  }
  if (type == 'art') {
    rules.objectId = {
      presence: {
        allowEmpty: false,
      },
      numericality: {
        onlyInteger: true,
        strict: false,
      },
      // 拓展的方法
      ArticleIsExist: true,
    }
  }
  try {
    await validate.async(commentObj, rules)
  } catch (error) {
    return {
      code: '400',
      msg: error
    }
  }
  // 开始评论
  const ins = Comment.build(commentObj)
  const res = await ins.save()
  const result = res.toJSON()
  

  // 获取文章作者id
  const targetInfo = await Article.findOne({
    where: {
      id: +objectId
    }
  })
  const targetObj = targetInfo.toJSON()
  // 向消息表中记录评论消息通知
  await addUserNotice({
    type: 'comment',
    targetType: 'art',
    UserId: UserId,
    targetId: +objectId,
    targetAuthorId: targetObj.UserId
  })
  return {
    code: '200',
    msg: "success",
    data: result
  }
}

/**
 * 删除评论
 * @param {*} deleteObj 
 */
const deleteComment = async (deleteObj) => {
  // 这个对象中需要有评论id、文章id、用户id
  // 规则：1. 文章作者可以删除文章下任意评论
  //       2. 普通用户只能删除自己写的评论
  deleteObj = pick(deleteObj, 'id', 'articleId', 'userId')
  // userId 指的是操作的用户
  const { id, articleId, userId } = deleteObj
  const rules = {
    userId: {
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
    articleId: {

      presence: {
        allowEmpty: false,
      },
      numericality: {
        onlyInteger: true,
        strict: false,
      },
      // 拓展的方法
      ArticleIsExist: true,
    },
  }
  try {
    await validate.async(deleteObj, rules)
  } catch (error) {
    return {
      code: '400',
      msg: error
    }
  }

  const tempData = await Comment.findOne({
    where: {
      id: +id
    }
  })
  const temp = tempData.toJSON()
  // 开始判断 权限
  // 根据文章获取用户id
  const obj = await Article.findOne({
    where: {
      id: articleId
    }
  })
  const articleObj = obj.toJSON()
  let articleUserId, deleteRes;
  if (articleObj) {
    articleUserId = articleObj.UserId
  }
  if (temp.type == 'art' && articleUserId == userId) {
    // 作者删除文章下面的任意评论
    deleteRes = Comment.destroy({
      where: {
        id: +id
      }
    })

  } else if (temp.type == 'art' && userId == temp.UserId) {
    // 本人删除本人自己的评论
    deleteRes = Comment.destroy({
      where: {
        id: +id
      }
    })
  } else {
    return {
      code: "401",
      msg: '您无权删除这条评论'
    }
  }
  if (Array.isArray(deleteRes)) {
    return deleteRes[0] ? { code: '200', msg: '删除成功', data: "删除成功" } : { code: "400", msg: "删除失败" };
  } else {
    return deleteRes ? { code: '200', msg: '删除成功', data: "删除成功" } : { code: "400", msg: "删除失败" };
  }
}

/**
 * 统计文章的评论数
 * @param {*} articleId 文章id
 */
const countComment = async (articleId) => {
  if (!articleId) {
    return {
      code: "400",
      msg: "countComment 参数缺失"
    }
  }
  const count = await Comment.count({
    where: {
      objectId: +articleId
    }
  })
  return {
    code: '200',
    msg: 'success',
    data: count
  }
}

module.exports = {
  countComment,
  addComment,
  getAllComment,
  deleteComment
}
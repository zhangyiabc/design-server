/** 用户有关点赞操作*/
const Like = require('../../models/modules/Like')
const User = require('../../models/modules/User')
const UserInfo = require('../../models/modules/UserInfo')
const Article = require('../../models/modules/Article')
const { addUserNotice } = require('./UserNotice')
const validate = require('validate.js')
/**
 * 获取某篇文章下所有赞 
 * 例 '张毅' 点赞了 您的博客'钢铁是怎么练成的'
 * @param {*} articleId 
 */
const getAllLikeForArticle = async ({ page = 1, size = 10, articleId } = {}) => {
  if (!articleId) {
    return {
      code: '400',
      msg: '参数缺失'
    }
  }
  const res = await Like.findAndCountAll({
    attributes: ['id', 'UserId', 'createdAt', 'ArticleId'],
    offset: (page - 1) * +size,
    limit: +size,
    where: {
      ArticleId: articleId
    },
    include: [
      // 关联用户的昵称、头像
      {
        model: User,
        attributes: ['author'],
        // 头像
        include: [
          {
            model: UserInfo,
            attributes: ['avatar']
          }
        ]
      },
      // 关联文章的标题
      {
        model: Article,
        attributes: ['title']
      }
    ]
  })
  return {
    code: '200',
    data: {
      data: JSON.parse(JSON.stringify(res.rows)),
      total: res.count,
      size: size

    }
  }
}

/**
 * 获取某个用户所有点赞过的文章
 * @param {*} userId 
 */
const getAllLikeForUser = async ({ page = 1, size = 10, userId } = {}) => {
  if (!userId) {
    return {
      code: '400',
      msg: '参数缺失'
    }
  }
  const res = await Like.findAndCountAll({
    attributes: ['id', 'UserId', 'createdAt', 'ArticleId'],
    offset: (page - 1) * +size,
    limit: +size,
    where: {
      UserId: userId
    },
    include: [
      // 关联用户的昵称、头像
      {
        model: User,
        attributes: ['author'],
        // 头像
        include: [
          {
            model: UserInfo,
            attributes: ['avatar']
          }
        ]
      },
      // 关联文章的标题
      {
        model: Article,
        attributes: ['title','cover']
      }
    ]
  })
  return {
    code: '200',
    data: {
      data: JSON.parse(JSON.stringify(res.rows)),
      total: res.count,
      size: size

    }
  }
}


/**
 * 点赞操作
 * @param {*} userId 
 * @param {*} articleId 
 */
const handleLike = async (userId, articleId) => {
  // 如果这个用户已经对这篇文章进行过点赞，再次调用该方法会取消此点赞
  if (!userId || !articleId) {
    return {
      code: '400',
      msg: '参数缺失'
    }
  }
  // 首先拿到该文章点赞过得所有用户 数组 判断这个用户是否在数组中存在
  const allData = await Like.findAll({
    attributes: ['id', 'UserId', 'ArticleId'],
    where: {
      ArticleId: articleId
    }
  })
  // 这个数组里包含了所有用户的id
  const temp = allData.map(it => it.toJSON().UserId)

  if (!temp.includes(+userId)) {
    const likeObj = {
      UserId: userId,
      ArticleId: articleId
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
      ArticleId: {

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
      await validate.async(likeObj, rules)
    } catch (error) {
      return {
        code: '400',
        msg: error
      }
    }
    // 进行点赞
    const ins = Like.build(likeObj)
    const res = await ins.save()
    const result = res.toJSON()
    // 发送点赞消息
    // 需要利用文章id获取到文章作者id
    const targetInfo = await Article.findOne({
      where: {
        id: +articleId
      }
    })
    const targetObj = targetInfo.toJSON()
    await addUserNotice({
      type: 'like',
      targetType: 'art',
      UserId: +userId,
      targetId: +articleId,
      targetAuthorId: targetObj.UserId
    })
    return {
      code: '200',
      msg: "success",
      data: result
    }
  } else {
    // const delRes = await handleCancelLike(userId, articleId)
    // if (delRes.code = '200') {
    //   return {
    //     code: "200",
    //     msg: "取消点赞成功"
    //   }
    // }
    return {
      code: '400',
      msg: "重复点赞",
      data: []
    }
  }
}

// 只有用户可以对点赞过的文章进行取消点赞操作 参数需要用户id和文章id
/**
 * 取消点赞操作
 * @param {*} userId 
 * @param {*} articleId 
 */
const handleCancelLike = async (userId, articleId) => {
  if (!userId || !articleId) {
    return {
      code: '400',
      msg: '参数缺失'
    }
  }
  const res = await Like.destroy({
    where: {
      UserId: userId,
      ArticleId: articleId
    }
  })
  if (Array.isArray(res)) {
    return res[0] ? { code: '200', msg: '操作成功', data: "操作成功" } : { code: "400", msg: "操作失败" };
  } else {
    return res ? { code: '200', msg: '操作成功', data: "操作成功" } : { code: "400", msg: "操作失败" };
  }
}

/**
 * 统计文章或者用户点赞条数
 * @param {*} param0 
 * type 'article' 统计文章  'user' 统计用户
 * id 对应的id
 */
const countLike = async ({ type, id } = {}) => {

  if (type != 'article' && type != 'user') {
    return {
      code: '400',
      msg: '参数type只能是article or user'
    }
  }
  let count, options;
  if (type === 'article') {
    options = {
      ArticleId: +id
    }
  } else {
    options = {
      UserId: +id
    }
  }
  count = await Like.count({
    where: options
  })
  return {
    code: '200',
    msg: 'success',
    data: count
  }
}

module.exports = {
  handleLike,
  handleCancelLike,
  countLike,
  getAllLikeForArticle,
  getAllLikeForUser
}
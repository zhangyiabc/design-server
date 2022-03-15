/**关于文章的一些操作 */
const { Sequelize } = require('sequelize')
const Op = Sequelize.Op;
const validate = require('validate.js')
const Article = require('../../models/modules/Article')
const { hasProperty } = require('../../utils/hasProperty')
const { pick } = require('../../utils/pick')
const User = require('../../models/modules/User')
const UserInfo = require('../../models/modules/UserInfo')
const Label = require('../../models/modules/Label')
const { countComment } = require('./Comment')
const { countLike } = require('./Like')
const { addAdminNotice } = require('./AdminNotice');
/**
 * 新增一篇文章
 * @param {Object} articleObj 
 */
const countArticle = async (LabelId, UserId) => {
  let option = {
    review: "success"
  }
  if (LabelId) {
    option.LabelId = LabelId
  }
  if (UserId) {
    option.UserId = UserId
  }

  const count = await Article.count({
    where: option
  })
  return {
    code: '200',
    data: count
  }
}

const addArticle = async (articleObj) => {
  articleObj.viewcount = 0
  // 1. 验证文章作者用户是否存在
  // 2. 验证文章所属标签是否存在
  // 3. 验证对象是否符合要求
  // 4. 将文章的审核状态设置为waiting
  articleObj = pick(articleObj, 'cover', 'title', 'content', 'abstract', 'viewcount', 'UserId', 'LabelId')
  if (!hasProperty(articleObj)) {
    return {
      code: "400",
      msg: '参数缺失'
    }
  }
  // 制定验证规则
  const rules = {
    cover: {
      presence: undefined
    },
    abstract: {
      presence: {
        allowEmpty: false,
      },
      length: {
        minimum: 20,
        maximum: 80,
        message: "must be length is 20-80",
      },
      type: "string",
    },
    title: {
      presence: {
        allowEmpty: false,
      },
      length: {
        minimum: 2,
        maximum: 50,
        message: "must be length is 1-50",
      },
      type: "string",
    },
    content: {
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
    LabelId: {
      presence: {
        allowEmpty: false,
      },
      numericality: {
        onlyInteger: true,
        strict: false,
      },
      // 拓展的方法
      LabelIsExist: true,
    },
  }

  try {
    await validate.async(articleObj, rules)
  } catch (error) {
    return {
      code: '400',
      msg: error
    }
  }
  // 将文章的状态设置为审核中：
  articleObj.viewcount = 0
  articleObj.review = 'waiting'
  const ins = Article.build(articleObj)
  const res = await ins.save()
  const result = res.toJSON()
  // 写入系统消息
  // 您的文章《fdajkf》已发布成功，正在等待管理员审核，请耐心等待
  await addAdminNotice({
    UserId: result.UserId,
    content: `您的文章《${result.title}》已发布成功，正在等待管理员审核，请耐心等待`
  })
  return {
    code: '200',
    msg: 'success',
    data: result
  }
}

/**
 * 删除文章
 * @param {*} articleId 
 */
const deleteArticle = async (userId, articleId) => {
  if (!articleId || !userId) {
    return {
      code: '400',
      msg: "参数缺失"
    }
  }
  const res = await Article.destroy({
    where: {
      id: +articleId
    }
  })
  if (Array.isArray(res)) {
    return res[0] ? { code: '200', msg: '删除成功', data: "删除成功" } : { code: "400", msg: "删除失败" };
  } else {
    return res ? { code: '200', msg: '删除成功', data: "删除成功" } : { code: "400", msg: "删除失败" };
  }
}

/**
 * 更新文章
 * @param {*} articleId 文章id 
 * @param {*} articleObj 
 */
const updateArticle = async (userId, articleId, articleObj) => {
  articleObj = pick(articleObj, 'cover', 'title', 'abstract', 'LabelId', 'content')
  if (!articleId || !hasProperty(articleObj)) {
    return {
      code: "400",
      msg: "参数缺失"
    }
  }

  const rules = {
    cover: {
      presence: undefined
    },
    title: {
      presence: undefined,
      length: {
        minimum: 2,
        maximum: 50,
        message: "must be length is 1-50",
      },
      type: "string",
    },
    abstract: {
      presence: undefined,
      length: {
        minimum: 20,
        maximum: 80,
        message: "must be length is 20-80",
      },
      type: "string",
    },
    content: {
      presence: undefined,
      type: "string",
    },
    LabelId: {
      presence: undefined,
      numericality: {
        onlyInteger: true,
        strict: false,
      },
      // 拓展的方法
      LabelIsExist: true,
    },
  }
  try {
    await validate.async(articleObj, rules)
  } catch (error) {
    return {
      code: "400",
      msg: error
    }
  }
  const res = await Article.update(articleObj, {
    where: {
      id: +articleId,
      UserId: +userId
    }
  })
  if (Array.isArray(res)) {
    return res[0] ? { code: '200', msg: '修改成功', data: "修改成功" } : { code: "400", msg: "修改失败" };
  } else {
    return res ? { code: '200', msg: '修改成功', data: "修改成功" } : { code: "400", msg: "修改失败" };
  }
}

/**
 * 获取所有文章
 * 可以根据如下属性对文章进行筛选
 * 1. 标签
 * 2. 作者
 * 3. 标题(模糊查找)
 * 4. 审核状态
 * 
 * 还应该获取该文章的点赞量与评论量
 * 
 */
const getAllArticles = async ({
  page = 1,
  size = 10,
  LabelId = 'all',
  review = 'all',
  author = '',
  title = '',
  UserId = ''
} = {}) => {
  let options = {};
  if (author) {
    options.author = {
      [Op.like]: `%${author}%`
    }
  }
  // 标签中文
  if (LabelId != 'all') {
    options.LabelId = LabelId
  }
  if (review != 'all') {
    options.review = review
  }
  if (title) {
    options.title = {
      [Op.like]: `%${title}%`
    }
  }
  if (UserId) {
    options.UserId = UserId
  }
  const res = await Article.findAndCountAll({
    attributes: ['id', 'cover', 'title', 'content', 'abstract', 'viewcount', 'review', 'UserId', 'createdAt', 'LabelId'],
    offset: (page - 1) * +size,
    limit: +size,
    where: pick(options, 'UserId', 'title', 'review', 'LabelId'),
    order: [
      ['createdAt', 'DESC'],
    ],
    include: [
      {
        model: User,
        attributes: ['author', 'count', 'id', 'username', 'UserInfoId'],
        where: pick(options, 'author'),
        include: [
          {
            model: UserInfo,
            attributes: ['avatar', 'autograph']
          }
        ]
      },
      {
        model: Label,
        attributes: ['id', 'tag']
      }
    ]
  })


  // 未完成 对点赞、评论的计数
  // const num = await Article.count({
  //   where:{
  //     review:'waiting'
  //   }
  // })
  // console.log(num)
  const temp = JSON.parse(JSON.stringify(res.rows))
  let result = await handleCount(temp)
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
 * 获取文章详情
 * 也需要获取文章的点赞量与评论量
 * @param {*} articleId 
 */
const getArticleDetail = async (articleId) => {
  // 获取详情时需要把浏览量+1 
  if (!articleId) {
    return {
      code: '400',
      msg: "参数缺失"
    }
  }
  const findRes = await Article.findOne({
    attributes: ['id', 'cover', 'title', 'content', 'abstract', 'viewcount', 'review', 'UserId', 'createdAt', 'LabelId'],
    where: {
      id: +articleId
    },
    include: [
      {
        model: User,
        attributes: ['author', 'id', 'count', 'username', 'UserInfoId'],
        include: [
          {
            model: UserInfo,
            attributes: ['avatar', 'autograph']
          }
        ]
      },
      {
        model: Label,
        attributes: ['id', 'tag']
      }
    ]
  })
  if (!findRes) {
    return {
      code: '400',
      msg: "该用户不存在"
    }
  }
  const result = findRes.toJSON()

  const commentcountRes = await countComment(articleId)
  const likecountRes = await countLike({ type: 'article', id: articleId })
  result.commentcount = commentcountRes.data
  result.likecount = likecountRes.data
  // 浏览量+1
  const viewCount = result.viewcount + 1

  await addViewCount(articleId, viewCount)
  return {
    code: '200',
    data: result
  }
}

/**
 * 将一篇文章的浏览量+1
 * @param {*} articleId 
 * @param {*} viewCount 
 */
const addViewCount = async (articleId, viewCount) => {
  if (!articleId) {
    return {
      code: '400',
      msg: "参数缺失"
    }
  }
  // 更改浏览量
  const updateObj = {
    viewcount: viewCount
  }
  await Article.update(updateObj, {
    where: {
      id: +articleId
    }
  })
}

/**
 * 计算每一项中的点赞、评论
 * @param {Array} arr 
 */
const handleCount = async (arr) => {
  const result = await Promise.all(arr.map(async item => {
    const commentCountRes = await countComment(item.id)
    const likeCountRes = await countLike({ type: 'article', id: item.id })
    return {
      ...item,
      commentcount: commentCountRes.data,
      likecount: likeCountRes.data
    }
  }))
  return result
}



const changeArticleReview = async (articleId, review) => {
  if (!articleId || !review) {
    return {
      code: "400",
      msg: "参数缺失"
    }
  }
  const res = await Article.update({ review }, {
    where: {
      id: +articleId
    }
  })
  if (Array.isArray(res)) {
    return res[0] ? { code: '200', msg: '评审成功', data: "评审成功" } : { code: "400", msg: "评审失败" };
  } else {
    return res ? { code: '200', msg: '评审成功', data: "评审成功" } : { code: "400", msg: "评审失败" };
  }

}

module.exports = {
  addArticle,
  changeArticleReview,
  deleteArticle,
  updateArticle,
  getAllArticles,
  getArticleDetail,
  countArticle
}
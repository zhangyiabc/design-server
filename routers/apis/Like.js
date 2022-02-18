// 关于点赞的接口
const express = require("express");
const { hasProperty } = require("../../utils/hasProperty");
const router = express.Router();
const { getAllLikeForArticle, getAllLikeForUser, countLike, handleCancelLike, handleLike } = require('../../services/modules/Like');
const { handleSend } = require("../../utils/resultMessage");

// 根据文章或者用户获取点赞
router.get('/', async (req, res) => {
  if (!hasProperty(req.query)) {
    handleSend({ code: 400, msg: "参数缺少" }, res)
  }
  let result
  //req.query.type 取值为art 或者 user
  if (req.query.type == 'art') {
    result = await getAllLikeForArticle({
      page: req.query.page,
      size: req.query.size,
      articleId: req.query.id
    })
  } else {
    result = await getAllLikeForUser({
      page: req.query.page,
      size: req.query.size,
      userId: req.query.id
    })
  }
  handleSend(result, res)
})

// 进行点赞
router.post('/', async (req, res) => {
  if (!hasProperty(req.body)) {
    handleSend({ code: 400, msg: "参数缺少" }, res)
  }
  const result = await handleLike(req.userId, req.body.articleId)
  handleSend(result, res)

})

// 取消点赞
router.post('/cancel', async (req, res) => {
  if (!hasProperty(req.body)) {
    handleSend({ code: 400, msg: "参数缺少" }, res)
  }
  const result = await handleCancelLike(req.userId, req.body.articleId)
  handleSend(result, res)

})

// 统计点赞次数
router.get('/count', async (req, res) => {
  if (!hasProperty(req.query)) {
    handleSend({ code: 400, msg: "参数缺少" }, res)
  }
  const result = await countLike(req.query)
  handleSend(result, res)
})

module.exports = router
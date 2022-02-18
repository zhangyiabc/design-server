// 关于文章的接口
const express = require("express");
const router = express.Router();
const { getAllArticles, countArticle, getArticleDetail, updateArticle, deleteArticle, changeArticleReview, addArticle } = require('../../services/modules/Article');
const { addCount } = require("../../services/modules/User");
const { hasProperty } = require("../../utils/hasProperty");
const { handleSend } = require('../../utils/resultMessage')

// 新增文章
router.post('/', async (req, res) => {
  if (!hasProperty(req.body)) {
    handleSend({ code: 400, msg: "参数缺少" }, res)
  }
  const result = await addArticle({
    ...req.body,
    UserId: req.userId
  })
  handleSend(result, res)
})

// 修改文章
router.put('/', async (req, res) => {
  if (!hasProperty(req.body)) {
    handleSend({ code: 400, msg: "参数缺少" }, res)
  }
  const result = await updateArticle(req.userId, req.body.id, req.body.articleObj)
  handleSend(result, res)
})

// 统计数量
router.get('/count', async (req, res) => {
  const result = await countArticle(req.query.labelId, req.query.userId)
  handleSend(result, res)
})


// 获取所有文章
router.get('/', async (req, res) => {
  let result = await getAllArticles(req.query)
  handleSend(result, res)
})

// 获取文章详情
router.get('/:id', async (req, res) => {
  const result = await getArticleDetail(req.params.id)
  handleSend(result, res)
})

// 删除文章
router.delete('/', async (req, res) => {
  if (!hasProperty(req.body)) {
    handleSend({ code: 400, msg: "参数缺少" }, res)
  }
  const result = await deleteArticle(req.userId, req.body.id)
  handleSend(result, res)
})

// 对文章进行评审
router.post('/review', async (req, res) => {
  if (!hasProperty(req.body)) {
    handleSend({ code: 400, msg: "参数缺少" }, res)
  }
  const result = await changeArticleReview(req.body.id, req.body.review)
  const detail = await getArticleDetail(req.body.id)
  // console.log(detail)
  if(req.body.review === 'success'){
    await addCount(detail.data.UserId)
  }
  handleSend(result, res)
})


module.exports = router
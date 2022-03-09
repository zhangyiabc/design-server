const express = require("express");
const { getAllComment, addComment, countComment, deleteComment } = require("../../services/modules/Comment");
const { hasProperty } = require("../../utils/hasProperty");
const { handleSend } = require("../../utils/resultMessage");
const router = express.Router();

// 获取文章下所有评论
router.get('/', async (req, res) => {
  if (!hasProperty(req.query)) {
    handleSend({ code: 400, msg: "参数缺少" }, res)
  }
  const result = await getAllComment(req.query)
  handleSend(result, res)
})

// 进行评论
router.post('/', async (req, res) => {
  if (!hasProperty(req.body)) {
    handleSend({ code: 400, msg: "参数缺少" }, res)
  }
  const result = await addComment({
    ...req.body,
    UserId: req.userId
  })
  handleSend(result, res)
})

// 删除评论
router.delete('/', async (req, res) => {
  if (!hasProperty(req.body)) {
    handleSend({ code: 400, msg: "参数缺少" }, res)
  }
  const result = await deleteComment({
    ...req.body,
    userId: req.userId
  })
  handleSend(result, res)
})

// 计数评论
router.get('/count', async (req, res) => {
  const result = await countComment(req.query)
  handleSend(result, res)
})

module.exports = router

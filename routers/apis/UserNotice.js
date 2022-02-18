// 用户消息接口
const express = require("express");
const router = express.Router();
const { getUserNoticeDetail, getAllNotice } = require('../../services/modules/UserNotice');
const { hasProperty } = require("../../utils/hasProperty");
const { handleSend } = require("../../utils/resultMessage");

// 获取所有消息
router.get('/', async (req, res) => {
  if (!hasProperty(req.query)) {
    handleSend({ code: 400, msg: "参数缺少" }, res)
  }
  const result = await getAllNotice(req.query)
  handleSend(result, res)
})

router.get('/:id', async (req, res) => {
  const result = await getUserNoticeDetail(req.params.id)
  handleSend(result, res)
})

module.exports = router
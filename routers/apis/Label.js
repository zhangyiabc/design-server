const express = require("express");
const router = express.Router();
const { addLabel, deleteLabel, updateLabel, getAllLabel, labelCount } = require('../../services/modules/Label')
const { handleSend } = require('../../utils/resultMessage')


// 获取所有标签
router.get('/', async (req, res) => {
  const result = await getAllLabel()
  handleSend(result, res)
})

router.get('/count',async (req,res) => {
  const result = await labelCount()
  handleSend(result,res)
})

// 更改标签
router.put('/', async (req, res) => {
  const result = await updateLabel(req.body.id, { tag: req.body.tag })
  handleSend(result, res)
})

// 删除标签
router.delete('/', async (req, res) => {
  // 目前没有做删除功能
  handleSend({ code: "405", msg: "目前不能删除标签" }, res)
})

// 新增标签
router.post('/', async (req, res) => {
  const result = await addLabel({ tag: req.body.tag })
  handleSend(result, res)
})

module.exports = router
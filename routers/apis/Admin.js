const express = require("express");
const router = express.Router();
const { login, getAdminDetail } = require('../../services/modules/Admin')
const { handleSend } = require('../../utils/resultMessage')
const jwt = require('../jwt/index')
const { hasProperty } = require('../../utils/hasProperty')
router.post('/login', async (req, res) => {
  if (!hasProperty(req.body)) {
    handleSend({ code: 400, msg: "参数缺少" }, res)
  }
  const result = await login(req.body.username, req.body.password)
  if (result.code == '200') {
    // 发放jwt
    let id = result.data.id
    jwt.publish(res, 3600 * 24 * 1000, { id,type:"admin" })
  }
  handleSend(result, res)
})

router.get('/whoami',async (req,res) => {
  const result = await getAdminDetail(req.adminId)
  handleSend(result,res)
})

module.exports = router
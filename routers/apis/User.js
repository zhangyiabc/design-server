const express = require("express");
const router = express.Router();
const { login, addUser, updateUser, getAllUsers, getUserDetail, countUserSex, orderUser } = require('../../services/modules/User');
const { hasProperty } = require("../../utils/hasProperty");
const { handleSend } = require('../../utils/resultMessage')
const jwt = require('../jwt/index')

// 登录用户
router.post('/login', async (req, res) => {
  if (!hasProperty(req.body)) {
    handleSend({ code: 400, msg: "参数缺少" }, res)
  }
  const result = await login(req.body.username, req.body.password)
  if (result.code == '200') {
    // 发放jwt
    let id = result.data.id
    jwt.publish(res, 3600 * 24 * 1000, { id })
  }
  // 建立socket连接
  // 将这个socket放入socket数组

  handleSend(result, res);
})

// 注册用户
router.post("/register", async (req, res) => {
  if (!hasProperty(req.body)) {
    handleSend({ code: 400, msg: "参数缺少" }, res)
  }

  // 验证验证码
  // if (req.body.captcha == req.captcha) {
  //   const result = await addUser(req.body)
  //   handleSend(result, res);
  // } else {
  //   handleSend({ code: 400, msg: "验证码错误！" }, res)
  // }
  const result = await addUser(req.body)
  handleSend(result, res);

})

// 修改用户信息
router.put('/', async (req, res) => {
  if (!hasProperty(req.body)) {
    handleSend({ code: 400, msg: "参数缺少" }, res)
  }
  const result = await updateUser(req.userId, req.body)
  handleSend(result, res)
})

// 获取所有用户
router.get('/', async (req, res) => {
  const result = await getAllUsers(req.query)
  handleSend(result, res)
})

router.get('/order', async (req, res) => {
  const result = await orderUser(req.query)
  handleSend(result, res)
})

router.get('/countSex', async (req, res) => {
  const result = await countUserSex()
  handleSend(result, res)
})

// 获取用户详情
router.get('/:id', async (req, res) => {
  const result = await getUserDetail(req.params.id)
  handleSend(result, res)
})

module.exports = router
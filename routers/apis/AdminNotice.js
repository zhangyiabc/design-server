const express = require("express");
const { getAllAdminNotice, getAdminNoticeDetail, addAdminNotice } = require("../../services/modules/AdminNotice");
const { getTotalUsers } = require("../../services/modules/User");
const { hasProperty } = require("../../utils/hasProperty");
const { handleSend } = require("../../utils/resultMessage");
const router = express.Router();
// 系统消息接口
// 获取用户收到的所有消息
router.get('/', async (req, res) => {
  const result = await getAllAdminNotice({
    ...req.query,
    userId: req.userId
  })
  handleSend(result, res)
})

// 管理员获取所有消息
router.get('/all', async (req, res) => {
  const result = await getAllAdminNotice({
    ...req.query
  })
  handleSend(result, res)
})

// 获取消息详情
router.get('/:id', async (req, res) => {
  const result = await getAdminNoticeDetail(req.params.id)
  handleSend(result, res)
})

// 新增一条系统消息
router.post('/', async (req, res) => {
  if (!hasProperty(req.body)) {
    handleSend({ code: 400, msg: "参数缺少" }, res)
  }
  // 如果给多个用户发送消息，说明此时的消息内容一致
  const { content, users } = req.body

  let result
  if (Array.isArray(users) && users.length > 0) {
    result = await sendMessage(users, content)
    // console.log(result)
    handleSend(result, res)
  } else if (Array.isArray(users) && users.length == 0) {
    // 获取所有用户的id
    // 依次向每个用户发送消息
    const allUserInfo = await getTotalUsers()

    const userIds = handleUserId(allUserInfo.data)

    result = await sendMessage(userIds, content)
    handleSend(result, res)
  } else {
    handleSend({ code: 400, msg: "users 参数类型错误" }, res)
  }
  
})


/**
 * 根据用户数组，向数组内每一个用户发送消息
 * @param {array} users 
 */
const sendMessage = async (users, content) => {

  const result = await Promise.all(users.map(async (item) => {
    const res = await addAdminNotice({ content, UserId: +item })
    // console.log(res)
    return res
  }))
  
  if (isSuccess(result)) {
    return {
      code: '200',
      msg: "success",
      data: "发送成功"
    }
  }else{
    return result
  }
}

/**
 * 判断每一个结果是不是成功的
 * @param {array} results 
 */
function isSuccess(results) {
  for (const item of results) {
    if (item.code != '200') {
      return false
    }
  }
  return true
}

/**
 * 处理所有用户的id
 * @param {array} userIds 
 */
const handleUserId = (userIds) => {
  const arr = []
  for (const item of userIds) {

    arr.push(item.id)
  }
  return arr
}

module.exports = router
let { users } = require('../socketList')
const { changeOnlineStatus } = require('../../services/modules/User')
// 判断数组中有没有这一项
/**
 * 
 * @param {Array} arr 
 * @param {*} user 
 */
const isUserHas = (arr, userId) => {
  if (arr.length === 0) {
    return false
  }
  for (const item of arr) {
    if (item.userId === userId) {
      return true
    }
  }
  return false
}
module.exports = function (socket) {
  // data是一个对象{userId：userId}
  socket.on('login', async (data) => {
    // 先判断数组中有没有，没有才能加入
    if (!isUserHas(users, data.userId)) {
      // 加入users列表
      users.push({
        userId: data.userId,
        socket
      })
    }
    await changeOnlineStatus(data.userId, 'yes')

    // 告诉管理员有用户登录了，请重新调接口
    socket.broadcast.emit('adminUpdateUser', {
      type: 'in',
      userId: data.userId
    })
  })
}
// 处理退出登录的socket
const { changeOnlineStatus } = require('../../services/modules/User')
let { users } = require('../socketList')

module.exports = function (socket) {
  // data是一个对象{username：userId}
  socket.on('loginOut', (data) => {
    // 移除users列表
    for (let i = 0; i < users.length; i++) {
      if (users[i]['userId'] == data.userId) {
        users.splice(i, 1)
      }
    }
    // 更改登录状态
    changeOnlineStatus(data.userId, 'no').then(() => {
      socket.emit('adminUpdateUser', {
        type: 'out',
        userId: data.userId
      })
    })

  })
}
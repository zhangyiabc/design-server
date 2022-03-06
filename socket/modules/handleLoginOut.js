// 处理退出登录的socket
const { changeOnlineStatus } = require('../../services/modules/User')
let {users} = require('../socketList')

module.exports = function (socket) {
  // data是一个对象{username：userId}
  socket.on('loginOut', (data) => {
    // 移除users列表
    users = users.filter(it => it.userId != data.userId)
    console.log(users)
    // 更改登录状态
    changeOnlineStatus(data.userId, 'no').then(() => {
      socket.emit('adminGetUser', data)
    })
    
  })
}
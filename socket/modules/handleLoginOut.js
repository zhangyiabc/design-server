// 处理退出登录的socket
const { changeOnlineStatus } = require('../../services/modules/User')
let user = require('../socketList')

module.exports = function (socket) {
  // data是一个对象{username：userId}
  socket.on('loginOut', (data) => {
    // 移除users列表
    user = user.filter(it => it.username != data.username)
    // 更改登录状态
    changeOnlineStatus(data.username, 'no').then(() => {
      socket.emit('adminGetUser', data)
    })
    
  })
}
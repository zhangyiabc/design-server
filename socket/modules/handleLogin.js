let user = require('../socketList')
module.exports = function (socket) {
  // data是一个对象{username：userId}
  socket.on('login', (data) => {
    // 加入users列表
    user.push({
      username: data.username,
      socket
    })
    // 告诉管理员有用户登录了，请重新调接口
    socket.emit('adminGetUser', data)
  })
}
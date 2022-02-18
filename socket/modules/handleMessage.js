const { hasProperty } = require('../../utils/hasProperty')
const users = require('../socketList')

module.exports = function (socket) {
  // data是一个对象{from:操作人Id,to:目标人id}
  socket.on('newUserMessageIn', (data) => {
    // 判断这个人是否在线
    const temp = users.filter(it => it.username == data.to)
    const u = temp[0]
    if (hasProperty(u)) {
      u.socket.emit('getUserNotice')
    }
  })
  // 
  socket.on('newAdminMessage', (data) => {
    // 判断to是不是'all'
    if (data.to == 'all') {
      socket.broadcast.emit('getAdminNotice')
    } else {
      const temp = users.filter(it => it.username == data.to)
      const u = temp[0]
      if (hasProperty(u)) {
        u.socket.emit('getAdminNotice')
      }
    }
  })
}
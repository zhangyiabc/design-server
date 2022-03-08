let { users } = require('../socketList')
const { changeOnlineStatus } = require('../../services/modules/User')
module.exports = function (socket) {
  
  socket.on('disconnect', async () => {
    let disConnUserId
    for (let i = 0; i < users.length; i++) {
      if (users[i]['socket']['id'] == socket.id) {
        disConnUserId = users[i]['userId']
        users.splice(i, 1)
      }
    }
    await changeOnlineStatus(disConnUserId, 'no')
    socket.broadcast.emit('adminUpdateUser', {
      type: 'out',
      userId: disConnUserId
    })
  })
}
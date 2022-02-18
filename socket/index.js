const socketIO = require('socket.io')
const handleLogin = require('./modules/handleLogin')
const handleLoginOut = require('./modules/handleLoginOut')
const handleMessage = require('./modules/handleMessage')
module.exports = function (server) {
  const io = socketIO(server)
  io.on('connection', (socket) => {
    // 处理登录的socket
    handleLogin(socket)
    // 处理消息的socket
    handleMessage(socket)
    // 处理退出登录的socket
    handleLoginOut(socket)
  })
}
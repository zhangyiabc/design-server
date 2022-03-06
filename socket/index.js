const socketIO = require('socket.io')
const handleLogin = require('./modules/handleLogin')
const handleLoginOut = require('./modules/handleLoginOut')
const handleMessage = require('./modules/handleMessage')
module.exports = function (server) {
  const io = socketIO(server, { allowEI03: true, cors: true })
  io.listen(8021)
  io.on('connection', (socket) => {
    console.log('后端这边连上了')
    // 处理登录的socket
    handleLogin(socket)
    // 处理消息的socket
    handleMessage(socket)
    // 处理退出登录的socket
    handleLoginOut(socket)
    
    // 断开时候
    socket.on('disconnect',(data) => {
      console.log('此时客户端断开了')
      console.log(data)
    })
  })
}
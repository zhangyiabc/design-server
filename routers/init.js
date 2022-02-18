const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)
require('../socket/index')(server)
const cors = require('cors')
const port = 6789
const path = require('path')
const { cookieParser } = require('./middleware/cookieMiddleware')
const history = require('connect-history-api-fallback')

app.use(history(
  {
    rewrites: [
      {
        from: /^\/api\/.*$/,
        to: function (context) {
          return context.parsedUrl.path
        }
      }
    ]
  }
))

// 访问静态资源
const staticDir = path.resolve(__dirname, '../public')
app.use(express.static(staticDir))

// 设置跨域
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        callback(null, '*')
        return
      }
      callback(null, origin)
    }
  })
)

// 处理cookie的中间件
app.use(cookieParser())

// 处理token的中间件
app.use(require('./middleware/tokenMiddleware'))


// post请求的两种方式进行解析
// 解析 application/x-www-form-urlencoded 格式的请求体
app.use(express.urlencoded({ extended: true }));

// 解析 application/json 格式的请求体
app.use(express.json());

// 处理记录api日志的中间件
app.use(require("./middleware/apiLoggerMiddleware"));

// 验证码
app.use('/api/captcha', require('./apis/captcha'))

// 处理api
app.use('/api/admin', require('./apis/Admin'))
app.use('/api/user', require('./apis/User'))
app.use('/api/label', require('./apis/Label'))
app.use('/api/article', require('./apis/Article'))
app.use('/api/like', require('./apis/Like'))
app.use('/api/adminNotice', require('./apis/AdminNotice'))
app.use('/api/comment', require('./apis/Comment'))
app.use('/api/userNotice', require('./apis/UserNotice'))

// 文件上传
app.use('/api/upload', require('./apis/Upload'))

app.listen(port, () => {
  console.log(`正在访问${port}`)
})
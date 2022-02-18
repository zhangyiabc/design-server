const { sequelize } = require('./db')

// 同步所有模型
require('./modules/User')
require('./modules/Admin')
require('./modules/Label')

require('./modules/Article')
require('./modules/Comment')
require('./modules/Like')
require('./modules/Admin_Notice')
require('./modules/User_Notice')
require('./modules/UserInfo')

sequelize.sync({alter:true}).then((res) => {
  console.log('所有模型已同步')
})
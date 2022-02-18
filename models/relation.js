const Label = require('./modules/Label')
const Article = require('./modules/Article')
const Comment = require('./modules/Comment')
const UserInfo = require('./modules/UserInfo')
const User = require('./modules/User')
const Like = require('./modules/Like')
const UserNotice = require('./modules/User_Notice')
const AdminNotice = require('./modules/Admin_Notice')

User.hasMany(Comment)
Comment.belongsTo(User)

User.hasMany(Article)
Article.belongsTo(User)

Label.hasOne(Article)
Article.belongsTo(Label)

User.hasMany(Like)
Like.belongsTo(User)

Article.hasMany(Like)
Like.belongsTo(Article)

UserInfo.hasOne(User)
User.belongsTo(UserInfo)

User.hasOne(UserNotice)
UserNotice.belongsTo(User)

User.hasOne(AdminNotice)
AdminNotice.belongsTo(User)
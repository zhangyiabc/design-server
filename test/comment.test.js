const { addComment, deleteComment, getAllComment, countComment } = require("../services/modules/Comment");

// 新增评论
addComment({
  type: 'art',
  content: '你真好看 1-12测试',
  objectId: '1',
  UserId: "8"
}).then(res => {
  console.log(res)
})

// getAllComment({articleId:'1'}).then(res => {
//   if(res.code == '200'){
//     console.log(res.data)
//   }
//   console.log('========================================================================')
//   res.data.data.forEach(it => {
//     console.log(it.User)
//   })
// })


// getAllComment({ articleId: '4' }).then(res => {
//   if (res.code == '200') {
//     console.log(res.data)
//   }
//   console.log('========================================================================')
//   res.data.data.forEach(it => {
//     console.log(it.User)
//   })
// })

// 测试评论数量
// countComment('1').then(res => {
//   console.log(res)
// })

// 删除评论测试
// 本人删本人
// deleteComment({
//   id: '6',
//   articleId: "1",
//   userId: '7'
// }).then(res => {
//   console.log(res)
// })

// 作者删其他人
// deleteComment({
//   id: '1',
//   articleId: "4",
//   userId: '11'
// }).then(res => {
//   console.log(res)
// })

const {
  addArticle,
  deleteArticle,
  updateArticle,
  getAllArticles,
  getArticleDetail
} = require('../services/modules/Article')

// addArticle({
//   cover:"",
//   title:"待删除测试",
//   content:"这是一段内容这是一段内容这是一段内容这是一段内容",
//   UserId:'11',
//   LabelId:'6'
// }).then(res => {
//   console.log(res)
// })

// getArticleDetail(1).then(res => {
//   console.log(res.data)
// })

// 查找 作者
// getAllArticles({author:"高龙龙"}).then(res => {
//   console.log(res.data.data)
// })

// getAllArticles({ author:"高" }).then(res => {
//   console.log(res.data)
// })

// getAllArticles({ title:"哈士奇" }).then(res => {
//   console.log(res.data)
// })

// getAllArticles({ title:"金毛" }).then(res => {
//   console.log(res.data)
// })

// getAllArticles({}).then(res => {
//   console.log(res.data.data)
// })

// getAllArticles().then(res => {
//   console.log(res.data.data)
// })

// getAllArticles({ size: 1 }).then(res => {
//   console.log(res.data)
// })

// 获取文章详情
// getArticleDetail(4).then(res => {
//   console.log(res)
// })

// 删除测试
// deleteArticle(6).then(res => {
//   console.log(res)
// })

// 修改测试
// updateArticle(3, {
//   // cover:'https://img1.baidu.com/it/u=1077279439,1373752710&fm=253&fmt=auto&app=138&f=JPEG?w=713&h=500'
//   title: "如何养金毛？"
// }).then(res => {
//   console.log(res)
// })

// updateArticle(3, {
//   // cover:'https://img1.baidu.com/it/u=1077279439,1373752710&fm=253&fmt=auto&app=138&f=JPEG?w=713&h=500'
//   // title: "如何养金毛？"
//   LabelId:'8'
// }).then(res => {
//   console.log(res)
// })

getAllArticles().then(res => {
  console.log(res.data)
})
const { handleLike, handleCancelLike, countLike, getAllLikeForArticle, getAllLikeForUser } = require("../services/modules/Like");


// handleLike(7,2).then(res => {
//   console.log(res)
// })

// handleLike(7, 4).then(res => {
//   console.log(res)
// })

// countLike({ type: "user", id: '7' }).then(res => {
//   console.log(res)
// })

// countLike({ type: "article", id: '1' }).then(res => {
//   console.log(res)
// })

// getAllLikeForArticle({articleId:'1'}).then(res => {
//   console.log(res)
//   res.data.data.forEach(it => {
//     console.log(it.User)
//     console.log(it.Article)
//   })
// })

// getAllLikeForUser({userId:'7'}).then(res => {
//   console.log(res.data)
//     res.data.data.forEach(it => {
//     console.log(it.User)
//     console.log(it.Article)
//   })
// })
const { getAllUsers, addUser,updateUser,getUserDetail } = require('../services/modules/User')

addUser({
  username: '13085296112',
  password: '1120768996',
  author: "披甲龙龟",
}).then(res => {
  if (res.code == '200') {
    console.log(res.data)
  }
  else {
    console.log('12 报错信息是：',res)
  }
})

// login('123456789','1120768996zy').then(res => {
//   if(res.code == '200'){
//     console.log(res.data)
//   }
//   else{
//     console.log(res.msg)
//   }

// })

// 查找
// getAllUsers().then(res => {
//   if (res.code == '200') {
//     const result = res.data
    
//     const data = result.data
//     console.log(data)
//     console.log('====================================================')
//     for (const item of data) {
//       console.log(item.UserInfo)
//     }

//   }
// })
// 条件查找
// getAllUsers({page:1,size:20,sex:'1'}).then(res => {
//   if (res.code == '200') {
//     const result = res.data
    
//     const data = result.data
//     console.log(result)
//     console.log('====================================================')
//     for (const item of data) {
//       console.log(item.UserInfo)
//     }

//   }
// })


// updateUser('9',{
//   password:"zhangy89999",
//   author:"张益达",
//   sex:'1',
//   tel:"13085296112",
//   email:"1120768996@qq.com",
//   autograph:"hhhhhhhhhh"
// }).then(res => {
//   console.log(res)
// }).catch(err => {
//   console.log(err)
// })

// getUserDetail(7).then(res => {
//   if(res.code === '200'){
//     console.log(res.data)
//   }
// })
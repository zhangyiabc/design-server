const { addLabel, getAllLabel, updateLabel, deleteLabel } = require("../services/modules/Label");

const arr = ['算法', '前端', '后端', '人工智能', '大数据', '全栈', '嵌入式', 'NLP', '图像视觉', '产品设计', '物联网', '测试', '信息安全', '区块链', 'Android', 'ios', '小程序', '云计算', 'Linux运维', '操作系统', '网络', '设计模式']



// addLabel({
//   tag: "张毅",
// }).then(res => {
//   if (res.code === '200') {
//     console.log(res.data)
//   }
// })
// getAllLabel().then(res => {
//   if (res.code == '200') {
//     console.log(res.data)
//   }
// })

// updateLabel(24,{
//   tag:'李四'
// }).then(res => {
//   console.log(res)
// })

// deleteLabel(24).then(res => {
//   console.log(res)
// })
const { addAdminNotice, getAdminNoticeDetail, getAllAdminNotice } = require('../services/modules/AdminNotice')
// addAdminNotice({
//   UserId:'13',
//   content:"尊敬的用户您好！你的文章《钢铁是怎样炼成的》涉嫌不良信息，请尽快删除！",
// }).then(res => {
//   console.log(res)
// })

getAllAdminNotice({UserId:'13'}).then(res => {
  console.log(res.data)
})